import { auth0 } from "./auth0";

export const handleGetRole = async () => {
    const session = await auth0.getSession()
    const user = session?.user

    if (!user) {
        throw new Error("User not found")
    }

    const token = await auth0.getAccessToken()

    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}/roles`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch roles")
    }

    const data = await response.json()

    return data
}

export const isAdmin = async () => {
    const roles = await handleGetRole()
    return roles.some((role: any) => role.name === "admin")
}