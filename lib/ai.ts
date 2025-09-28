import { generateObject, embed } from 'ai';
import { client } from "./qdrant";
import { createGroq } from '@ai-sdk/groq';
import { createMistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';
import { handleSystemPrompt } from '@/data/prompts';
import { generateId } from './random';
import pdfParse from "pdf-parse";
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


// Functions to add documents to RAG system

export const chunkDocument = async (pdfBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(pdfBuffer);

    const data = await pdfParse(buffer);
    const text = data.text;

    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(Boolean);

    const chunks: string[] = [];
    for (let i = 0; i < sentences.length; i += 1) {
        const chunk = sentences.slice(i, i + 3).join(" ");
        chunks.push(chunk);
    }

    return chunks;
};


export const addEmbeddings = async (
    textChunks: string[],
    author: string,
    url: string,
    document_name: string,
    collectionName: string
) => {
    const collection = await client.getCollection(collectionName);

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
        });
    }

    await Promise.all(
        textChunks.map(async text => {
            const { embedding } = await embed({
                model: mistral.textEmbeddingModel(EMBEDDING_MODEL_NAME),
                value: text
            });

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
            });
        })
    );
};
