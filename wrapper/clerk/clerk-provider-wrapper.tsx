import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

export default async function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClerkProvider>{children}</ClerkProvider>
}
