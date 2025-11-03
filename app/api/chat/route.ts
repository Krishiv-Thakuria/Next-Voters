import { searchEmbeddings } from "@/lib/ai";
import { generateResponseForParty } from "@/lib/chat-platform/chat-response"
import { NextRequest, NextResponse } from "next/server";
import { supportedRegionDetails } from "@/data/supported-regions";
import { SupportedRegions } from "@/types/supported-regions";
import { Citation } from "@/types/citations";
import { removeDuplicateCitations } from "@/lib/chat-platform/citations";
import { AIAgentResponse } from "@/types/chat-platform/chat-platform";
import returnErrorResponse from "@/lib/error";
import { handleIncrementRequest, handleIncrementResponse } from "@/lib/analytics";

export const POST = async (request: NextRequest) => {
  try {
    const { prompt, region } = await request.json();

    if (!prompt || !region) {
      throw new Error("Prompt or region are required");
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
      const contexts: string[] = [];
      const citations: Citation[] = [];

      const embeddings = await searchEmbeddings(
        prompt,
        regionDetail.collectionName,
        region,
        partyName
      );

      if (!embeddings || !embeddings.points) {
        throw new Error("Embeddings data is missing or malformed");
      }

      embeddings.points.forEach(point => {
        contexts.push(point.payload.text as string);
        citations.push(point.payload.citation as Citation);
      });

      const response = await generateResponseForParty(
        prompt,
        regionDetail.name as SupportedRegions,
        partyName,
        contexts,
      );

      return {
        partyName,
        partyStance: response.partyStance,
        supportingDetails: response.supportingDetails,
        citations: removeDuplicateCitations(citations)  
      };
    });

    // Run parallel so that we can get all responses at the same time
    const responses = await Promise.all(responsePromises);

    await handleIncrementRequest();
    await handleIncrementResponse();

    return NextResponse.json({
      responses: responses as AIAgentResponse[],
      countryCode: regionDetail.code
    });
  } catch (error) {
    return returnErrorResponse(error);
  }
};