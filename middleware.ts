import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { protectedRegularRoutes } from "./data/protected-routes";
import { NextResponse, NextRequest } from "next/server";
import { isUserAuthenticatedAndHasAdminRole } from "./lib/auth";

const isPathMatch = (route: string) => {
    return route.startsWith("/admin")
}

export default async function middleware(req: NextRequest) {
  const route = req.nextUrl.pathname;
  if (isPathMatch(route) && !await isUserAuthenticatedAndHasAdminRole(req)) {
    const homeURL = new URL("/", req.url);
    return NextResponse.redirect(homeURL);
  }

  if (protectedRegularRoutes.includes(route)) {
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