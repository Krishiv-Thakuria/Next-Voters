import { generateObject, embed } from 'ai';
import { client } from "./qdrant";
import { createCohere } from '@ai-sdk/cohere';
import { z } from 'zod';
import { politicalPartiesMap } from '@/data/political-prompts';
import { handleSystemPrompt } from '@/data/prompts';
import { EMBEDDING_MODEL_NAME, MODEL_NAME } from '@/data/ai-config';
import { SupportedCountry } from '@/types/supported-regions';
import { extractText } from 'unpdf';
import { randomUUID } from 'crypto';

const cohere = createCohere({
    apiKey: process.env.COHERE_API_KEY
})

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
                model: cohere(MODEL_NAME),
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
        model: cohere.textEmbeddingModel(EMBEDDING_MODEL_NAME),
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

export const chunkDocument = async (pdfBuffer: ArrayBuffer) => {
    const { text } = await extractText(new Uint8Array(pdfBuffer));    
    const fullText = Array.isArray(text) ? text.join(' ') : text;
    
    const sentences = fullText
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
    collectionName: string,
    region: string,
    politicalAffiliation: string
  ) => {
    const collectionExists = await client.collectionExists(collectionName);

    if (!collectionExists.exists) {
      await client.createCollection(collectionName, {
        vectors: { size: 1024, distance: "Cosine" },
        optimizers_config: { default_segment_number: 2 },
        replication_factor: 2,
      });
    }

    const DELAY_MS = 650; 
    
    for (let i = 0; i < textChunks.length; i++) {
      const text = textChunks[i];
      
      const { embedding } = await embed({
        model: cohere.textEmbeddingModel(EMBEDDING_MODEL_NAME),
        value: text,
      });

      await client.upsert(collectionName, {
        wait: true,
        points: [{
          id: randomUUID(),
          vector: embedding,
          payload: {
            text,
            citation: { author, url, document_name },
            region,
            politicalAffiliation
          },
        }],
      });
      
      if (i < textChunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
  };