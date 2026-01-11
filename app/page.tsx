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
<<<<<<< HEAD
        <section className="relative pt-20 pb-16">
=======
        <section id="about" className="relative pt-16 pb-8">
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <h1 className="text-[48px] md:text-[56px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans leading-tight">
              Next Voters
            </h1>
<<<<<<< HEAD
            <p className="text-[16px] md:text-[18px] text-gray-600 mb-12 font-plus-jakarta-sans leading-relaxed max-w-2xl mx-auto">
=======
            <p className="text-[18px] text-gray-600 mb-4 font-poppins leading-relaxed max-w-2xl mx-auto">
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
              Technology that empowers voters to understand policy and legislation fast
            </p>
            <p className="text-[15px] text-gray-600 mb-12 font-poppins leading-relaxed max-w-2xl mx-auto">
              We're a nonprofit organization dedicated to combating misinformation and helping Gen Z voters make informed decisions based on facts, not viral content. Our AI-powered platform provides instant, unbiased answers to policy questions.
            </p>

            {/* Search + Preferences */}
<<<<<<< HEAD
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm mb-12">
                  {/* Search Input */}
                   <div className="relative">
                     <input
                       type="text"
                       placeholder="Ask any question about policy"
                       className="w-full pl-6 pr-16 py-4 text-[16px] text-gray-900 rounded-lg border-2 border-red-300 focus:outline-none focus:border-red-400 bg-gray-50 font-plus-jakarta-sans relative z-10"
                      onChange={(event) => setMessage(event.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
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

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-12">
                  <a
                    href="/chat"
                    className="inline-block px-8 py-4 text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
                  >
                    Start asking questions
                  </a>
                  <a
                    href="/fellowship"
                    className="inline-block px-8 py-4 text-[16px] font-semibold text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans"
                  >
                    Apply to fellowship
                  </a>
            </div>

            {/* Stanford Professor Testimonial */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 pt-8 pb-4 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
                    alt="Professor Morris P. Fiorina"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-[18px] font-semibold text-gray-900 font-plus-jakarta-sans mb-1">
                      Professor Morris P. Fiorina
                    </h3>
                    <p className="text-[14px] text-gray-600 font-plus-jakarta-sans">
                      Professor of Political Science, Stanford University
                    </p>
                  </div>
                </div>
                <p className="text-[16px] text-gray-700 leading-relaxed font-plus-jakarta-sans mb-4 italic text-left">
                  "I enjoyed my session with the Youth Civic Leaders fellows. They were knowledgeable, engaged and asked good questions. What I found very exciting was their geographic heterogeneity which brings a variety of different perspectives to their work."
                </p>
                <div className="flex items-center justify-center pt-4 border-t border-gray-200 pb-4 border-b border-gray-200">
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/10/Stanford-Symbol.png"
                    alt="Stanford University"
                    className="h-24 md:h-28 w-auto"
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <a
                    href="/fellowship"
                    className="inline-block px-8 py-3 text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
                  >
                    Join our fellowship
                  </a>
                </div>
              </div>
=======
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
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
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

<<<<<<< HEAD
        {/* Google for Nonprofits Support Section */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-3 font-plus-jakarta-sans">
=======
        {/* Supporters Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-4 font-poppins">
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
              Proud to be supported by
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 items-center">
              <Image
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
<<<<<<< HEAD
                className="h-32 object-contain"
=======
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
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
              />
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* 87% Statistics Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="text-[100px] md:text-[120px] font-bold text-gray-900 leading-none mb-6 font-plus-jakarta-sans">
                  87%
                </div>
                <p className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                  of people believe online disinformation has harmed their
                  country's politics{" "}
                  <span className="text-gray-500 text-[14px] md:text-[16px]">
                    (according to a survey by the United Nations)
                  </span>
                </p>
              </div>
              <div>
                <h2 className="text-[28px] md:text-[32px] font-semibold text-gray-900 mb-6 leading-tight font-plus-jakarta-sans">
                  Political misinformation is distracting Gen Z from voting on
                  facts
                </h2>
                <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
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
=======
        {/* What We Do Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-[32px] font-bold text-gray-900 mb-12 text-center font-poppins">
              How Next Voters Helps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3 font-poppins">Instant Policy Answers</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  Get clear, unbiased explanations of complex policies and legislation in seconds.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3 font-poppins">Fact-Checked Information</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-poppins">
                  Every answer is sourced from verified, credible information to combat misinformation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
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
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
              </div>
            </div>
          </div>
        </section>

        {/* Fellowship Section */}
<<<<<<< HEAD
        <section className="py-20 md:py-24 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4 font-plus-jakarta-sans leading-tight">
              Join the Next Voters Fellowship
            </h2>
            <p className="text-[18px] text-gray-600 mb-12 font-plus-jakarta-sans max-w-2xl mx-auto">
              Make a real change and strengthen democracy.
            </p>
            <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl p-10 md:p-12 mb-10 shadow-lg">
              <p className="text-[18px] text-gray-900 mb-4 font-plus-jakarta-sans leading-[1.4]">
=======
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
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
                Get access to a pool of
              </p>
              <div
                className="text-[64px] md:text-[72px] font-extrabold mb-4 leading-[1.05] font-plus-jakarta-sans"
                style={{
                  background: "linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                $10,000+
              </div>
<<<<<<< HEAD
              <p className="text-[17px] text-gray-900 leading-[1.5] font-plus-jakarta-sans">
                in no-strings-attached, impact-based grants for top-performing
                fellows
              </p>
            </div>
            <a
              href="/fellowship"
              className="inline-block px-10 py-4 text-[16px] text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-plus-jakarta-sans font-semibold shadow-sm"
            >
              Learn more
            </a>
=======
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
>>>>>>> 1e4be6d865e0a25b84981b01f8eeab33b2c76590
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

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 text-center">
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 font-poppins">
              © {new Date().getFullYear()} Next Voters. A registered 501(c)(3) nonprofit organization.
            </p>
          </div>
        </footer>
    </ClientMountWrapper>
  );
}

export default Home;