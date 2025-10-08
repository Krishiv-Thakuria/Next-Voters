import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

// This includes the list of supported countries and their political parties (switch to db later on)
import supportedCountriesDetails from "@/data/supported-regions";

import { SupportedCountry } from "@/types/supported-regions";

export const POST = async (request: NextRequest) => {
  const { query, region,  } = await request.json();
  const responses = [];

  const regionDetail = supportedCountriesDetails.find(
    regionItem => regionItem.name === region 
  );

  if (!regionDetail) {
    return Response.json({
      error: "Region or election type are not supported"
    }, { status: 400 });
  }

  regionDetail.politicalParties.map(async (partyName) => {
    const contexts = [];
    const citations = [];

    const embeddings = await searchEmbeddings(
      query, 
      "political_documents", 
      region,
      partyName
    );

    embeddings.points.map(point => {
      contexts.push(point.payload.text);
      citations.push(point.payload.citation);
    }) ;

    const response = await generateResponses(
      query,
      regionDetail.name as SupportedCountry, 
      contexts,
    );

    responses.push({
      partyName,
      response,
      citations
    });
  })

  return Response.json({
    responses,
    countryCode: regionDetail.code
  });
}
