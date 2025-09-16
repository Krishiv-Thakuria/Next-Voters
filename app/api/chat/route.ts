import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

export const POST = async (request: NextRequest) => {
  const { userQuery, country } = await request.json();
  const embeddings = await searchEmbeddings(userQuery, "political_documents");
  const contexts = embeddings.map(embedding => embedding.payload.text) as string[];

  const response = await generateResponses(userQuery, country, contexts);

  return Response.json({
    response
  });
}
