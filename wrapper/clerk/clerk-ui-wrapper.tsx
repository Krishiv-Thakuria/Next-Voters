'use client'

import React from 'react'
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
  SignInButton,
} from '@clerk/nextjs'

export default async function ClerkUIWrapper() {
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  )
}
