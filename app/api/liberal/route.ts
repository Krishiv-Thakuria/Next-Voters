import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  const apiKey = process.env.OPENAI_API_KEY;
  
  try {
    // 1. Create a thread
    const threadRes = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({}),
    });
    
    if (!threadRes.ok) {
      const errorData = await threadRes.json();
      throw new Error(`Failed to create thread: ${errorData.error?.message || threadRes.statusText}`);
    }
    
    const thread = await threadRes.json();

    // 2. Add user message to thread
    const messageRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: userMessage,
      }),
    });
    
    if (!messageRes.ok) {
      const errorData = await messageRes.json();
      throw new Error(`Failed to add message: ${errorData.error?.message || messageRes.statusText}`);
    }

    // 3. Run the assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_KXNQSPG15w406WrOpOMm6jtI', // Liberal Assistant ID
      }),
    });
    
    if (!runRes.ok) {
      const errorData = await runRes.json();
      throw new Error(`Failed to start run: ${errorData.error?.message || runRes.statusText}`);
    }
    
    const run = await runRes.json();

    // 4. Poll for the run to complete with timeout
    let runStatus = run.status;
    const maxAttempts = 30; // Max 45 seconds (30 * 1.5)
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      const pollRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
      });
      
      if (!pollRes.ok) {
        const errorData = await pollRes.json();
        throw new Error(`Failed to poll run status: ${errorData.error?.message || pollRes.statusText}`);
      }
      
      const pollData = await pollRes.json();
      runStatus = pollData.status;
      
      if (runStatus === 'completed') {
        break;
      } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run ended with status: ${runStatus}. Reason: ${pollData.last_error?.message || 'Unknown error'}`);
      } else if (runStatus === 'requires_action') {
        throw new Error('Run requires action which is not supported in this implementation');
      }
      
      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    
    if (runStatus !== 'completed') {
      throw new Error('Assistant response timed out. Please try again.');
    }

    // 5. Fetch the assistant's final message
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
    });
    
    if (!messagesRes.ok) {
      const errorData = await messagesRes.json();
      throw new Error(`Failed to fetch messages: ${errorData.error?.message || messagesRes.statusText}`);
    }
    
    const messagesData = await messagesRes.json();
    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage) {
      throw new Error('No assistant message found in the response');
    }

    // Stream the assistant's reply
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            assistantMessage?.content?.[0]?.text?.value || 'No response from Assistant.'
          )
        );
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
    
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
