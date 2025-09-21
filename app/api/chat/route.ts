import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

// This includes the list of supported countries and their political parties
import supportedCountriesDetails from "@/data/supported-countries";

import { SupportedCountry } from "@/types/supported-countries";

export const POST = async (request: NextRequest) => {
  const { userQuery, country } = await request.json();
  const responses = [];

  const countryDetail = supportedCountriesDetails.find(countryItem => countryItem.name === country);

  if (!countryDetail) {
    return Response.json({
      error: "Country not supported"
    }, { status: 400 });
  }

  countryDetail.politicalParties.map(async (party) => {
    // Filter based on qdrant payload values (country + political affiliation/party)
    const filterObject = {
      must: [
        {
          key: "country",
          match: { value: country },
        },
        {
          key: "political_affiliation",
          match: { value: party.name}, 
        }
      ],
    };

    // Store contexts and citations separately which is given by embeddings
    const contexts = [];
    const citations = [];

    const embeddings = await searchEmbeddings(
      userQuery, 
      "political_documents", 
      filterObject
    );

    embeddings.map(embedding => {
      contexts.push(embedding.payload.text);
      citations.push(embedding.payload.citation);
    }) ;

    const response = await generateResponses(
      userQuery,
      countryDetail.name as SupportedCountry, 
      contexts,
    );

    responses.push({
      country: countryDetail.name,
      response,
      citations
    });
  })

  return Response.json({
    responses
  });
}
