'use client'
import Link from 'next/link'
import { FileText, Scale, RefreshCw, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-wide">Next Voters</h1>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <Link href="/docs" className="hover:text-black">Documents</Link>
            <Link href="/app?country=USA&region=Arizona&election=Arizona+Special+Election" className="hover:text-black">Compare</Link>
            <a href="#about" className="hover:text-black">About</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-24">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-5xl font-extralight tracking-tight mb-6">Empowering Civic Education</h2>
            <p className="text-gray-600 text-lg mb-8">Break down political platforms and explore how parties approach the issues that matter to you.</p>
            <Link href="/app?country=Canada&region=National&election=Federal+Election+2025" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 px-4">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full">
                <FileText className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium mb-2">Official Sources</h3>
              <p className="text-gray-600">We analyze real party documents to keep information accurate and current.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full">
                <Scale className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium mb-2">Side-by-Side Views</h3>
              <p className="text-gray-600">Compare viewpoints in a clear, easy format so you can form your own opinion.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full">
                <RefreshCw className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium mb-2">Always Improving</h3>
              <p className="text-gray-600">Our tools grow with the political landscape to help you stay informed.</p>
            </div>
          </div>
        </section>

        <section id="about" className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h3 className="text-3xl font-semibold mb-4">About Next Voters</h3>
            <p className="text-gray-600 mb-8">Next Voters is a civic education project designed to make political information accessible. We believe everyone should be able to participate in democracy with confidence.</p>
            <Link href="/app?country=Canada&region=National&election=Federal+Election+2025" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
              Explore the App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © 2024 Next Voters
      </footer>
    </div>
  )
}
