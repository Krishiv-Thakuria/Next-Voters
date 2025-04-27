import { StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!anthropicApiKey) {
    return new Response(JSON.stringify({ 
      error: 'ANTHROPIC_API_KEY environment variable is not set' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Base prompt for analysis instructions
  const basePrompt = `IMPORTANT: Focus ONLY on what the user explicitly asked about - nothing more. Extract ONLY the specific Liberal Party policies, initiatives, and details that DIRECTLY relate to the user's query.

Do not provide general information or context outside what was specifically requested. If the user asks about "taxes", only discuss tax policies, not the broader economy or other topics.

Structure your answer in concise bullet points using markdown formatting with specific commitments, targets, and timelines. Be brief and direct. Include exact quotes when helpful.

If there is limited or no information on the specific topic, briefly state this rather than expanding to adjacent topics.`;

  try {
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // Create the response stream
    const stream = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      stream: true,
      system: basePrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "url",
                url: "https://liberal.ca/wp-content/uploads/sites/292/2025/04/Canada-Strong.pdf"
              },
              cache_control: { type: "ephemeral" }
            },
            {
              type: "text",
              text: userMessage
            }
          ]
        }
      ],
    });

    // Create a proper stream for StreamingTextResponse
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // Handle the events in the stream
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(textEncoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      }
    });

    // Return the properly formatted streaming response
    return new StreamingTextResponse(readableStream);
    
  } catch (error) {
    console.error('Liberal API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
