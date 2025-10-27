"use server";

import { chunkDocument, addEmbeddings } from "@/lib/ai";
import { Citation } from "@/types/citations";

// only can be called if invoked by app, so very secure
export async function embedPdfAction(formData: {
  documentLink: string;
  author: string;
  documentName: string;
  collectionName: string;
  region: string;
  politicalAffiliation: string;
}) {
  try {
    const { 
      documentLink, 
      author, 
      documentName, 
      collectionName,
      region,
      politicalAffiliation
    } = formData;
    
    // Validate input
    if (!/^https?:\/\/[^\s]+$/i.test(documentLink)) {
      return { 
        success: false, 
        error: "Invalid or missing document link" 
      };
    }
    
    if (
      !documentLink || 
      !author || 
      !documentName || 
      !collectionName || 
      !region || 
      !politicalAffiliation
    ) {
      return { 
        success: false, 
        error: "Missing all required fields." 
      };
    }

    // Fetch the PDF
    const response = await fetch(documentLink);
    if (!response.ok) {
      return { 
        success: false, 
        error: `Failed to fetch document. Status: ${response.status}` 
      };
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      return { 
        success: false, 
        error: "The link did not return a PDF document." 
      };
    }

    // Convert PDF to buffer and chunk
    const pdfBuffer = await response.arrayBuffer();
    const chunks = await chunkDocument(pdfBuffer);

    // Store embeddings
    const citation: Citation = {
      author,
      url: documentLink,
      document_name: documentName
    };
    
    await addEmbeddings(
      chunks, 
      citation,
      collectionName,
      region, 
      politicalAffiliation
    );

    return { 
      success: true, 
      message: "Embeddings added successfully!" 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Internal Server Error" 
    };
  }
}
