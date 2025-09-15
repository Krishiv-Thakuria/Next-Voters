import { generateObject, embed } from 'ai';
import { client } from "./qdrant"
import { createCohere } from '@ai-sdk/cohere';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';
import { handleSystemPrompt } from '@/data/prompts';
import { generateId } from './random';
import { collectionName } from '@/data/qdrant';
import pdfParse from "pdf-parse";
import { EMBEDDING_MODEL_NAME, MODEL_NAME } from '@/data/ai-config';
import { Country } from '@/types/supported-countries';

// Define a custom env variable for API key
const cohere = createCohere({
    apiKey: process.env.COHERE_API_KEY
})

export const generateResponses = async (
    prompt: string, 
    country: Country, 
    contexts: string[]
) => {
    const parties = politicalPartiesMap[country]

    const responses = await Promise.all(
        parties.map((partyInfo) => {
            const { party, partyPrompt } = partyInfo
            
            generateObject({
                model: cohere(MODEL_NAME),
                schema: z.object({
                    message: z.object({
                        answer: z.string()
                    }),
                }),
                system: handleSystemPrompt(party, partyPrompt, contexts),
                prompt,
            }).then(result => result.object)
        })
    )
    return responses
}

export const addEmbeddings = async (
    textChunks: string[],
    author: string,
    url: string,
    document_name: string
) => {
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
        })
    }

    textChunks.forEach(async text => {
        const { embedding } = await embed({
            model: cohere.textEmbeddingModel(EMBEDDING_MODEL_NAME),
            value: text
        })

        await client.upsert(collectionName, {
            wait: true,
            points: [{
                id: generateId(),
                vector: embedding,
                payload: {
                    text,
                    citation: {
                        author,
                        url,
                        document_name
                    },
                }
            }]
        })
    })
}

export const searchEmbeddings = async (userQuery: string) => {
    // Turn user query to vector embeddings so vector db can understand + search
    const { embedding: vectorEmbeddings } = await embed({
            model: cohere.textEmbeddingModel(EMBEDDING_MODEL_NAME),
            value: userQuery
    })

    const response = await client.search(collectionName, {
        vector: vectorEmbeddings
    })

    return response;
}

export const chunkDocument = async (pdfBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(pdfBuffer);

    const data = await pdfParse(buffer);
    const text = data.text;

    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(Boolean);

    // Chunking based on each sentence because all words should be similar in meaning/concept
    const chunks: string[] = [];
    for (let i = 0; i < sentences.length; i += 1) {
        const chunk = sentences.slice(i, i + 3).join(" ");
        chunks.push(chunk);
    }

    return chunks;
};
