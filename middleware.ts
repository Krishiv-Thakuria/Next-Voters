import { NextRequest, NextResponse } from "next/server";
import { protectedRegularRoutes, protectedAdminRoutes } from "./data/protected-routes";
import { auth0 } from "./lib/auth0";
import { isAdmin } from "./lib/getRole";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession(request);
  const currentPath = request.nextUrl.pathname;

  if (!session) {
    if (protectedRegularRoutes.includes(currentPath) || protectedAdminRoutes.includes(currentPath)) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', currentPath);
      return NextResponse.redirect(loginUrl);
    }
    return auth0.middleware(request);
  }

  if (protectedAdminRoutes.some(route => currentPath.startsWith(route))) {
    try {
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/error', request.url));
    }
  }

  return auth0.middleware(request);
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