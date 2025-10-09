import { generateObject, embed } from 'ai';
import { client } from "./qdrant";
import { createCohere } from '@ai-sdk/cohere';
import { z } from 'zod';
import { handleSystemPrompt } from '@/data/prompts';
import { EMBEDDING_MODEL_NAME, MODEL_NAME } from '@/data/ai-config';
import { SupportedRegions } from '@/types/supported-regions';
import { extractText } from 'unpdf';
import { randomUUID } from 'crypto';
import { supportedRegionDetails } from '@/data/supported-regions';

const cohere = createCohere({
    apiKey: process.env.COHERE_API_KEY
})

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
    model: cohere(MODEL_NAME),
    schema: z.object({
      message: z.object({
        answer: z.string()
      }),
    }),
    system: handleSystemPrompt(party, contexts),
    prompt,
  });
  
  return result.object;
};

export const searchEmbeddings = async (
    userQuery: string, 
    collectionName: string, 
    region: string,
    partyName: string 
) => {
    const { embedding: vectorEmbeddings } = await embed({
        model: cohere.textEmbeddingModel(EMBEDDING_MODEL_NAME),
        value: userQuery
    });


    const response = await client.query(collectionName, {
        query: vectorEmbeddings,
        with_payload: true,
        filter: {
          must: [
            {
              key: "region",
              match: { value: region },
            },
            {
              key: "politicalAffiliation",
              match: { value: partyName}, 
            }
          ],
        },
        params: {
          hnsw_ef: 128,
          exact: false
        },
        limit: 2
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