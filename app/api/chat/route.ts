import { searchEmbeddings } from "@/lib/ai";
import { generateResponseForParty } from "@/lib/chat-platform/chat-response"
import { NextRequest } from "next/server";
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

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        const sendChunk = (data: any) => {
          const chunk = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        };

        try {
          // Process each party response as they complete
          const responsePromises = regionDetail.politicalParties.map(async (partyName) => {
            try {
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

              const partyResponse: AIAgentResponse = {
                partyName,
                partyStance: response.partyStance,
                supportingDetails: response.supportingDetails,
                citations: removeDuplicateCitations(citations)  
              };

              // Send party response as it completes
              sendChunk({ type: 'party', data: partyResponse });
              
              return partyResponse;
            } catch (error) {
              console.error(`Error processing party ${partyName}:`, error);
              sendChunk({ 
                type: 'error', 
                partyName,
                message: error instanceof Error ? error.message : 'Unknown error'
              });
              return null;
            }
          });

          // Wait for all responses to complete
          await Promise.all(responsePromises);

          await handleIncrementRequest();
          await handleIncrementResponse();

          // Send completion signal
          sendChunk({ type: 'done' });
          controller.close();
        } catch (error) {
          sendChunk({ 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error'
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return returnErrorResponse(error);
  }
};