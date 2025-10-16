"use client"

import { useState } from 'react'
import type { FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { usePathname } from "next/navigation";
import ClerkUIWrapper from "@/wrapper/clerk/clerk-ui-wrapper";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-[18px] font-bold text-gray-900 font-poppins mr-4">
              NV
            </span>
          </div>
          <a
            href={pathname === "/fellowship" ? "/" : "/fellowship"}
            className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-poppins"
          >
            {pathname === "/fellowship" ? "HOME" : "BECOME A FELLOW"}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <ClerkUIWrapper />
        </div>
      </div>
    </header>
  );
};

interface RootProps {
  children: ReactNode;
}

const Root: FC<RootProps> = ({ children }) => {
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
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </QueryClientProvider>
    )
}

export default Root