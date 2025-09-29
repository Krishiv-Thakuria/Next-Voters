import { db } from "./database"

export const handleGetUser = async () => {
    const row = await db
        .selectFrom("admin_table")
        .selectAll()
        .executeTakeFirst() 

    return row ?? 0
}