import { embed } from 'ai';
import { client } from "./qdrant";
import { createOpenAI } from '@ai-sdk/openai';
import { EMBEDDING_MODEL_NAME } from '@/data/ai-config';
import { extractText } from 'unpdf';
import { randomUUID } from 'crypto';
import { Citation } from '@/types/citations';

const openai = createOpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY
})

export const searchEmbeddings = async (
    prompt: string, 
    collectionName: string, 
    region: string,
    partyName: string 
) => {
    const { embedding: vectorEmbeddings } = await embed({
        model: openai.textEmbeddingModel(EMBEDDING_MODEL_NAME),
        value: prompt
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
    citation: Citation,
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
        model: openai.textEmbeddingModel(EMBEDDING_MODEL_NAME),
        value: text,
      });

      await client.upsert(collectionName, {
        wait: true,
        points: [{
          id: randomUUID(),
          vector: embedding,
          payload: {
            text,
            citation,
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