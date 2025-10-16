import { type Metadata } from 'next'
import './globals.css'
import Root from '@/components/common/root'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Next-Voters',
  description: 'Combating political misinformation.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <Root>{children}</Root>
        </body>
      </html>
    </ClerkProvider>
  )
}