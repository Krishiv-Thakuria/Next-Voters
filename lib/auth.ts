import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const isUserAuthenticatedAndHasAdminRole = async (req: NextRequest) => {
    const {isAuthenticated, getRoles} = getKindeServerSession();
    const isUserAuthenticated = isAuthenticated();
    const userRoles = await getRoles();
    
    return (
        isUserAuthenticated &&
        Array.from(userRoles.values()).some((userRole) => userRole.key === "admin")
    );
}