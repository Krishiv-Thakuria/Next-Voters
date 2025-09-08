import { StreamingTextResponse, Message } from 'ai';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { db } from '@/lib/database';
import { handleIncrementResponse } from '@/lib/analytics';

// IMPORTANT: Set the runtime to edge
// export const runtime = 'edge';

interface AutoRAGResponse {
  answer?: string;
  response?: string;
  citations?: any[];
  documents?: any[];
}

interface PartyPDFs {
  party1: string; // Democratic/Liberal party PDF
  party2: string; // Republican/Conservative party PDF
}

interface ElectionConfig {
  country: string;
  region?: string;
  election: string;
  pdfs: PartyPDFs;
  party1Name: string; // e.g., "Democratic", "Liberal"
  party2Name: string; // e.g., "Republican", "Conservative"
}

// Comprehensive election configurations with party-specific PDFs
function getElectionConfig(country: string, region: string, election: string): ElectionConfig {
  const key = `${country}-${election}`.toLowerCase();
  
  console.log('Election key:', key); // Debug log

  // USA Elections
  if (country.toLowerCase() === 'usa') {
    switch (key) {
      case 'usa-presidential election 2024':
      case 'usa-general election':
      case 'usa-federal election':
        return {
          country: 'USA',
          region,
          election,
          pdfs: {
            party1: 'us-national-democratic-2024.pdf',
            party2: 'us-national-republican-2024.pdf'
          },
          party1Name: 'Democratic',
          party2Name: 'Republican'
        };

      case 'usa-arizona special election':
        return {
          country: 'USA',
          region: 'Arizona',
          election,
          pdfs: {
            party1: 'arizona-democratic-2024.pdf', // State-specific if available
            party2: 'arizona-republican-2024.pdf'
          },
          party1Name: 'Democratic',
          party2Name: 'Republican'
        };

      case 'usa-congressional primary':
      case 'usa-midterm elections':
        return {
          country: 'USA',
          region,
          election,
          pdfs: {
            party1: 'us-congressional-democratic-2024.pdf',
            party2: 'us-congressional-republican-2024.pdf'
          },
          party1Name: 'Democratic',
          party2Name: 'Republican'
        };

      default:
        // Default US configuration
        return {
          country: 'USA',
          region,
          election,
          pdfs: {
            party1: 'us-national-democratic-2024.pdf',
            party2: 'us-national-republican-2024.pdf'
          },
          party1Name: 'Democratic',
          party2Name: 'Republican'
        };
    }
  }

  // Canadian Elections
  if (country.toLowerCase() === 'canada') {
    switch (key) {
      case 'canada-federal election 2025':
      case 'canada-general election':
        return {
          country: 'Canada',
          region,
          election,
          pdfs: {
            party1: 'liberal-platform.pdf',
            party2: 'conservative-platform.pdf'
          },
          party1Name: 'Liberal',
          party2Name: 'Conservative'
        };

      case 'canada-provincial election':
        // Could be made more specific based on province
        return {
          country: 'Canada',
          region,
          election,
          pdfs: {
            party1: `${region?.toLowerCase()}-liberal-platform.pdf` || 'liberal-platform.pdf',
            party2: `${region?.toLowerCase()}-conservative-platform.pdf` || 'conservative-platform.pdf'
          },
          party1Name: 'Liberal',
          party2Name: 'Conservative'
        };

      default:
        return {
          country: 'Canada',
          region,
          election,
          pdfs: {
            party1: 'liberal-platform.pdf',
            party2: 'conservative-platform.pdf'
          },
          party1Name: 'Liberal',
          party2Name: 'Conservative'
        };
    }
  }

  // Default fallback (could add more countries here)
  console.log('Using default fallback configuration for country:', country);
  return {
    country: country || 'USA',
    region,
    election,
    pdfs: {
      party1: 'us-national-democratic-2024.pdf',
      party2: 'us-national-republican-2024.pdf'
    },
    party1Name: 'Democratic',
    party2Name: 'Republican'
  };
}

