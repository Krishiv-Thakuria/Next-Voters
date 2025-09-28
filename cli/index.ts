import { EMBEDDING_MODEL_NAME } from "../data/ai-config.ts";
import { client } from "../lib/qdrant.ts";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { embed } from "ai";
import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";
import pdfParse from "pdf-parse";

// For LLM
const groq = createGroq({
    apiKey: process.env.GROQ_LLM_API_KEY
})

// For embedding 
const mistral = createMistral({
    apiKey: process.env.MISTRAL_EMBEDDING_API_KEY
})

const generateId = (length = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
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


async function main() {
  log(chalk.blue("Welcome to Next Voters' CLI tooling!"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "documentLink",
      message: "What is the link of your document?",
      validate: (input) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(input) || "Please enter a valid URL",
    },
    {
      type: "input",
      name: "author",
      message: "What is the author name?",
      validate: (input) => input.trim() !== "" || "Author name cannot be empty",
    },
    {
      type: "input",
      name: "documentName",
      message: "What is the name of the document?",
      validate: (input) => input.trim() !== "" || "Document name cannot be empty",
    },
    {
      type: "input",
      name: "collectionName",
      message: "Collection name for embeddings?",
      validate: (input) => input.trim() !== "" || "Collection name cannot be empty",
    },
  ]);

  const { documentLink, author, documentName, collectionName } = answers;

  log(chalk.green("Valid link inputted. Checking document type..."));

  const response = await fetch(documentLink);

  if (!response.ok) throw new Error(`Failed to fetch document. Status: ${response.status}`);

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/pdf")) throw new Error("The link did not return a PDF document.");

  log(chalk.green("Retrieved PDF document! Continue to processing..."));

  const pdfBuffer = await response.arrayBuffer();
  const chunks = await chunkDocument(pdfBuffer);

  await addEmbeddings(chunks, author, documentLink, documentName, collectionName);

  log(chalk.blue("Embeddings added successfully!"));
}

main().catch((error) => {
  log(chalk.red("AN ERROR OCCURRED!!"), error.message);
});
