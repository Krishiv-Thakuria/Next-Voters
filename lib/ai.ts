import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';

// Define a custom env variable for API key
const groq = createGroq({
    apiKey: process.env.GROQ_API_AUTH_KEY
})

export const generateResponse = async (prompt: string) => {
    const { object } = await generateObject({
        model: groq('openai/gpt-4.1'),
        schema: z.object({
            recipe: z.object({
            name: z.string(),
            ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
            steps: z.array(z.string()),
            }),
        }),
        system: `
        You are an expert in politics and civic discourse. 
        Generate a detailed and non-partisan response to the following prompt given.
        `,
        prompt,
    });

    return object
}