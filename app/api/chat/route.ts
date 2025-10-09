import { generateResponseForParty, searchEmbeddings } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import { supportedRegionDetails } from "@/data/supported-regions";
import { SupportedRegions } from "@/types/supported-regions";

console.log('Imported supportedRegionDetails:', supportedRegionDetails);
console.log('Type:', typeof supportedRegionDetails);
console.log('Is Array:', Array.isArray(supportedRegionDetails));

export const POST = async (request: NextRequest) => {
  try {
    const { prompt, region } = await request.json();
    const collectionName = "political_documents";

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    if (!region) {
      throw new Error("Region is required");
    }

    if (!supportedRegionDetails) {
      throw new Error("Supported regions data is not available");
    }

    const regionDetail = supportedRegionDetails.find(
      (regionItem) => regionItem.name === region
    );

    if (!regionDetail) {
      throw new Error("Region not found in supported regions");
    }

    const responsePromises = regionDetail.politicalParties.map(async (partyName) => {
      const contexts = [];
      const citations = [];

      const embeddings = await searchEmbeddings(
        prompt,
        collectionName,
        region,
        partyName
      );

      if (!embeddings || !embeddings.points) {
        throw new Error("Embeddings data is missing or malformed");
      }

      embeddings.points.forEach(point => {
        contexts.push(point.payload.text);
        citations.push(point.payload.citation);
      });

      const response = await generateResponseForParty(
        prompt,
        regionDetail.name as SupportedRegions,
        partyName,
        contexts,
      );

      return {
        partyName,
        response,
        citations
      };
    });

    const responses = await Promise.all(responsePromises);

    return NextResponse.json({
      responses,
      countryCode: regionDetail.code
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
};