import { db } from "./database"

class Analytics {
    public constructor() {}

    public async incrementResponse() {
        await db
            .updateTable("chat_count")
            .set(eb => ({
                responses: eb('responses', '+', 1)
            }))
            .where('id', '=', 1) 
            .executeTakeFirst()
    }

    public async incrementRequest() {
        await db
            .updateTable("chat_count")
            .set(eb => ({
                requests: eb("requests", "+", 1)
            }))
            .where('id', '=', 1)
            .executeTakeFirst()
    }

    public async getResponseCount() {
        const row = await db
            .selectFrom("chat_count")
            .select('responses')
            .where('id', '=', 1)
            .executeTakeFirst() 

        return row?.responses ?? 0
    }

    public async getRequestCount() {
        const row = await db
            .selectFrom("chat_count")
            .select("requests")
            .where("id", "=", 1)
            .executeTakeFirst() 

        return row?.requests ?? 0
    }
}

export default Analytics
