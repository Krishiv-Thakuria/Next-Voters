"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { db } from "@/lib/db"

export default async function handleRequestAdmin() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const email = user.email;
    const name = user.given_name;

    const userExists = await db
        .selectFrom("user_admin_request")
        .select("email")
        .where("email", "=", email)
        .executeTakeFirst()

    if (userExists) {
        return "User already exists"
    }
    
    await db
        .insertInto("user_admin_request")
        .values({
            email: email,
            name: name
        })
        .execute()
    return "User added successfully"
}
