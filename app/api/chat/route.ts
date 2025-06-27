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
    return {
      type: "eq",
      key: "filename",
      value: pdfFiles[0]
    };
  }
  
  return {
    type: "or",
    filters: pdfFiles.map(filename => ({
      type: "eq",
      key: "filename",
      value: filename
    }))
  };
}

// Create enhanced prompt for AutoRAG
function createEnhancedPrompt(userQuery: string, country: string, location: string): string {
  const partyNames = country.toLowerCase() === 'usa' 
    ? { party1: 'Democratic', party2: 'Republican' }
    : { party1: 'Liberal', party2: 'Conservative' };

  return `You are a political policy analyst helping voters understand party positions. Answer the user's question: "${userQuery}"

CRITICAL INSTRUCTIONS:
1. **Format your response EXACTLY like this:**
   [DEMOCRAT_START] or [LIBERAL_START]
   [Your complete analysis for the first party]
   [DEMOCRAT_END] or [LIBERAL_END]
   
   [REPUBLICAN_START] or [CONSERVATIVE_START]
   [Your complete analysis for the second party]
   [REPUBLICAN_END] or [CONSERVATIVE_END]

2. **Writing Style Requirements:**
   - Use clear, accessible language that voters can understand
   - Be comprehensive but not overwhelming
   - Start broad, then get specific with concrete examples
   - Use bullet points for lists and key takeaways
   - Use **bold** for emphasis on key points
   - Use *italics* for nuanced points or context
   - Use > blockquotes for direct policy statements when relevant
   - NEVER use em dashes (—), use regular dashes (-) instead
   - Use numbered lists for step-by-step processes or rankings

3. **Content Strategy:**
   - **Understand user intent:** If they ask about taxes and mention "middle-aged taxpayers," focus on how policies affect that demographic specifically
   - **Be comprehensive:** Don't just say "not mentioned in documents" - provide context about what the party DOES focus on instead
   - **Connect the dots:** Explain how broader policies affect the specific issue they're asking about
   - **Be practical:** Focus on real-world impacts, not just policy theory

4. **What to NEVER do:**
   - NEVER mention page numbers, document names, or sources directly in the text
   - NEVER say "the documents don't contain information" without providing related context
   - NEVER combine both parties in one section
   - NEVER use vague phrases like "they support this issue" - be specific about HOW and WHAT
   - NEVER ignore the user's demographic context (age, income bracket, location, etc.)

5. **Research Approach:**
   - If the exact topic isn't covered, discuss related policies that would impact the issue
   - Explain party philosophy and how it applies to the user's question
   - Mention what each party prioritizes instead if they don't focus on the specific issue
   - Provide historical context or voting records when relevant

6. **Formatting Examples:**
   
   **Good format:**
   • **Tax Credits:** The party proposes expanding the Child Tax Credit to $3,000 per child
   • **Small Business Support:** Plans include reducing corporate tax rates for businesses under $1M revenue
   
   **Bad format:**
   - The party supports tax reform (too vague)
   - According to page 15 of the platform... (mentions sources)

7. **Location Context:**
   Remember this is for voters in ${location}. Consider:
   - Local economic conditions
   - Regional priorities that might be affected
   - State-specific implementations of federal policies

Answer the user's question comprehensively for each party, following ALL the above guidelines.`;
}

// Query Cloudflare AutoRAG with enhanced prompting
async function queryAutoRAG(userQuery: string, filters: any, country: string, location: string): Promise<AutoRAGResponse> {
  const enhancedPrompt = createEnhancedPrompt(userQuery, country, location);
  
  const requestBody = {
    query: enhancedPrompt,
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
    
    if (responseData.success && responseData.result) {
      return {
        answer: responseData.result.response,
        response: responseData.result.response,
        documents: responseData.result.data || [],
        citations: []
      };
    } else {
      throw new Error('Invalid AutoRAG response structure');
    }
    
  } catch (error) {
    console.error('AutoRAG Fetch Error:', error);
    throw error;
  }
}

