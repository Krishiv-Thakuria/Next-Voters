import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

// This includes the list of supported countries and their political parties (switch to db later on)
import supportedCountriesDetails from "@/data/supported-regions";

import { SupportedCountry } from "@/types/supported-regions";

export const POST = async (request: NextRequest) => {
  try {
    const { query, region,  } = await request.json();
    const collectionName = "political_documents";
    const responses = [];

    if (!query) {
    throw new Error("Query is required")
  }

  if (!region) {
    throw new Error("Region is required")
  }
  
  const regionDetail = supportedCountriesDetails.find(
    regionItem => regionItem.name === region 
  );

  if (!regionDetail) {
    throw new Error("Region or election type are not supported")
  }

  regionDetail.politicalParties.map(async (partyName) => {
    const contexts = [];
    const citations = [];

    const embeddings = await searchEmbeddings(
      query, 
      collectionName, 
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
} catch (error) {
    return Response.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}