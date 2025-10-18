import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = (role: Roles, authObject: any) => {
  const sessionClaims = authObject()?.sessionClaims
  return sessionClaims?.metadata?.role === role
}