import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

// This includes the list of supported countries and their political parties
import supportedCountriesDetails from "@/data/supported-regions";

import { SupportedCountry } from "@/types/supported-regions";

export const POST = async (request: NextRequest) => {
  const { query, region, electionType } = await request.json();
  const responses = [];

  const regionDetail = supportedCountriesDetails.find(
    regionItem => regionItem.name === region && regionItem.elections.includes(electionType)
  );

  if (!regionDetail) {
    return Response.json({
      error: "Region or election type are not supported"
    }, { status: 400 });
  }

  regionDetail.politicalParties.map(async (party) => {
    // Filter based on qdrant payload values (country + political affiliation/party)
    const filterObject = {
      must: [
        {
          key: "country",
          match: { value: region },
        },
        {
          key: "political_affiliation",
          match: { value: party}, 
        }
      ],
    };

    // Store contexts and citations separately which is given by embeddings
    const contexts = [];
    const citations = [];

    const embeddings = await searchEmbeddings(
      query, 
      "political_documents", 
      filterObject
    );

    embeddings.map(embedding => {
      contexts.push(embedding.payload.text);
      citations.push(embedding.payload.citation);
    }) ;

    const response = await generateResponses(
      query,
      regionDetail.name as SupportedCountry, 
      contexts,
    );

    responses.push({
      party,
      response,
      citations
    });
  })

  return Response.json({
    responses,
    countryCode: regionDetail.code
  });
}
