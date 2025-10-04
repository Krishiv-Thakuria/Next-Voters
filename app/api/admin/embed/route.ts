import { NextRequest, NextResponse } from "next/server";
import { chunkDocument, addEmbeddings } from "@/lib/ai";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

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
      return NextResponse.json({ error: "Invalid or missing document link" }, { status: 400 });
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
      return NextResponse.json({ error: `Failed to fetch document. Status: ${response.status}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      return NextResponse.json({ error: "The link did not return a PDF document." }, { status: 400 });
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

    return NextResponse.json({ message: "Embeddings added successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in embed-pdf API:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
};
