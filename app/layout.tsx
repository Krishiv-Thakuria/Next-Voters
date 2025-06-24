import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from "@vercel/analytics/react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';



export const metadata = {
  title: 'Next Voters',
  description: "Easily compare and understand the policy viewpoints of Canada's major political parties in real-time, helping you make informed decisions and engage more effectively in civic discussions."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}