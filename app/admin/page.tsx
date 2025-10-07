"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert>
        <AlertTitle>Admin Page</AlertTitle>
        <AlertDescription>
          This page allows you to navigate to either the Embed PDF section or the Request Token section.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={() => window.location.href = '/admin/embed-pdf'}>Go to Embed PDF</Button>
        <Button onClick={() => window.location.href = '/admin/request-token'}>Go to Request Token</Button>
      </div>
    </div>
  )
}

export default Admin