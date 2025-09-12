import { generateObject } from 'ai';
import { z } from 'zod';

const generateLLMResponse = async () => {
    const { object } = await generateObject({
    model: 'openai/gpt-4.1',
    schema: z.object({
        recipe: z.object({
        name: z.string(),
        ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
        steps: z.array(z.string()),
        }),
    }),
    prompt: 'Generate a lasagna recipe.',
    });

    return object.message
}
