'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for fonts and initial layout to settle
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Also listen for font loading
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setIsLoaded(true);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  // Sample elections data - your team can expand this
  const elections = [
    {
      id: 'az-7th-2025',
      title: 'Arizona 7th Congressional District Special Election',
      date: '2025',
      type: 'Congressional',
      state: 'Arizona',
      status: 'active',
      featured: true
    },
    {
      id: 'ca-senate-2025',
      title: 'California Senate Race',
      date: '2025',
      type: 'Senate',
      state: 'California',
      status: 'upcoming'
    },
    {
      id: 'tx-gov-2026',
      title: 'Texas Gubernatorial Election',
      date: '2026',
      type: 'Gubernatorial',
      state: 'Texas',
      status: 'upcoming'
    },
    {
      id: 'ny-15th-2025',
      title: 'New York 15th Congressional District',
      date: '2025',
      type: 'Congressional',
      state: 'New York',
      status: 'upcoming'
    }
  ];

  const filteredElections = elections.filter(election =>
    (selectedState === '' || election.state === selectedState) &&
    (searchTerm === '' || 
     election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     election.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const states = Array.from(new Set(elections.map(e => e.state))).sort();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 lg:px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-slate-700 rounded-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">NextVoters</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              Contact
            </Link>
            <Link href="/chat" className="bg-slate-900 text-white px-6 py-2.5 font-semibold rounded-sm hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
              Analyze Elections
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className={`text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Informed Democracy Through Data
          </h1>
          <p className={`text-xl text-slate-600 mb-12 leading-relaxed font-medium transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Compare candidate positions and analyze policy differences with AI-powered tools.
          </p>
          
          {/* Two line summary under hero */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 border border-slate-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Verified Information</h3>
                <p className="text-slate-600 text-sm">All data sourced from official campaign documents and public records</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 border border-slate-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Nonpartisan Analysis</h3>
                <p className="text-slate-600 text-sm">Currently covering key 2025 elections with unbiased insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Elections */}
        <section className={`pb-20 transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search elections by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 font-medium"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white font-medium"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Elections List */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            {filteredElections.map((election, index) => (
              <div
                key={election.id}
                className={`group px-8 py-7 cursor-pointer hover:bg-slate-50 transition-all duration-200 hover:shadow-sm ${
                  index > 0 ? 'border-t border-gray-100' : ''
                } ${
                  election.featured ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-600' : 'bg-white'
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  transitionDelay: isLoaded ? `${400 + index * 50}ms` : '0ms'
                }}
                onClick={() => {
                  if (election.id === 'az-7th-2025') {
                    window.location.href = '/chat';
                  } else {
                    window.location.href = `/election/${election.id}`;
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-200">
                      {election.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-slate-600 font-medium">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {election.state}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {election.date}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {election.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {election.featured && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-slate-700 text-sm font-medium">
                          Ready
                        </span>
                      </div>
                    )}
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredElections.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-gray-200 rounded-sm">
              <div className="max-w-md mx-auto">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.044-5.709-2.573M15 9a6 6 0 11-6 0 6 6 0 016 0z" />
                </svg>
                <p className="text-slate-500 font-medium">No elections found matching your criteria.</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter settings.</p>
              </div>
            </div>
          )}
        </section>

        {/* Features */}
        <section className={`py-20 border-t border-gray-200 transition-all duration-500 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted Election Analysis</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform provides comprehensive, nonpartisan information to help voters make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`text-center group transition-all duration-500 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-16 h-16 border-2 border-slate-300 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:border-slate-500 transition-colors duration-200">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Compare candidate positions on key issues using advanced language models trained on official campaign documents and public records.
              </p>
            </div>

            <div className={`text-center group transition-all duration-500 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-16 h-16 border-2 border-slate-300 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:border-slate-500 transition-colors duration-200">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Verified Information</h3>
              <p className="text-slate-600 leading-relaxed">
                All information is sourced from official campaign materials, voting records, and verified public statements to ensure accuracy and reliability.
              </p>
            </div>

            <div className={`text-center group transition-all duration-500 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-16 h-16 border-2 border-slate-300 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:border-slate-500 transition-colors duration-200">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-Time Updates</h3>
              <p className="text-slate-600 leading-relaxed">
                Stay informed with the latest information as campaigns release new positions and policy statements throughout the election cycle.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`py-20 text-center border-t border-gray-200 transition-all duration-500 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Explore Arizona's 7th Congressional District
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Experience our most comprehensive election analysis with detailed candidate comparisons, policy breakdowns, and AI-powered insights for this critical special election.
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center bg-slate-900 text-white px-10 py-4 text-lg font-semibold rounded-sm hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Compare Candidates
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-500 font-medium">© 2025 NextVoters</p>
            <p className="text-slate-400 text-sm mt-2">Nonpartisan Election Information • Empowering Informed Democracy</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 