import { generateObject, embed } from 'ai';
import { client } from "./qdrant";
import { createGroq } from '@ai-sdk/groq';
import { createMistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';
import { handleSystemPrompt } from '@/data/prompts';
import { EMBEDDING_MODEL_NAME, MODEL_NAME } from '@/data/ai-config';
import { SupportedCountry } from '@/types/supported-regions';

// For LLM
const groq = createGroq({
    apiKey: process.env.GROQ_LLM_API_KEY
})

// For embedding 
const mistral = createMistral({
    apiKey: process.env.MISTRAL_EMBEDDING_API_KEY
})

// Functions to generate proper AI response

export const generateResponses = async (
    prompt: string, 
    country: SupportedCountry, 
    contexts: string[]
) => {
    const parties = politicalPartiesMap[country];

    const responses = await Promise.all(
        parties.map((partyInfo) => {
            const { party, partyPrompt } = partyInfo;

            return generateObject({
                model: groq(MODEL_NAME),
                schema: z.object({
                    message: z.object({
                        answer: z.string()
                    }),
                }),
                system: handleSystemPrompt(party, partyPrompt, contexts),
                prompt,
            }).then(result => result.object);
        })
    );

    return responses;
};

export const searchEmbeddings = async (
    userQuery: string, 
    collectionName: string, 
    filterCriteria: any = null
) => {
    const { embedding: vectorEmbeddings } = await embed({
        model: mistral.textEmbeddingModel(EMBEDDING_MODEL_NAME),
        value: userQuery
    });


    const response = await client.search(collectionName, {
        vector: vectorEmbeddings,
        limit: 5,
        with_payload: true,
        filter: filterCriteria ? filterCriteria : []
    })

    return response;
};
