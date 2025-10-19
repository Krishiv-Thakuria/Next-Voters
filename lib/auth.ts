import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const isUserAuthenticatedAndHasAdminRole = async (req: NextRequest) => {
    const {isAuthenticated, getRoles} = getKindeServerSession();
    const isUserAuthenticated = isAuthenticated();
    const roles = await getRoles();
    const isAdmin = roles?.some((role) => role.key === "admin") || false

    return (
        isUserAuthenticated &&
        isAdmin
    );
}