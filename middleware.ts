import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import {protectedRegularRoutes, protectedAdminRoutes} from './data/protected-routes'
import { redirect } from 'next/navigation'
import { checkRole } from './lib/roles'

const isProtectedRoute = createRouteMatcher(protectedRegularRoutes)
const isProtectedAdminRoute = createRouteMatcher(protectedAdminRoutes)

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
  else if (isProtectedAdminRoute(req)) checkRole('admin') ? auth().protect() : redirect('/')
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}