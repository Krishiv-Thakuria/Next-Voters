"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export default async function handleRequestAdmin() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    
    if (!user) {
        return "Error: User not authenticated"
    }

    console.log("User email:", user.email)
    return "Admin request submitted"
}