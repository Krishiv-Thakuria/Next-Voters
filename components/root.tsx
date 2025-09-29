"use client"

import React, { useState, FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './common/header';
import { usePathname } from 'next/navigation';

interface RootInterface {
    children: ReactNode
}

const Root: FC<RootInterface> = ({ children }) => {
    const pathname = usePathname();
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
        {pathname !== '/chat' &&
          <Header />
        }
        {children}
    </QueryClientProvider>
  )
}

export default Root