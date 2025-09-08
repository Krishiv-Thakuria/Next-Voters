import { db } from "./database"

export const handleIncrementResponse = async () => {
    await db
        .updateTable("chat_count")
        .set(eb => ({
            responses: eb('responses', '+', 2)
        }))
        .where('id', '=', 1) 
        .execute()
}

export const handleIncrementRequest = async () => {
    await db 
        .updateTable("chat_count")
        .set(eb => ({
            requests: eb("requests", "+", 1)
        }))
        .where('id', '=', 1)
        .execute()
}

export const handleGetResponseCount = async () => {
    const responses = await db
        .selectFrom("chat_count")
        .select('responses')
        .where('id', '=', 1)

    return responses
}

export const handleGetRequestCount = async () => {
    const requests = await db
        .selectFrom("chat_count")
        .select("requests")
        .where("id", "=", 1)
    return requests
}
