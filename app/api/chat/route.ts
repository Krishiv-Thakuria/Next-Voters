import { StreamingTextResponse, Message } from 'ai';

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

// Simulate a delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dummyText = `
Et reprehenderit non in anim excepteur nisi exercitation aliqua nulla. Commodo excepteur est nisi cupidatat pariatur officia sunt cillum veniam. Ut veniam nostrud elit ex culpa nisi occaecat eiusmod culpa ea in. Aliqua adipisicing consequat laborum. Reprehenderit cupidatat qui dolor aliquip nisi cillum esse consequat nisi qui ea. Occaecat officia ex enim exercitation aliqua do occaecat. Labore excepteur sint Lorem veniam minim deserunt. Officia cupidatat cupidatat anim Lorem ad aute in cillum ea elit nostrud consequat qui velit aliquip.

Velit mollit quis ullamco pariatur amet dolor magna. Esse commodo sint ex ipsum elit ea in velit aliquip. Reprehenderit irure laboris consequat reprehenderit tempor aliqua ea cupidatat aliquip ut proident Lorem duis culpa. Eiusmod laborum anim amet et laboris. Et aliqua fugiat est fugiat. Quis est quis dolor tempor est incididunt aute et dolore officia irure.

Occaecat nulla sint eu excepteur est ea laboris esse incididunt sunt tempor quis duis amet. Sit labore voluptate proident ea elit mollit ex ut nostrud velit. Eu minim reprehenderit ea ullamco nulla cillum officia. Proident in ipsum amet proident laborum aute nulla minim cupidatat elit sit dolor eiusmod est velit. Eu eu adipisicing dolor ea eu mollit pariatur anim. Commodo irure ex laboris et minim laborum.
`


// Helper function to simulate fetching Candidate 1's response
async function getParty1Response(userPrompt: string, location: string): Promise<string> {
  await sleep(100); // Simulate some base work/delay for fetching/generating
  return `Candidate A (responding to '${userPrompt}' from ${location}): \n\n${dummyText}`;
}

// Helper function to simulate fetching Candidate 2's response
async function getParty2Response(userPrompt: string, location: string): Promise<string> {
  await sleep(150); // Simulate some base work/delay, perhaps different from C1
  return `Candidate B (also on '${userPrompt}' at ${location}): \n\n${dummyText}`;
}

export async function POST(req: Request) {
  try {
    const { messages, location } = await req.json();

    const userPrompt = (messages as Message[]).slice(-1)[0]?.content || 'No prompt provided';
    const safeLocation = location || 'an unspecified location';

    console.log('API Received - Prompt:', userPrompt, 'Location:', safeLocation);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // "Call" (fetch/generate) both responses concurrently
        const [party1ResponseString, party2ResponseString] = await Promise.all([
          getParty1Response(userPrompt, safeLocation),
          getParty2Response(userPrompt, safeLocation)
        ]);

        // Stream Party 1's response (character by character with typing simulation)
        for (const char of party1ResponseString) {
          controller.enqueue(encoder.encode(char));
          await sleep(2); // Simulate typing
        }

        const separator = "\n\n---CANDIDATE_SEPARATOR---\n\n";
        for (const char of separator) {
          controller.enqueue(encoder.encode(char));
          await sleep(5); // Simulate typing for separator (quicker)
        }

        // Stream Party 2's response (character by character with typing simulation)
        for (const char of party2ResponseString) {
          controller.enqueue(encoder.encode(char));
          await sleep(2); // Simulate typing
        }
        
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error in chat API', details: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
