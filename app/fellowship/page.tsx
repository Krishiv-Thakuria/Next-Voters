'use client';

import React from 'react';

export default function FellowshipPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-[14px] text-gray-700 hover:text-gray-900 font-poppins">
              Home
            </a>
          </div>
          <div className="flex items-center">
            <a href="/" className="text-[18px] font-bold text-gray-900 font-poppins">NV</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <div className="max-w-[680px] mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Become a civic changemaker
          </h1>
          
          <p className="text-[16px] text-gray-600 mb-10 font-poppins leading-relaxed">
            Changing the world starts with changing your community.
          </p>
          
          <a href="https://getwaitlist.com/waitlist/30664" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium">
            Apply Now - It's Free
          </a>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[600px] mx-auto">
          <hr className="border-gray-200 my-16" />
        </div>

        {/* $10,000+ Section */}
        <div className="max-w-[680px] mx-auto px-6 text-center mb-20">
          <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded-xl p-12 shadow-sm">
            <p className="text-[16px] text-gray-900 mb-6 font-poppins">
              Get access to a pool of
            </p>
            <div 
              className="text-[64px] font-bold mb-6 leading-none font-poppins"
              style={{ 
                background: 'linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              $10,000+
            </div>
            <p className="text-[16px] text-gray-900 leading-relaxed font-poppins">
              in no-strings-attached, impact-based grants for top-performing fellows
            </p>
          </div>
        </div>

        {/* Fellows Lead Real Change Section */}
        <div className="max-w-[680px] mx-auto px-6 text-center mb-20">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-12 font-poppins">
            Fellows lead <em>real</em> change
          </h2>
          
          {/* Impact Cards */}
          <div className="space-y-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
              <h3 className="text-[20px] font-semibold text-gray-900 mb-4 font-poppins">
                Create viral content that impacts millions
              </h3>
              <p className="text-[14px] text-gray-700 leading-relaxed font-poppins">
                Fellows will be directly involved in our viral messaging campaigns with 
                millions of views on social pages, empowering millions of voters by 
                making democracy and discussions truly accessible to their vision.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
              <h3 className="text-[20px] font-semibold text-gray-900 mb-4 font-poppins">
                Lead real change in your community
              </h3>
              <p className="text-[14px] text-gray-700 leading-relaxed font-poppins">
                Fellows will empower young voters in their local community of 
                choice (school, district, city) by bringing big Next Voters tools.
              </p>
            </div>
          </div>
        </div>

        {/* Mentorship Section */}
        <div className="max-w-[680px] mx-auto px-6 text-center mb-20">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-6 font-poppins">
            Exclusive mentorship with civic leaders
          </h2>
          
          <p className="text-[14px] text-gray-700 mb-12 font-poppins leading-relaxed">
            From politicians, to podcasters to brilliant civic and social organizations, 
            fellows receive exclusive guidance from established leaders in the movement - 
            part of our exclusive mentorship network.
          </p>
          
          {/* Mentor Placeholders */}
          <div className="flex justify-center gap-6 mb-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                <span className="text-[24px] text-gray-400 font-poppins">?</span>
              </div>
            ))}
          </div>
          
          <p className="text-[12px] text-gray-500 font-poppins">
            Mentors to be announced soon, check back later!
          </p>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-[680px] mx-auto px-6 text-center pb-20">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-6 font-poppins">
            Let's strengthen democracy, together
          </h2>
          
          <a href="https://getwaitlist.com/waitlist/30664" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium">
            Apply Now - It's Free
          </a>
        </div>
      </main>
    </div>
  );
}