// Build single-document filter for targeted queries
function buildSingleDocumentFilter(filename: string) {
  return {
    type: "eq",
    key: "filename",
    value: filename
  };
}

// Query Cloudflare AutoRAG with enhanced error handling
async function queryAutoRAG(query: string, filters: any, partyContext: string): Promise<AutoRAGResponse> {
  const requestBody = {
    query: `${query}\n\nContext: Please focus specifically on the ${partyContext} party's position and policies.`,
    filters
  };

  console.log(`AutoRAG Request for ${partyContext}:`, {
    url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/autorag/rags/policyrag/ai-search`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.POLICY_RAG_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/autorag/rags/policyrag/ai-search`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.POLICY_RAG_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log(`AutoRAG Response Status for ${partyContext}:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AutoRAG Error Response for ${partyContext}:`, errorText);
      throw new Error(`AutoRAG API error for ${partyContext}: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log(`AutoRAG Response Data for ${partyContext}:`, responseData);

    if (responseData.success && responseData.result) {
      return {
        answer: responseData.result.response,
        response: responseData.result.response,
        documents: responseData.result.data || [],
        citations: []
      };
    } else {
      throw new Error(`Invalid AutoRAG response structure for ${partyContext}`);
    }

  } catch (error) {
    console.error(`AutoRAG Fetch Error for ${partyContext}:`, error);
    throw error;
  }
}

// Generate party-specific responses using two separate AutoRAG calls
async function generatePartyResponses(
  userPrompt: string,
  location: string,
  election: string,
  country: string,
  region: string
): Promise<[string, string]> {
  try {
    // Get election configuration
    const config = getElectionConfig(country, region, election);
    console.log('Using configuration:', config);

    // Create party-specific filters
    const party1Filter = buildSingleDocumentFilter(config.pdfs.party1);
    const party2Filter = buildSingleDocumentFilter(config.pdfs.party2);

    console.log('Party 1 filter:', party1Filter);
    console.log('Party 2 filter:', party2Filter);

    // Make two separate AutoRAG requests in parallel for better performance
    const [party1Response, party2Response] = await Promise.allSettled([
      queryAutoRAG(userPrompt, party1Filter, config.party1Name),
      queryAutoRAG(userPrompt, party2Filter, config.party2Name)
    ]);

    // Process Party 1 response
    let party1ResponseString = '';
    if (party1Response.status === 'fulfilled') {
      const response = party1Response.value.answer || party1Response.value.response || '';
      party1ResponseString = `**${config.party1Name} Position** (${location}):\n\n${response}`;
    } else {
      console.error(`${config.party1Name} query failed:`, party1Response.reason);
      party1ResponseString = `**${config.party1Name} Position** (${location}):\n\nSorry, I couldn't retrieve ${config.party1Name.toLowerCase()} policy information at this time. ${party1Response.reason?.message || 'Unknown error occurred.'}`;
    }

    // Process Party 2 response  
    let party2ResponseString = '';
    if (party2Response.status === 'fulfilled') {
      const response = party2Response.value.answer || party2Response.value.response || '';
      party2ResponseString = `**${config.party2Name} Position** (${location}):\n\n${response}`;
    } else {
      console.error(`${config.party2Name} query failed:`, party2Response.reason);
      party2ResponseString = `**${config.party2Name} Position** (${location}):\n\nSorry, I couldn't retrieve ${config.party2Name.toLowerCase()} policy information at this time. ${party2Response.reason?.message || 'Unknown error occurred.'}`;
    }

    return [party1ResponseString, party2ResponseString];

  } catch (error) {
    console.error('generatePartyResponses failed:', error);

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
          // Get party responses from AutoRAG using two separate requests
          const [party1ResponseString, party2ResponseString] = await generatePartyResponses(
            userPrompt,
            safeLocation,
            safeElection,
            country || 'USA', // Default to USA for better fallback
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
          
          handleIncrementResponse();
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