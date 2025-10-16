import { MODEL_NAME } from "@/data/ai-config";
import { handleSystemPrompt } from "@/data/prompts";
import supportedRegionDetails from "@/data/supported-regions";
import { SupportedRegions } from "@/types/supported-regions";
import { openai } from "@/lib/ai";
import { generateObject } from "ai";
import z from "zod";

export const generateResponseForParty = async (
  prompt: string,
  country: SupportedRegions,
  partyName: string,
  contexts: string[]
) => {
  const parties = supportedRegionDetails.find(region => region.name === country)?.politicalParties;
    
  if (!parties) {
    throw new Error(`Party ${partyName} not found in politicalPartiesMap for ${country}`);
  }

  const party = parties.find(p => p === partyName);
  
  const result = await generateObject({
    model: openai(MODEL_NAME),
    schema: z.object({
      message: z.object({
        partyStance: z.array(z.string()),
        supportingDetails: z.array(z.string())
      }),
    }),
    system: handleSystemPrompt(party, contexts),
    prompt,
    temperature: 0.2,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  
  return result.object;
};
