import { StreamingTextResponse, Message } from 'ai';

// IMPORTANT: Set the runtime to edge
// export const runtime = 'edge';

interface AutoRAGResponse {
  answer?: string;
  response?: string;
  citations?: any[];
  documents?: any[];
}

interface ElectionConfig {
  country: string;
  region?: string;
  election: string;
  pdfFiles: string[];
}

// Hard-coded switch case for different elections and their policy PDFs
function getElectionPDFs(country: string, region: string, election: string): string[] {
  const key = `${country}-${election}`.toLowerCase();

  console.log('Election key:', key); // Debug log

  switch (key) {
    // Canadian Elections
    case 'canada-federal election 2025':
    case 'canada-general election':
    case 'canada-provincial election':
      return ['conservative-platform.pdf', 'liberal-platform.pdf'];

    // US National Elections
    case 'usa-presidential election 2024':
    case 'usa-general election':
      return ['us-national-democratic-2024.pdf', 'us-national-republican-2024.pdf'];

    // US Special Elections - Default to national PDFs
    case 'usa-arizona special election':
    case 'usa-congressional primary':
    case 'usa-midterm elections':
      return ['us-national-democratic-2024.pdf', 'us-national-republican-2024.pdf'];

    // Default cases by country
    default:
      console.log('Using default case for country:', country);
      if (country.toLowerCase() === 'usa') {
        return ['us-national-democratic-2024.pdf', 'us-national-republican-2024.pdf'];
      } else if (country.toLowerCase() === 'canada') {
        return ['conservative-platform.pdf', 'liberal-platform.pdf'];
      }

      // Fallback to US files since that's what you're testing
      return ['us-national-democratic-2024.pdf', 'us-national-republican-2024.pdf'];
  }
}

// Build AutoRAG filters based on PDF files
function buildAutoRAGFilters(pdfFiles: string[]) {
  if (pdfFiles.length === 1) {
    console.log('only one pdfFile', pdfFiles.length);
    return {
      type: "eq",
      key: "filename",
      value: pdfFiles[0]
    };
  }

  console.log('using OR', pdfFiles.length);
  return {
    type: "or",
    filters: pdfFiles.map(filename => ({
      type: "eq",
      key: "filename",
      value: filename
    }))
  };
}

// Query Cloudflare AutoRAG
async function queryAutoRAG(query: string, filters: any): Promise<AutoRAGResponse> {
  const requestBody = {
    query,
    filters
  };

  console.log('AutoRAG Request:', {
    url: 'https://api.cloudflare.com/client/v4/accounts/dbf3f40b913e7a3fb4b74a75697facf8/autorag/rags/policyrag/ai-search',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer gM2_TNsBwmoTzSdPv9kXJNHAP4gO37GropuTT9gA',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  try {
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/dbf3f40b913e7a3fb4b74a75697facf8/autorag/rags/policyrag/ai-search',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer gM2_TNsBwmoTzSdPv9kXJNHAP4gO37GropuTT9gA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log('AutoRAG Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AutoRAG Error Response:', errorText);
      throw new Error(`AutoRAG API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('AutoRAG Response Data:', responseData);

    // Fix: Extract the actual response from the nested structure
    if (responseData.success && responseData.result) {
      return {
        answer: responseData.result.response, // The actual response text
        response: responseData.result.response,
        documents: responseData.result.data || [], // The document chunks
        citations: [] // AutoRAG doesn't seem to return separate citations, they're embedded in the response
      };
    } else {
      throw new Error('Invalid AutoRAG response structure');
    }

  } catch (error) {
    console.error('AutoRAG Fetch Error:', error);
    throw error;
  }
}

// Generate party-specific responses from AutoRAG results
async function generatePartyResponses(
  userPrompt: string,
  location: string,
  election: string,
  country: string,
  region: string
): Promise<[string, string]> {
  try {
    // Get relevant PDFs for this election
    const pdfFiles = getElectionPDFs(country, region, election);
    console.log('Using PDFs:', pdfFiles, 'for election:', election, 'in', location);

    // Build filters for AutoRAG
    const filters = buildAutoRAGFilters(pdfFiles);

    // const filters = {
    //   type: "or",
    //   filters: pdfFiles.map(filename => ({
    //     type: "eq",
    //     key: "filename",
    //     value: filename
    //   }))
    // }

    // Query AutoRAG
    const autoragResponse = await queryAutoRAG(userPrompt, filters);

    // Extract response text
    const fullResponse = autoragResponse.answer || autoragResponse.response || 'No response generated';
    console.log('Full AutoRAG Response:', fullResponse);

    // Since AutoRAG is already providing a structured comparison, let's parse it

    let data = fullResponse.split("[STOP]");

    let democraticSection = data[0]?.trim() || '';
    let republicanSection = data[1]?.trim() || '';

    // Format the responses
    let party1Response = '';
    let party2Response = '';

    if (country.toLowerCase() === 'usa') {
      party1Response = `**Democratic Position** (${location}):\n\n${democraticSection || 'Information not available in the provided documents.'}`;
      party2Response = `**Republican Position** (${location}):\n\n${republicanSection || 'Information not available in the provided documents.'}`;
    } else {
      // Canada or other
      party1Response = `**Liberal Position** (${location}):\n\n${democraticSection || fullResponse.substring(0, fullResponse.length / 2)}`;
      party2Response = `**Conservative Position** (${location}):\n\n${republicanSection || fullResponse.substring(fullResponse.length / 2)}`;
    }

    return [party1Response, party2Response];

  } catch (error) {
    console.error('AutoRAG query failed:', error);

    // Fallback responses
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return [
      `**Party 1** (${location}):\n\nSorry, I couldn't retrieve policy information at this time. Error: ${errorMsg}`,
      `**Party 2** (${location}):\n\nSorry, I couldn't retrieve policy information at this time. Error: ${errorMsg}`
    ];
  }
}

export async function POST(req: Request) {
  try {
    const { messages, location, election } = await req.json();

    const userPrompt = (messages as Message[]).slice(-1)[0]?.content || 'No prompt provided';
    const safeLocation = location || 'an unspecified location';
    const safeElection = election || 'Not Specified';

    console.log('API Received - Prompt:', userPrompt, 'Location:', safeLocation, 'Election:', safeElection);

    // Parse location to get country and region
    const [region, country] = safeLocation.split(', ').reverse();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Get party responses from AutoRAG
          const [party1ResponseString, party2ResponseString] = await generatePartyResponses(
            userPrompt,
            safeLocation,
            safeElection,
            country || 'Canada',
            region || ''
          );

          // Stream Party 1's response
          for (const char of party1ResponseString) {
            controller.enqueue(encoder.encode(char));
            await new Promise(resolve => setTimeout(resolve, 2)); // Simulate typing
          }

          const separator = "\n\n---CANDIDATE_SEPARATOR---\n\n";
          for (const char of separator) {
            controller.enqueue(encoder.encode(char));
            await new Promise(resolve => setTimeout(resolve, 5));
          }

          // Stream Party 2's response
          for (const char of party2ResponseString) {
            controller.enqueue(encoder.encode(char));
            await new Promise(resolve => setTimeout(resolve, 2));
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMessage = `Error generating responses: ${error instanceof Error ? error.message : 'Unknown error'}`;
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error in chat API',
      details: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}