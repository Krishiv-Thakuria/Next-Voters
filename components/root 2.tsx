"use client"

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './common/header';

interface RootInterface {
    children: React.ReactNode
}

const Root: React.FC<RootInterface> = ({ children }) => {
    const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )  
  
  return (
    <QueryClientProvider client={queryClient}>
        <Header />
        {children}
    </QueryClientProvider>
  )
}

export default Root