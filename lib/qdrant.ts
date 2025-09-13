import {QdrantClient} from '@qdrant/qdrant-js';

export const client = new QdrantClient({ url: process.env.QDRANT_URL ?? "http://127.0.0.1:6333"})