import { NextRequest, NextResponse } from "next/server";
import { protectedRegularRoutes, protectedAdminRoutes } from "./data/protected-routes";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession(request);

  if (!session && protectedRegularRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session && protectedAdminRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};