import { chunkDocument, addEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const { 
      documentLink, 
      author, 
      documentName, 
      collectionName,
      region,
      politicalAffiliation
    } = body
    
    // Validate input
    if (!/^https?:\/\/[^\s]+$/i.test(documentLink)) {
      return Response.json({ error: "Invalid or missing document link" }, { status: 400 });
    }
    
    if (
      !documentLink || 
      !author || 
      !documentName || 
      !collectionName || 
      !region || 
      !politicalAffiliation
    ) {
      throw new Error("Missing all required fields.")
    }
  

    // Fetch the PDF
    const response = await fetch(documentLink);
    if (!response.ok) {
      return Response.json({ error: `Failed to fetch document. Status: ${response.status}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      return Response.json({ error: "The link did not return a PDF document." }, { status: 400 });
    }

    // Convert PDF to buffer and chunk
    const pdfBuffer = await response.arrayBuffer();
    const chunks = await chunkDocument(pdfBuffer);

    // Store embeddings
    await addEmbeddings(
      chunks, 
      author, 
      documentLink, 
      documentName, 
      collectionName,
      region, 
      politicalAffiliation
    );

    return Response.json({ message: "Embeddings added successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in embed-pdf API:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
};
