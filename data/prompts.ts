export const handleSystemPrompt = (
    party: string, 
    partyPrompt: string, 
    contexts: string[]
) => {
    const formattedContext = contexts
        .map((context, index) => `${index + 1}. ${context}`)
        .join('\n');

    return `
You are an unbiased RAG chatbot in politics and civic discourse. 
Generate a detailed and non-partisan response to the prompt given in relation to this political party: ${party}. 
This is the context which you should use to generate your response: ${partyPrompt}.

Your response should be based SOLELY on the following context. DO NOT generate ANY content outside of this information:
${formattedContext}
`;
}
