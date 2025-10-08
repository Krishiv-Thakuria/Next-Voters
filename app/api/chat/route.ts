import { generateResponseForParty, searchEmbeddings } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import supportedRegionDetails from "@/data/supported-regions";
import { SupportedCountry } from "@/types/supported-regions";

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

    const regionDetail = supportedRegionDetails.find(
      regionItem => regionItem.name === region
    );

    if (!regionDetail) {
      throw new Error("Region or election type are not supported");
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
        regionDetail.name as SupportedCountry,
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