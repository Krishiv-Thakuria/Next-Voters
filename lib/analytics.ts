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