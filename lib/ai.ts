import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';

export const generateResponse = async () => {
    const { object } = await generateObject({
        model: groq('openai/gpt-4.1'),
        schema: z.object({
            recipe: z.object({
            name: z.string(),
            ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
            steps: z.array(z.string()),
            }),
        }),
        prompt: 'Generate a lasagna recipe.',
    });

    return object
}
