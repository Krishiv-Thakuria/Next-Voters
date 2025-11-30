"use server"

import { db } from "@/lib/db"

export const handleSubscribeEmail = async (email: string) => {

    const isEmailSubbed = await db
        .selectFrom("email_subscriptions")
        .select("email")
        .where("email", "=", email)
        .executeTakeFirst()

    if (!isEmailSubbed) {
        await db
            .insertInto("email_subscriptions")
            .values({ email })
            .execute()
    } else {
        return { error: "Email already subscribed" }
    }
}