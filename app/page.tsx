"use client"

import React from "react";
import usePreference from "@/hooks/preferences";
import { Preference } from "@/types/preferences";
import supportedRegions from "@/data/supported-regions";
import Dropdown from "@/components/ui/dropdown";

export default function LandingPage() {
 const { preference, handleSetPreference} = usePreference();

  const updatePreference = (field: keyof Preference, value: string) => {
    const newPref = { ...preference, [field]: value };
    handleSetPreference(newPref.election, newPref.region, newPref.party);
  };

  const handleFindParties = (regionName: string) => {
    const region =
      supportedRegions.find((r) => r.name === regionName)
    return region ? region.politicalParties : [];
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
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
                  placeholder="Ask any question about policy or legislation"
                  className="w-full pl-6 pr-16 py-4 text-[16px] text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 bg-gray-50 font-poppins"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
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

              {/* Dropdowns */}
              <div className="flex items-center md:flex-nowrap flex-wrap gap-x-12 gap-y-3 mt-6 pt-5 border-t border-gray-200">
                <Dropdown
                  label="Select Region"
                  value={preference?.region || ""}
                  options={["Canada", "USA"]}
                  onChange={(val) => {
                    updatePreference("region", val)
                    handleFindParties(preference?.region) 
                  }}
                />
                <Dropdown
                  label="Select Election"
                  value={preference?.election || ""}
                  options={[
                    "Federal Election 2025",
                    "General Election",
                    "Provincial Election",
                  ]}
                  onChange={(val) => updatePreference("election", val)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* New Feature Promo */}
        <section className="bg-white py-12">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
              <span className="text-[12px] font-semibold tracking-wide text-gray-700 uppercase font-poppins">
                New feature
              </span>
            </div>
            <div className="mt-4">
              <a
                href="/docs"
                className="inline-flex items-center gap-2 text-[14px] text-gray-900 font-poppins font-medium border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                </svg>
                Chat with a bill (analyze legislation)
              </a>
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
      </main>
    </div>
  );
}
