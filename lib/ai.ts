import { generateObject, embed } from 'ai';
import { client } from "./qdrant"
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';
import { handleSystemPrompt } from '@/data/prompts';
import { generateId } from './random';
import { collectionName } from '@/data/qdrant';
import pdfParse from "pdf-parse";

// Define a custom env variable for API key
const groq = createGroq({
    apiKey: process.env.GROQ_API_AUTH_KEY
})

export const generateResponses = async (prompt: string, country: "USA" | "Canada") => {
    const parties = politicalPartiesMap[country]

    const responses = await Promise.all(
        parties.map((partyInfo) =>
            generateObject({
                model: groq('openai/gpt-4.1'),
                schema: z.object({
                    message: z.object({
                        answer: z.string(),
                        citation: z.string(),
                    }),
                }),
                system: handleSystemPrompt(partyInfo.party, partyInfo.partyPrompt),
                prompt,
            }).then(result => result.object)
        )
    )
    return responses
}

export const generateEmbeddings = (chunks: string[]) => {
    const embeddings = [];
    chunks.forEach(async text => {
        const { embedding } = await embed({
            model: groq.textEmbeddingModel('text-embedding-3-small'),
            value: text
        })
        embeddings.push(embedding)
    })

    return embeddings
}

export const addEmbeddings = async (
    textChunks: string[],
    vectorEmbeddings: number[],
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
        await client.upsert(collectionName, {
            wait: true,
            points: [{
                id: generateId(),
                vector: vectorEmbeddings,
                payload: {
                    text,
                    citiation: {
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
            model: groq.textEmbeddingModel('text-embedding-3-small'),
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
