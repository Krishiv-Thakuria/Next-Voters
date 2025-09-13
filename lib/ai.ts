import { generateObject, embed } from 'ai';
import { client } from "./qdrant"
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';

// Define a custom env variable for API key
const groq = createGroq({
    apiKey: process.env.GROQ_API_AUTH_KEY
})

export const generateResponses = async (prompt: string, country: "USA" | "Canada") => {
    const parties = politicalPartiesMap[country]

    const responses = await Promise.all(
        parties.map((party, partyPrompt) =>
            generateObject({
                model: groq('openai/gpt-4.1'),
                schema: z.object({
                    message: z.object({
                        answer: z.string(),
                        citation: z.string(),
                    }),
                }),
                system: `
                    You are a unbiased expert in politics and civic discourse. 
                    Generate a detailed and non-partisan response to the following prompt given in relation to this political party: ${party}
                    This is some extra context about what the party is to help you format a cohesive answer: ${partyPrompt}
                `,
                prompt,
            }).then(result => result.object)
        )
    )

    return responses
}

export const generateEmbeddings = async (value: string) => {
    const { embedding } = await embed({
        model: groq.textEmbeddingModel('text-embedding-3-small'),
        value
    })

    return embedding
}

export const addEmbeddings = async (
    vectorEmbeddings: number[],
    author: string,
    url: string,
    document_name: string
) => {
    const collectionName = "political_documents"
    const collection = await client.getCollection(collectionName)

    if (!collection) {
        await client.createCollection(collectionName, {
            vectors: {
                size: 4,
                distance: "Cosine"
            },
            optimizers_config: {
                default_segment_number: 2,
            },
            replication_factor: 2
        }),
        client.upsert(collectionName, {
            wait: true,
            points: [{
                id: 1,
                vector: vectorEmbeddings,
                payload: {
                    author,
                    url,
                    document_name
                }
            }]
        })
    }
}

export const searchEmbeddings = async () => {

}

