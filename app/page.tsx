"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

const Home = () => {
 const router = useRouter();
 const [message, setMessage] = useState("");  

 const handleRedirectToChat = () => {
    router.push(
      `/chat?message=${message}`
    );
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
        <section className="relative pt-20 pb-8">
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-poppins leading-tight">
              Next Voters
            </h1>
            <p className="text-[16px] text-gray-600 mb-12 font-poppins leading-relaxed">
              Technology that empowers voters to understand policy and legislation fast
            </p>

            {/* Search + Preferences */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              {/* Search Input */}
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
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <PreferenceSelector />
            </div>
          </div>
        </section>

        {/* 87% Statistics Section */}
        <section className="py-24 bg-white -mt-4">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="w-full h-px bg-gray-200 mb-16"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="text-[120px] font-bold text-gray-900 leading-none mb-6 font-poppins">
                  87%
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  of people believe online disinformation has harmed their
                  country's politics{" "}
                  <span className="text-gray-500">
                    (according to a survey by the United Nations)
                  </span>
                </p>
              </div>
              <div className="pt-8">
                <h2 className="text-[24px] font-semibold text-gray-900 mb-6 leading-tight font-poppins">
                  Political misinformation is distracting Gen Z from voting on
                  facts
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4 font-poppins">
                  TikTok, Instagram, and other social platforms have become Gen
                  Z's chief civic classroom, but that's where misinformation
                  thrives. Young voters spend nearly three hours daily scrolling
                  past election-related content—much of it unverified and
                  influenced content—propagated by engagement algorithms. Despite
                  being digital natives, Gen Z encounters a barrage of
                  conflicting sources that deters them from seeking quality
                  information. The gap between confidence and skill is widening
                  dangerously.
                </p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200 mt-16"></div>
          </div>
        </section>

        {/* Fellowship Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-[28px] font-medium text-gray-900 mb-2 font-poppins leading-[1.2]">
              Join the
            </h2>
            <h2 className="text-[36px] font-extrabold text-gray-900 mb-14 font-poppins leading-[1.15] tracking-tight">
              Next Voters Fellowship
            </h2>
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
                in no-strings-attached, impact-based grants for top-performing
                fellows
              </p>
            </div>
            <p className="text-[18px] text-gray-900 mb-10 font-medium font-poppins leading-[1.4]">
              Make a real change and strengthen democracy.
            </p>
            <a
              href="/fellowship"
              className="inline-block px-10 py-4 text-[16px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-semibold"
            >
              Learn more
            </a>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
}

export default Home;