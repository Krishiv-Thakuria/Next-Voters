import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { protectedRegularRoutes } from "./data/protected-routes";
import { NextResponse, NextRequest } from "next/server";
import { isUserAuthenticatedAndHasAdminRole } from "./lib/auth";

export default async function middleware(req: NextRequest) {
  if (protectedRegularRoutes.includes(req.nextUrl.pathname)) {
    return withAuth(req);
  }


  if (await isUserAuthenticatedAndHasAdminRole(req)) {
    return withAuth(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ]
};