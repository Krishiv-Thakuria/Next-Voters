import { NextRequest, NextResponse } from "next/server"

/*
export const POST = async (request: NextRequest) => {
  const { userQuery, country } = await request.json();
  const embeddings = await searchEmbeddings(userQuery, "legislative_documents");
  
  const contexts = [];
  const citations = [];

  embeddings.map(embedding => {
      contexts.push(embedding.payload.text);
      citations.push(embedding.payload.citation);
  }) ;

  // DO SOME COOL UNIQUE STUFF HERE WHICH WILL HELP USERS WITH UNDERSTANDING LEGISLATIVE DOCUMENTS
  const response = await generateResponses(userQuery, country, contexts);

  return NextResponse.json({
    response,
    citations
  });
}
*/

export const GET = async (request: NextRequest) => {
  return NextResponse.json({
    message: "Coming soon!"
  })
}
