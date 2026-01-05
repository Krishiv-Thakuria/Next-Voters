"use client"

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

const Home = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRedirectToChat = () => {
    router.push(`/chat?message=${message}`);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRedirectToChat();
    }
  };

  return (
    <ClientMountWrapper className="min-h-screen bg-white">
      <div className="w-full">
        {/* Hero Section */}
        <section id="about" className="relative pt-16 pb-8">
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-poppins leading-tight">
              Next Voters
            </h1>
            <p className="text-[18px] text-gray-600 mb-4 font-poppins leading-relaxed max-w-2xl mx-auto">
              Technology that empowers voters to understand policy and legislation fast
            </p>
            <p className="text-[15px] text-gray-600 mb-12 font-poppins leading-relaxed max-w-2xl mx-auto">
              We're a nonprofit organization dedicated to combating misinformation and helping Gen Z voters make informed decisions based on facts, not viral content. Our AI-powered platform provides instant, unbiased answers to policy questions.
            </p>

            {/* Search + Preferences */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask any question about policy"
                  className="w-full pl-6 pr-16 py-4 text-[16px] text-gray-900 rounded-lg border border-red-300 focus:outline-none focus:border-red-400 bg-gray-50 font-poppins"
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  onClick={handleRedirectToChat}
                  aria-label="Submit question"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <PreferenceSelector />
            </div>

            {/* Additional CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="/chat" 
                className="px-8 py-3 bg-red-500 text-white text-[16px] rounded-lg hover:bg-red-600 transition-colors font-poppins font-medium"
              >
                Start Asking Questions
              </a>
              <a 
                href="/fellowship" 
                className="px-8 py-3 border border-gray-900 text-gray-900 text-[16px] rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium"
              >
                Apply to Fellowship
              </a>
            </div>
          </div>
        </section>

        {/* Supporters Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-4 font-poppins">
              Proud to be supported by
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 items-center">
              <Image
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
                width={200}
                height={100}
                className="object-contain"
              />
              <Image
                src="/lookup-live-logo.png"
                alt="Lookup Live"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-gray-900 mb-12 text-center font-poppins">
              How Next Voters Helps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3 font-poppins">Instant Policy Answers</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  Get clear, unbiased explanations of complex policies and legislation in seconds.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3 font-poppins">Fact-Checked Information</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  Every answer is sourced from verified, credible information to combat misinformation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3 font-poppins">Youth Leadership</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  Join our fellowship program to become a civic leader and educate your community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="w-full h-px bg-gray-200 mb-16"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="text-[72px] font-bold text-gray-900 leading-none mb-6 font-poppins">
                  Testimonial
                </div>
              </div>
              <div className="pt-8">
                <blockquote className="text-[15px] text-gray-700 leading-relaxed mb-6 font-poppins">
                  I enjoyed my session with the Youth Civic Leaders fellows. They were knowledgeable, engaged and asked good questions. What I found very exciting was their geographic heterogeneity which brings a variety of different perspectives to their work.
                </blockquote>
                <div className="flex items-center">
                  <Image 
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    src="/profile-pics/morris-fiorina.png"
                    alt="Morris Fiorina"
                    width={48}
                    height={48}
                  />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900 font-poppins">Morris Fiorina</p>
                    <p className="text-[14px] text-gray-600 font-poppins">Professor, Stanford University</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200 mt-16"></div>
          </div>
        </section>

        {/* Fellowship Section */}
        <section id="fellowship" className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-[28px] font-medium text-gray-900 mb-2 font-poppins leading-[1.2]">
              Join the
            </h2>
            <h2 className="text-[36px] font-extrabold text-gray-900 mb-8 font-poppins leading-[1.15] tracking-tight">
              Next Voters Fellowship
            </h2>
            <p className="text-[16px] text-gray-700 mb-12 max-w-2xl mx-auto font-poppins leading-relaxed">
              Our fellowship program trains young leaders to combat misinformation in their communities. Fellows receive mentorship, resources, and funding to make a real impact on civic engagement.
            </p>
            <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded-xl p-12 mb-8 shadow-sm">
              <p className="text-[16px] text-gray-900 mb-4 font-poppins leading-[1.4]">
                Get access to a pool of
              </p>
              <div
                className="text-[72px] font-extrabold mb-4 leading-[1.05] font-poppins"
                style={{
                  background: "linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/fellowship"
                className="inline-block px-10 py-4 text-[16px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-poppins font-semibold"
              >
                Apply Now
              </a>
              <a
                href="/fellowship"
                className="inline-block px-10 py-4 text-[16px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-semibold"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-50">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <h2 className="text-[32px] font-bold text-gray-900 mb-4 font-poppins">
              Get in Touch
            </h2>
            <p className="text-[16px] text-gray-700 mb-8 font-poppins leading-relaxed">
              Have questions about our platform or fellowship program? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contact@nextvoters.org" 
                className="px-8 py-3 bg-red-500 text-white text-[16px] rounded-lg hover:bg-red-600 transition-colors font-poppins font-medium"
              >
                Email Us
              </a>
              <a 
                href="/chat" 
                className="px-8 py-3 border border-gray-900 text-gray-900 text-[16px] rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium"
              >
                Try Our Platform
              </a>
            </div>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
}

export default Home;