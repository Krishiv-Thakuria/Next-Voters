import { generateObject, embed } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';


// Define a custom env variable for API key
const groq = createGroq({
    apiKey: process.env.GROQ_API_AUTH_KEY
})

export const generateResponses = async (prompt: string, country: "USA" | "Canada") => {
    const politicalPartiesMap = {
        USA: [
            
            {
                party: "Republican",
                partyPrompt: ""
            },
            {
                party: "Democratic",
                partyPrompt: ""
            }
        ],
        Canada: [
            {
                party: "Conservatives",
                partyPrompt: ""
            }, 
            {
                party: "Democractic",
                partyPrompt: ""
            }, {
                party: "Liberal",
                partyPrompt: ""
            }
        ]
    }

    const parties = politicalPartiesMap[country]

    const responses = await Promise.all(
        parties.map((party, partyPrompt) =>
            generateObject({
                model: groq('openai/gpt-4.1'),
                schema: z.object({
                    message: z.object({
                        answer: z.string(),
                        citation: z.string(),
                    }),
                }),
                system: `
                    You are a unbiased expert in politics and civic discourse. 
                    Generate a detailed and non-partisan response to the following prompt given in relation to this political party: ${party}
                    This is some extra context about what the party is to help you format a cohesive answer: ${partyPrompt}
                `,
                prompt,
            }).then(result => result.object)
        )
    )

    return responses
}

export const generateEmbeddings = async (value: string) => {
    const { embedding } = await embed({
        model: groq.textEmbeddingModel('text-embedding-3-small'),
        value
    })

    return embedding
}

export const searchEmbeddings = async () => {

}
