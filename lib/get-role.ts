import { auth0 } from "./auth0";
const auth0Domain = 'https://dev-trnr2qjum5chbkue.us.auth0.com';

const handleGetAccessToken = async () => {
    const response = await fetch("/auth/access-token")

    if (!response.ok) {
        throw new Error("Failed to fetch access token")
    }

    const data = await response.json()
    return data.token
}
    
export const handleGetRole = async () => {
    const session = await auth0.getSession()
    const user = session?.user

    if (!user) {
        throw new Error("User not found")
    }

    const token = await handleGetAccessToken()

    const response = await fetch(`${auth0Domain}/api/v2/users/${user.sub}/roles`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
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