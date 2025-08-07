'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const countryData: Record<string, string[]> = {
  USA: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  Canada: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
};

const electionOptions: Record<string, string[]> = {
  USA: [
    'Presidential Election 2024',
    'Arizona Special Election',
    'Congressional Primary',
    'Midterm Elections',
    'General Election'
  ],
  Canada: [
    'Federal Election 2025',
    'General Election',
    'Provincial Election'
  ]
};

export default function LandingPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [country, setCountry] = useState('Canada');
  const [region, setRegion] = useState('Ontario');
  const [election, setElection] = useState('Federal Election 2025');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Detect user's location based on IP
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use ipapi.co for IP-based geolocation (free, no API key required)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_name && data.region) {
          // Map country names to our system
          let detectedCountry = '';
          if (data.country_name === 'United States' || data.country_code === 'US') {
            detectedCountry = 'USA';
          } else if (data.country_name === 'Canada' || data.country_code === 'CA') {
            detectedCountry = 'Canada';
          }
          
          if (detectedCountry && countryData[detectedCountry]) {
            // Check if the detected region exists in our data
            const availableRegions = countryData[detectedCountry];
            let detectedRegion = '';
            
            // Try to match the region name
            if (detectedCountry === 'USA') {
              detectedRegion = availableRegions.find(region => 
                region.toLowerCase().includes(data.region.toLowerCase()) ||
                data.region.toLowerCase().includes(region.toLowerCase())
              ) || '';
            } else if (detectedCountry === 'Canada') {
              // For Canada, map common region names
              const regionMap: Record<string, string> = {
                'ontario': 'Ontario',
                'quebec': 'Quebec',
                'british columbia': 'British Columbia',
                'alberta': 'Alberta',
                'manitoba': 'Manitoba',
                'saskatchewan': 'Saskatchewan',
                'nova scotia': 'Nova Scotia',
                'new brunswick': 'New Brunswick',
                'newfoundland and labrador': 'Newfoundland and Labrador',
                'prince edward island': 'Prince Edward Island'
              };
              detectedRegion = regionMap[data.region.toLowerCase()] || '';
            }
            
            // Update the state with detected location
            setCountry(detectedCountry);
            if (detectedRegion) {
              setRegion(detectedRegion);
            }
            
            // Set default election for the detected country
            const defaultElection = electionOptions[detectedCountry]?.[0];
            if (defaultElection) {
              setElection(defaultElection);
            }
          }
        }
      } catch (error) {
        console.log('Could not detect location:', error);
        // Keep default values if geolocation fails
      } finally {
        setIsLoadingLocation(false);
      }
    };

    detectLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !country || !region || !election) return;
    
    // Store the form data in sessionStorage to pass to the app page
    sessionStorage.setItem('nextVotersData', JSON.stringify({
      question: question.trim(),
      country,
      region,
      election
    }));
    
    // Navigate to the full chat interface with query params as backup to sessionStorage
    const params = new URLSearchParams({
      country,
      region,
      election,
      q: question.trim(),
    });
    router.push(`/app?${params.toString()}`);
  };

  const availableRegions = countryData[country] || [];
  const availableElections = electionOptions[country] || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/fellowship"
              className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-poppins"
            >
              BECOME A FELLOW
            </a>
        </div>
          <div className="flex items-center">
            <span className="text-[18px] font-bold text-gray-900 font-poppins">NV</span>
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* Hero with animated background */}
        <section className="relative pt-20 pb-8">
          {/* Animated background (pattern + subtle rotating gradient) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="animated-hero overlay absolute inset-0"></div>
            <div className="animated-hero gradient absolute -inset-[20%]"></div>
            <div className="animated-hero pattern absolute inset-0"></div>
          </div>

          <div className="relative max-w-[680px] mx-auto px-6 text-center">
          {/* Main Title */}
          <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Next Voters
              </h1>
          
          {/* Subtitle */}
          <p className="text-[16px] text-gray-600 mb-12 font-poppins leading-relaxed">
            Technology that empowers voters to understand policy and legislation fast
          </p>
          
            {/* Search Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask any question about policy or legislation"
                    className="w-full pl-6 pr-16 py-4 text-[16px] text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 bg-gray-50 font-poppins"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    disabled={!question.trim() || !country || !region || !election}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
            </div>

                {/* Dropdowns */}
                <div className="flex justify-center gap-4 mt-4">
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setRegion('');
                      setElection(electionOptions[e.target.value]?.[0] || '');
                    }}
                    className="px-4 py-2 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 font-poppins"
                  >
                    {Object.keys(countryData).map((countryName) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="px-4 py-2 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 disabled:opacity-50 font-poppins"
                    disabled={!availableRegions.length}
                  >
                    <option value="">Select Region</option>
                    {availableRegions.map((regionName) => (
                      <option key={regionName} value={regionName}>
                        {regionName}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={election}
                    onChange={(e) => setElection(e.target.value)}
                    className="px-4 py-2 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 disabled:opacity-50 font-poppins"
                    disabled={!availableElections.length}
                  >
                    <option value="">Select Election</option>
                    {availableElections.map((electionName) => (
                      <option key={electionName} value={electionName}>
                        {electionName}
                      </option>
                    ))}
                  </select>
            </div>
              </form>
          </div>
        </div>
      </section>

        {/* New Feature Promo in whitespace */}
        <section className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 pt-2 pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
              <span className="text-[12px] font-semibold tracking-wide text-gray-700 uppercase font-poppins">New feature</span>
                </div>
            <div className="mt-3">
              <a href="/docs" className="inline-flex items-center gap-2 text-[14px] text-gray-900 font-poppins font-medium border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
                Chat with a bill (analyze legislation)
              </a>
          </div>
        </div>
      </section>

      </main>

       {/* 87% Statistics Section */}
      <section className="py-24 bg-white -mt-4">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Top divider line */}
          <div className="w-full h-px bg-gray-200 mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Large 87% */}
            <div>
              <div className="text-[120px] font-bold text-gray-900 leading-none mb-6 font-poppins">
                87%
              </div>
              <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                of people believe online disinformation has harmed their country's politics 
                <span className="text-gray-500"> (according to a survey by the United Nations)</span>
              </p>
              </div>

            {/* Right Column - Content */}
            <div className="pt-8">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-6 leading-tight font-poppins">
                Political misinformation is distracting Gen Z from voting on facts
              </h2>
              <p className="text-[15px] text-gray-700 leading-relaxed mb-4 font-poppins">
                TikTok, Instagram, and other social platforms have become Gen Z's chief civic classroom, but that's where misinformation thrives. Young voters spend nearly three hours daily scrolling past election-related content—much of it unverified and influenced content—propagated by engagement algorithms. Despite being digital natives, Gen Z encounters a barrage of conflicting sources that deters them from seeking quality information. The gap between confidence and skill is widening dangerously.
              </p>
            </div>
          </div>
          
          {/* Bottom divider line */}
          <div className="w-full h-px bg-gray-200 mt-16"></div>
        </div>
      </section>

      {/* Next Voters Fellowship Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-[28px] font-medium text-gray-900 mb-2 font-poppins leading-[1.2]">
            Join the
          </h2>
          <h2 className="text-[36px] font-extrabold text-gray-900 mb-14 font-poppins leading-[1.15] tracking-tight">
            Next Voters Fellowship
            </h2>
          
          {/* Fellowship Card */}
          <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded-xl p-12 mb-8 shadow-sm">
            <p className="text-[16px] text-gray-900 mb-4 font-poppins leading-[1.4]">
              Get access to a pool of
            </p>
            <div 
              className="text-[72px] font-extrabold mb-4 leading-[1.05] font-poppins"
              style={{ 
                background: 'linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              $10,000+
            </div>
            <p className="text-[16px] text-gray-900 leading-[1.45] font-poppins">
              in no-strings-attached, impact-based grants for top-performing fellows
            </p>
          </div>
          
          <p className="text-[18px] text-gray-900 mb-10 font-medium font-poppins leading-[1.4]">
            Make a real change and strengthen democracy.
          </p>
          
          <a href="/fellowship" className="inline-block px-10 py-4 text-[16px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-semibold">
            Learn more
          </a>
        </div>
      </section>
    </div>
  );
}  