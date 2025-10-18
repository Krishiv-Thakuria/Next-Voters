import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import {protectedRegularRoutes, protectedAdminRoutes} from './data/protected-routes'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(protectedRegularRoutes)
const isProtectedAdminRoute = createRouteMatcher(protectedAdminRoutes)

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect()
    return NextResponse.next()
  }

  if (isProtectedAdminRoute(req)) {
    if (auth().sessionClaims?.metadata?.role === 'admin') {
      auth().protect()
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}