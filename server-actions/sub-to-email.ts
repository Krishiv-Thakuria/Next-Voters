"use server"

import { db } from "@/lib/db"

export const handleSubscribeEmail = async (email: string) => {
    await db
        .insertInto("email_subscriptions")
        .values({ email })
        .execute()
}