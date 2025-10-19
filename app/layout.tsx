import { type Metadata } from 'next'
import './globals.css'
import Root from '@/components/common/root'

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
    <html lang="en">
      <body className={`antialiased`}>
        <Root>{children}</Root>
      </body>
    </html>
  )
}