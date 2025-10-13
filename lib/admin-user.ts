import { db } from "./analytics/database"

export const handleGetUser = async (email: string) => {
    const row = await db
        .selectFrom("admin_table")
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst() 

    return row ?? 0
}