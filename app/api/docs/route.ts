import { StreamingTextResponse, Message } from 'ai';
import { verifyTurnstileToken } from '@/lib/turnstile';

// IMPORTANT: Set the runtime to edge
// export const runtime = 'edge';

interface AutoRAGResponse {
  answer?: string;
  response?: string;
  citations?: any[];
  documents?: any[];
}

interface DocumentConfig {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: string;
}

// Available documents for analysis
const availableDocuments: DocumentConfig[] = [
  {
    id: 'big-beautiful-bill',
    name: 'The Big Beautiful Bill',
    filename: 'one_big_beautiful_bill.pdf',
    description: 'The comprehensive legislative package that has been making headlines across the nation.',
    category: 'Legislation'
  },
  // Add more documents here in the future
  // {
  //   id: 'budget-proposal-2025',
  //   name: 'Budget Proposal 2025',
  //   filename: 'budget_proposal_2025.pdf',
  //   description: 'The federal budget proposal for fiscal year 2025.',
  //   category: 'Budget'
  // }
];

// Get document configuration by ID
function getDocumentConfig(documentId: string): DocumentConfig | null {
  return availableDocuments.find(doc => doc.id === documentId) || null;
}

// Build single-document filter for targeted queries
function buildDocumentFilter(filename: string) {
  return {
    type: "eq",
    key: "filename",
    value: filename
  };
}

// Query Cloudflare AutoRAG for document analysis
async function queryDocumentRAG(query: string, filename: string, documentName: string): Promise<AutoRAGResponse> {
  const filters = buildDocumentFilter(filename);
  
  const requestBody = {
    query: `${query}`,
    // filters
  };

  console.log(`Document RAG Request for ${documentName}:`, {
    url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/autorag/rags/document-rag/ai-search`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.DOCUMENT_RAG_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/autorag/rags/document-rag/ai-search`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.DOCUMENT_RAG_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log(`Document RAG Response Status for ${documentName}:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Document RAG Error Response for ${documentName}:`, errorText);
      throw new Error(`Document RAG API error for ${documentName}: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log(`Document RAG Response Data for ${documentName}:`, responseData);

    if (responseData.success && responseData.result) {
      return {
        answer: responseData.result.response,
        response: responseData.result.response,
        documents: responseData.result.data || [],
        citations: []
      };
    } else {
      throw new Error(`Invalid Document RAG response structure for ${documentName}`);
    }

  } catch (error) {
    console.error(`Document RAG Fetch Error for ${documentName}:`, error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { messages, documentId } = await req.json();

    const userPrompt = (messages as Message[]).slice(-1)[0]?.content || 'No prompt provided';
    const safeDocumentId = documentId || '';

    console.log('Document API Received - Prompt:', userPrompt, 'Document ID:', safeDocumentId);

    // Get document configuration
    const documentConfig = getDocumentConfig(safeDocumentId);
    if (!documentConfig) {
      return new Response(JSON.stringify({
        error: 'Invalid document ID',
        details: `Document with ID "${safeDocumentId}" not found`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Query the specific document
          const response = await queryDocumentRAG(
            userPrompt,
            documentConfig.filename,
            documentConfig.name
          );

          const responseString = `**Analysis of "${documentConfig.name}"**\n\n${response.answer || response.response || 'No response available'}`;

          // Stream the response
          for (const char of responseString) {
            controller.enqueue(encoder.encode(char));
            await new Promise(resolve => setTimeout(resolve, 2)); // Simulate typing
          }

          controller.close();
        } catch (error) {
          console.error('Document streaming error:', error);
          const errorMessage = `Error analyzing "${documentConfig.name}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in docs API:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error in docs API',
      details: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Export available documents for the frontend
export async function GET() {
  try {
    return new Response(JSON.stringify({
      success: true,
      documents: availableDocuments
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch documents',
      details: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
