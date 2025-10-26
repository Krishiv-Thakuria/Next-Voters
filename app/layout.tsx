import { type Metadata } from 'next'
import './globals.css'
import Root from '@/components/common/root'
import { AuthProvider } from '@/wrappers/AuthProvider'

export const metadata: Metadata = {
  title: 'Next-Voters',
  description: 'Next-Voters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={`antialiased`}>
        <Root>{children}</Root>
      </body>
    </html>
    </AuthProvider>
  )
}