// Parse the enhanced AutoRAG response
function parseEnhancedResponse(fullResponse: string, country: string): [string, string] {
  const isUSA = country.toLowerCase() === 'usa';
  const party1Tags = isUSA ? ['[DEMOCRAT_START]', '[DEMOCRAT_END]'] : ['[LIBERAL_START]', '[LIBERAL_END]'];
  const party2Tags = isUSA ? ['[REPUBLICAN_START]', '[REPUBLICAN_END]'] : ['[CONSERVATIVE_START]', '[CONSERVATIVE_END]'];
  
  let party1Response = '';
  let party2Response = '';
  
  // Try to extract party1 response
  const party1StartIdx = fullResponse.indexOf(party1Tags[0]);
  const party1EndIdx = fullResponse.indexOf(party1Tags[1]);
  
  if (party1StartIdx !== -1 && party1EndIdx !== -1) {
    party1Response = fullResponse.substring(party1StartIdx + party1Tags[0].length, party1EndIdx).trim();
  }
  
  // Try to extract party2 response
  const party2StartIdx = fullResponse.indexOf(party2Tags[0]);
  const party2EndIdx = fullResponse.indexOf(party2Tags[1]);
  
  if (party2StartIdx !== -1 && party2EndIdx !== -1) {
    party2Response = fullResponse.substring(party2StartIdx + party2Tags[0].length, party2EndIdx).trim();
  }
  
  // Fallback: split on [STOP] if the new format didn't work
  if (!party1Response || !party2Response) {
    const stopSplit = fullResponse.split("[STOP]");
    party1Response = party1Response || stopSplit[0]?.trim() || '';
    party2Response = party2Response || stopSplit[1]?.trim() || '';
  }
  
  // Final fallback: split response in half
  if (!party1Response || !party2Response) {
    const midpoint = Math.floor(fullResponse.length / 2);
    party1Response = party1Response || fullResponse.substring(0, midpoint).trim();
    party2Response = party2Response || fullResponse.substring(midpoint).trim();
  }
  
  return [party1Response, party2Response];
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
    
    // Query AutoRAG with enhanced prompting
    const autoragResponse = await queryAutoRAG(userPrompt, filters, country, location);
    
    // Extract response text
    const fullResponse = autoragResponse.answer || autoragResponse.response || 'No response generated';
    console.log('Full AutoRAG Response:', fullResponse);
    
    // Parse the enhanced response
    const [party1Content, party2Content] = parseEnhancedResponse(fullResponse, country);
    
    // Format the final responses with headers
    const partyNames = country.toLowerCase() === 'usa' 
      ? { party1: 'Democratic', party2: 'Republican' }
      : { party1: 'Liberal', party2: 'Conservative' };
    
    const party1Response = `## ${partyNames.party1} Position\n\n${party1Content || 'Information not available in the provided documents.'}`;
    const party2Response = `## ${partyNames.party2} Position\n\n${party2Content || 'Information not available in the provided documents.'}`;
    
    return [party1Response, party2Response];
    
  } catch (error) {
    console.error('AutoRAG query failed:', error);
    
    // Fallback responses
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const partyNames = country.toLowerCase() === 'usa' 
      ? { party1: 'Democratic', party2: 'Republican' }
      : { party1: 'Liberal', party2: 'Conservative' };
      
    return [
      `## ${partyNames.party1} Position\n\nSorry, I couldn't retrieve policy information at this time. Please try again later.`,
      `## ${partyNames.party2} Position\n\nSorry, I couldn't retrieve policy information at this time. Please try again later.`
    ];
  }
}

export async function POST(req: Request) {
  try {
    const { messages, location, election } = await req.json();

    // Use the latest message from the user
    const userPrompt = (messages as Message[]).slice(-1)[0]?.content || 'No prompt provided';
    const prompts = [userPrompt];

    const safeLocation = location || 'an unspecified location';
    const safeElection = election || 'Not Specified';

    console.log('API Received - Prompts:', prompts, 'Location:', safeLocation, 'Election:', safeElection);

    const [region, country] = safeLocation.split(', ').reverse();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let closed = false;

        const ensureClosed = () => {
          if (!closed) {
            try {
              controller.close();
            } catch (e) {
              // Ignore errors if already closed or in an invalid state
            }
            closed = true;
          }
        };

        const enqueueData = (data: string) => {
          if (!closed) {
            try {
              controller.enqueue(encoder.encode(data));
            } catch (e) {
              console.error('Error enqueuing data:', e);
              ensureClosed(); // Close if enqueue fails
            }
          }
        };
        
        try {
          const promises = prompts.map(prompt => 
            generatePartyResponses(
              prompt, 
              safeLocation, 
              safeElection,
              country || 'Canada', // Default to Canada if not specified
              region || ''
            )
          );

          const results = await Promise.all(promises);

          for (let i = 0; i < results.length; i++) {
            if (closed) break;
            const [party1ResponseString, party2ResponseString] = results[i];

            enqueueData(party1ResponseString);
            if (closed) break;

            const separator = "\n\n---\n\n";
            enqueueData(separator);

            enqueueData(party2ResponseString);
            if (closed) break;

            if (i < results.length - 1) {
              const promptSeparator = "\n\n---\n\n";
              enqueueData(promptSeparator);
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMessage = `Error generating responses: ${error instanceof Error ? error.message : 'Unknown error'}`;
          enqueueData(errorMessage);
        } finally {
          ensureClosed();
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