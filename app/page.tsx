"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

const Home = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleRedirectToChat = () => {
    router.push(`/chat?message=${encodeURIComponent(message)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  onClick={handleRedirectToChat}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <PreferenceSelector />
            </div>
          </div>
        </section>

        {/* Supporters */}
        <section className="py-16">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-1 font-poppins">
              Proud to be supported by
            </p>

            <div className="flex justify-center flex-wrap gap-10 items-center mt-6">
              <div className="relative w-[180px] sm:w-[220px] md:w-[250px] h-[60px]">
                <Image
                  src="/google-for-nonprofits-logo.png"
                  alt="Google for Nonprofits"
                  fill
                  sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, 250px"
                  className="object-contain"
                />
              </div>

              <div className="relative w-[220px] sm:w-[260px] md:w-[300px] h-[60px]">
                <Image
                  src="/lookup-live-logo.png"
                  alt="Lookup Live"
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 87% Statistic */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="w-full h-px bg-gray-200 mb-16"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="text-[120px] font-bold text-gray-900 leading-none mb-6 font-poppins">
                  87%
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  of people believe online disinformation has harmed their country's politics{" "}
                  <span className="text-gray-500">(according to a survey by the United Nations)</span>
                </p>
              </div>

              <div className="pt-8">
                <h2 className="text-[24px] font-semibold text-gray-900 mb-6 font-poppins">
                  Political misinformation is distracting Gen Z from voting on facts
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  TikTok, Instagram, and other platforms are Gen Z’s main civic classroom.
                  Algorithms reward outrage, not accuracy, leaving young voters buried under
                  conflicting narratives instead of verified facts.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 mt-16"></div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="w-full h-px bg-gray-200 mb-16"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="text-[72px] font-bold text-gray-900 font-poppins">
                  Testimonial
                </div>
              </div>

              <div className="pt-8">
                <blockquote className="text-[15px] text-gray-700 leading-relaxed mb-6 font-poppins">
                  I enjoyed my session with the Youth Civic Leaders fellows. They were knowledgeable,
                  engaged, and asked good questions. Their geographic diversity brought valuable
                  perspectives to the discussion.
                </blockquote>

                <div className="flex items-center">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden mr-3">
                    <Image
                      src="/profile-pics/morris-fiorina.png"
                      alt="Morris Fiorina"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-[15px] font-semibold text-gray-900 font-poppins">
                      Morris Fiorina
                    </p>
                    <p className="text-[14px] text-gray-600 font-poppins">
                      Professor, Stanford University
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 mt-16"></div>
          </div>
        </section>

        {/* Fellowship */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-[28px] font-medium text-gray-900 font-poppins">Join the</h2>
            <h2 className="text-[36px] font-extrabold text-gray-900 mb-14 font-poppins">
              Next Voters Fellowship
            </h2>

            <div className="max-w-lg mx-auto border border-gray-300 rounded-xl p-12 mb-8 shadow-sm">
              <p className="text-[16px] font-poppins mb-4">Get access to</p>
              <div className="text-[72px] font-extrabold mb-4 font-poppins bg-gradient-to-br from-red-700 to-blue-700 bg-clip-text text-transparent">
                $10,000+
              </div>
              <p className="text-[16px] font-poppins">
                in no-strings-attached, impact-based grants
              </p>
            </div>

            <a
              href="/fellowship"
              className="inline-block px-10 py-4 border border-gray-900 rounded-lg font-poppins font-semibold hover:bg-gray-50"
            >
              Learn more
            </a>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
};

export default Home;