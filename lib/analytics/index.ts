import { db } from "../db"

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
    const row = await db
        .selectFrom("chat_count")
        .select('responses')
        .where('id', '=', 1)
        .executeTakeFirst() 

    return row?.responses ?? 0
}

export const handleGetRequestCount = async () => {
    const row = await db
        .selectFrom("chat_count")
        .select("requests")
        .where("id", "=", 1)
        .executeTakeFirst() 

    return row?.requests ?? 0
}
