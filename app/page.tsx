'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
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

  const elections = [
    {
      id: 'usa-az-special-2024',
      country: 'USA',
      region: 'Arizona',
      title: 'Arizona Special Election',
      date: 'November 5, 2024',
      type: 'State',
      description: 'Analyze the key issues and candidates in the upcoming Arizona special election.',
      candidates: ['Candidate A', 'Candidate B'],
      featured: true,
    },
    {
      id: 'usa-presidential-2024',
      country: 'USA',
      title: 'Presidential Election 2024',
      date: 'November 5, 2024',
      type: 'Federal',
      description: 'Compare the platforms of the leading candidates for the 2024 US Presidential Election.',
      candidates: ['Joe Biden', 'Donald Trump'],
      featured: false,
    },
    {
      id: 'canada-federal-2025',
      country: 'Canada',
      region: 'Alberta',
      title: 'Federal Election 2025',
      date: 'October 20, 2025',
      type: 'Federal',
      description: 'Get insights into the platforms of candidates in Canada’s next federal election.',
      candidates: ['Justin Trudeau', 'Pierre Poilievre'],
      featured: false,
    },
    {
      id: 'usa-va-gubernatorial-2025',
      country: 'USA',
      region: 'Virginia',
      title: 'Virginia Gubernatorial Election 2025',
      date: 'November 4, 2025',
      type: 'State',
      description: 'Examine the candidates and their positions in the Virginia gubernatorial race.',
      candidates: ['Candidate C', 'Candidate D'],
      featured: false,
    },
  ];

  const filteredElections = elections.filter(election =>
    (selectedCountry === '' || election.country === selectedCountry) &&
    (searchTerm === '' || 
     election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     election.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const countries = Array.from(new Set(elections.map(e => e.country))).sort();

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
            <Link href="/app" className="bg-slate-900 text-white px-6 py-2.5 font-semibold rounded-sm hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
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
        </div>
      </section>

      {/* Elections Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Upcoming Elections</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Select an upcoming election to begin your analysis, or use the search to find other races.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search for an election, e.g., 'German Federal'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white font-medium"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white font-medium"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Elections List */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            {filteredElections.map((election, index) => {
              const href = `/app?country=${encodeURIComponent(election.country)}&region=${encodeURIComponent(election.region || 'N/A')}&election=${encodeURIComponent(election.title)}`;
              return (
                <Link href={href} key={election.id} className="block">
                  <div
                    className={`group px-8 py-7 cursor-pointer hover:bg-slate-50 transition-all duration-200 hover:shadow-sm ${
                      index > 0 ? 'border-t border-gray-100' : ''
                    } ${
                      election.featured ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-600' : 'bg-white'
                    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{
                      transitionDelay: isLoaded ? `${400 + index * 50}ms` : '0ms'
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
                            {election.country}
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
                </Link>
              );
            })}
          </div>

          {filteredElections.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-gray-200 rounded-sm">
              <div className="max-w-md mx-auto">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.044-5.709-2.573M15 9a6 6 0 11-6 0 6 6 0 016 0z" />
                </svg>
                <p className="text-slate-500 font-medium">No elections found matching your criteria.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`text-center group transition-all duration-500 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-16 h-16 border-2 border-slate-300 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:border-slate-500 transition-colors duration-200">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Side-by-Side Analysis</h3>
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
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 text-center border-t border-gray-200 transition-all duration-500 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Explore an Election
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Dive into our most comprehensive election analysis with detailed candidate comparisons, policy breakdowns, and AI-powered insights.
          </p>
          <Link 
            href="/app"
            className="inline-flex items-center bg-slate-900 text-white px-10 py-4 text-lg font-semibold rounded-sm hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Analyze Elections
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-500 font-medium"> 2025 NextVoters</p>
            <p className="text-slate-400 text-sm mt-2">Nonpartisan Election Information • Empowering Informed Democracy</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 