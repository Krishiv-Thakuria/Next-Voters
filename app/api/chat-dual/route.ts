import { StreamingTextResponse, Message } from 'ai';
import { verifyTurnstileToken } from '@/lib/turnstile';

// IMPORTANT: Set the runtime to edge
// export const runtime = 'edge';

interface AutoRAGResponse {
  success: boolean;
  result?: {
    response?: string;
    data?: any[];
    search_query?: string;
    object?: string;
    has_more?: boolean;
    next_page?: string | null;
  };
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
            party1: 'us-national-democratic-2024.pdf', // Use national PDFs since Arizona-specific don't exist
            party2: 'us-national-republican-2024.pdf'
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
  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const POLICY_RAG_API_KEY = process.env.POLICY_RAG_API_KEY;

  if (!CF_ACCOUNT_ID || !POLICY_RAG_API_KEY) {
    throw new Error('AutoRAG configuration missing');
  }

  const requestBody = {
    query: `${query}\n\nContext: Please focus specifically on the ${partyContext} party's position and policies.`,
    filters
  };

  console.log(`AutoRAG Request for ${partyContext}:`, {
    url: `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/autorag/rags/policyrag/ai-search`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + POLICY_RAG_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/autorag/rags/policyrag/ai-search`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + POLICY_RAG_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AutoRAG HTTP ${response.status}:`, errorText);
      throw new Error(`AutoRAG request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log(`AutoRAG response for ${partyContext}:`, result);
    return result;

  } catch (error) {
    console.error(`AutoRAG query error for ${partyContext}:`, error);
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
    const config = getElectionConfig(country, region, election);
    console.log('Using election config:', config);

    // Build filters for each party's PDF
    const party1Filter = buildSingleDocumentFilter(config.pdfs.party1);
    const party2Filter = buildSingleDocumentFilter(config.pdfs.party2);

    // Make both AutoRAG requests in parallel
    const [party1Response, party2Response] = await Promise.allSettled([
      queryAutoRAG(userPrompt, party1Filter, config.party1Name),
      queryAutoRAG(userPrompt, party2Filter, config.party2Name)
    ]);

    // Process Party 1 response
    let party1ResponseString = '';
    if (party1Response.status === 'fulfilled') {
      const autoragResult = party1Response.value;
      const response = autoragResult.result?.response || autoragResult.answer || autoragResult.response || 'No response available';
      party1ResponseString = `**${config.party1Name} Position** (${location}):\n\n${response}`;
    } else {
      console.error(`${config.party1Name} query failed:`, party1Response.reason);
      party1ResponseString = `**${config.party1Name} Position** (${location}):\n\nSorry, I couldn't retrieve ${config.party1Name.toLowerCase()} policy information at this time. ${party1Response.reason?.message || 'Unknown error occurred.'}`;
    }

    // Process Party 2 response  
    let party2ResponseString = '';
    if (party2Response.status === 'fulfilled') {
      const autoragResult = party2Response.value;
      const response = autoragResult.result?.response || autoragResult.answer || autoragResult.response || 'No response available';
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
    const { messages, location, election, party } = await req.json();

    const userPrompt = (messages as Message[]).slice(-1)[0]?.content || 'No prompt provided';
    const safeLocation = location || 'an unspecified location';
    const safeElection = election || 'Not Specified';
    const requestedParty = party || 'party1'; // 'party1' or 'party2'

    console.log('API Received - Prompt:', userPrompt, 'Location:', safeLocation, 'Election:', safeElection, 'Party:', requestedParty);

    // Parse location to get country and region (format: "Region, Country")
    const locationParts = safeLocation.split(', ');
    const region = locationParts[0] || '';
    const country = locationParts[1] || 'USA';

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

          // Stream only the requested party's response
          const responseToStream = requestedParty === 'party1' ? party1ResponseString : party2ResponseString;
          
          for (const char of responseToStream) {
            controller.enqueue(encoder.encode(char));
            await new Promise(resolve => setTimeout(resolve, 2)); // Simulate typing
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
    console.error('Error in chat-dual API:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error in chat-dual API',
      details: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
