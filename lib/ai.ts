import { embed } from 'ai';
import { client } from "./qdrant";
import { createOpenAI } from '@ai-sdk/openai';
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL_NAME } from '@/data/ai-config';
import { extractText } from 'unpdf';
import { randomUUID } from 'crypto';
import { Citation } from '@/types/citations';
import { indexedFields } from '@/data/indexed-fields';

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY
});

export const chunkDocument = async (pdfBuffer: ArrayBuffer) => {
  try {
    const { text } = await extractText(new Uint8Array(pdfBuffer));
    const fullText = Array.isArray(text) ? text.join(" ") : text;

    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map(sentence => sentence.trim())
      .filter(Boolean);

    // Group sentences into 4-sentence chunks and join them into strings
    const chunks = [];
    let currentChunk = [];

    sentences.forEach(sentence => {
      currentChunk.push(sentence);

      if (currentChunk.length === 4) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
      }
    })

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  } catch (error) {
    throw new Error(
      `Failed to chunk document: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const createCollection = async (collectionName: string) => {
  try {
    await client.createCollection(collectionName, {
      vectors: { 
          size: EMBEDDING_DIMENSIONS, 
          distance: "Cosine" 
      },
      optimizers_config: { default_segment_number: 2 },
      replication_factor: 2,
    });

    indexedFields.forEach(async field => {  
      await client.createPayloadIndex(collectionName, {
        field_name: field,
        field_schema: "keyword",
      });
    });
  } catch (error) {
    throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const searchEmbeddings = async (
    prompt: string, 
    collectionName: string, 
    region: string,
    partyName: string 
) => {
    try {
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
        });

        return response;
    } catch (error) {
        throw new Error(`Failed to search embeddings: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const addEmbeddings = async (
    textChunks: string[],
    citation: Citation,
    collectionName: string,
    region: string,
    politicalAffiliation: string,
) => {
    try {
        const collectionExists = await client.collectionExists(collectionName);

        if (!collectionExists.exists) {
            await createCollection(collectionName);
        }
        
        const promises = [];

        textChunks.forEach(chunk => {
          const promise = new Promise<void>(async (resolve, reject) => {
            try {
              const { embedding } = await embed({
                model: openai.textEmbeddingModel(EMBEDDING_MODEL_NAME),
                value: chunk,
              });
              const point = {
                id: randomUUID(),
                vector: embedding,
                payload: {
                  text: chunk,
                  citation,
                  region,
                  politicalAffiliation,
                },
              };
              await client.upsert(collectionName, {
                wait: true,
                points: [point], // Wrap the single point in an array
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          });
          promises.push(promise);
        });
        
        await Promise.all(promises);
    } catch (error) {
        throw new Error(`Failed to add embeddings: ${error instanceof Error ? error.message : String(error)}`);
    }
};
