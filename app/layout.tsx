import './globals.css'
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
})

export const metadata = {
  title: 'Next Voters',
  description: "Easily compare and understand the policy viewpoints of Canada's major political parties in real-time, helping you make informed decisions and engage more effectively in civic discussions."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Analytics />
        </QueryClientProvider>
      </body>
    </html>
  )
}