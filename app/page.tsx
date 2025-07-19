'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    dataPoints: 0,
    topics: 0,
    realTime: 0,
    monitoring: 0
  });
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoaded(true);
    
    // Enhanced scroll tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;
      setScrollProgress(progress);
      setScrollY(scrollTop);
    };

    // Ultra-smooth cursor tracking with direct DOM manipulation
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position for magnetic effects
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (cursorRef.current) {
        // Detect hover state with bulletproof logic
        const target = e.target as HTMLElement;
        const isInteractiveElement = (
          target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('hover-target') ||
          target.closest('.hover-target') ||
          target.classList.contains('group') ||
          target.closest('.group')
        );
        
        // Force immediate cursor variant update for reliability
        const shouldHover = !!isInteractiveElement;
        const newVariant = shouldHover ? 'hover' : 'default';
        setCursorVariant(newVariant);
        
        // Direct DOM manipulation for position (always smooth)
        const cursor = cursorRef.current;
        const currentOffset = shouldHover ? 20 : 12;
        
        cursor.style.transform = `translate3d(${e.clientX - currentOffset}px, ${e.clientY - currentOffset}px, 0)`;
        cursor.style.opacity = '1';
      }
    };

    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Counter animation effect
  useEffect(() => {
    if (isStatsVisible) {
      const animateCounters = () => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 FPS
        const increment = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          setCounters({
            dataPoints: Math.floor(1 * easeProgress),
            topics: Math.floor(150 * easeProgress),
            realTime: Math.floor(3 * easeProgress),
            monitoring: Math.floor(24 * easeProgress)
          });
          
          if (step >= steps) {
            clearInterval(timer);
            setCounters({
              dataPoints: 1,
              topics: 150,
              realTime: 3,
              monitoring: 24
            });
          }
        }, increment);
        
        return () => clearInterval(timer);
      };
      
      const cleanup = animateCounters();
      return cleanup;
    }
  }, [isStatsVisible]);

  // Advanced Intersection Observer for progressive reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'stats-section') {
              setIsStatsVisible(true);
            }
            setVisibleElements(prev => new Set([...prev, entry.target.id || entry.target.className]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe multiple elements
    const elementsToObserve = [
      'stats-section',
      'hero-section',
      'features-section',
      'cta-section'
    ];

    elementsToObserve.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Custom styles for enhanced polish */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 2px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 1px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Selection styling */
        ::selection {
          background: #f3f4f6;
          color: #111827;
        }
        
        /* Custom cursor styling - Desktop only */
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
          body {
            cursor: none;
          }
        }
        
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
        
        /* Subtle noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%),
            linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%);
          background-size: 15px 15px, 15px 15px;
          opacity: 0.02;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
      
      <div className="min-h-screen bg-white text-black">
        {/* Ultra-Smooth Custom Cursor - Desktop Only */}
        <div 
          ref={cursorRef}
          className={`fixed pointer-events-none z-[9999] hidden md:block transition-all duration-150 ease-out ${
            cursorVariant === 'hover' 
              ? 'w-10 h-10' 
              : 'w-6 h-6'
          }`}
          style={{
            willChange: 'transform',
            opacity: 0,
            top: 0,
            left: 0
          }}
        >
          {/* Main cursor */}
          <div 
            className={`absolute inset-0 rounded-full border-2 transition-all duration-150 ${
              cursorVariant === 'hover' 
                ? 'border-black bg-black/10 backdrop-blur-sm scale-110' 
                : 'border-black/70 bg-white/90 backdrop-blur-sm scale-100'
            }`}
            style={{ 
              boxShadow: cursorVariant === 'hover' 
                ? '0 4px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.6)' 
                : '0 2px 10px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.9)'
            }}
          ></div>
          
          {/* Center dot */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full transition-all duration-150 ${
              cursorVariant === 'hover' ? 'w-2 h-2' : 'w-1 h-1'
            }`}
          ></div>
          
          {/* Hover state ring */}
          {cursorVariant === 'hover' && (
            <div 
              className="absolute inset-0 rounded-full border border-black/30 animate-pulse"
              style={{ animationDuration: '1.2s' }}
            ></div>
          )}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
          <div 
            className="h-full bg-gradient-to-r from-black to-gray-600 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Enhanced background with parallax elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Parallax floating dots */}
          <div 
            className="absolute top-1/4 left-1/3 w-px h-px bg-gray-300 rounded-full opacity-60 animate-pulse" 
            style={{ 
              animationDuration: '4s',
              transform: `translateY(${scrollY * -0.1}px) translateX(${Math.sin(scrollY * 0.001) * 20}px)`
            }}
          ></div>
          <div 
            className="absolute top-2/3 right-1/4 w-px h-px bg-gray-400 rounded-full opacity-40 animate-pulse" 
            style={{ 
              animationDuration: '6s', 
              animationDelay: '1s',
              transform: `translateY(${scrollY * -0.15}px) translateX(${Math.cos(scrollY * 0.001) * 15}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/2 w-px h-px bg-gray-500 rounded-full opacity-30 animate-pulse" 
            style={{ 
              animationDuration: '5s', 
              animationDelay: '2s',
              transform: `translateY(${scrollY * -0.2}px) translateX(${Math.sin(scrollY * 0.0015) * 10}px)`
            }}
          ></div>
          
          {/* Additional floating elements */}
          <div 
            className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-gray-200 rounded-full opacity-30" 
            style={{ 
              transform: `translateY(${scrollY * -0.08}px) rotate(${scrollY * 0.1}deg)`
            }}
          ></div>
          <div 
            className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-50" 
            style={{ 
              transform: `translateY(${scrollY * -0.12}px) rotate(${scrollY * -0.1}deg)`
            }}
          ></div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50/30 pointer-events-none"></div>
        </div>

      {/* Ultra-clean Header */}
      <header className="relative z-50 border-b border-gray-50/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 group">
            <div className="w-2 h-2 bg-black rounded-full transition-all duration-500 group-hover:scale-125"></div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extralight tracking-[0.2em] text-black uppercase transition-all duration-300 group-hover:tracking-[0.25em]">
                Next Voters
              </h1>
              <p className="text-xs font-light text-gray-500 tracking-[0.3em] uppercase transition-all duration-300 group-hover:tracking-[0.35em]">
                Political Intelligence
              </p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-12">
            <Link href="/docs" className="text-gray-400 hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase hover:tracking-[0.2em] hover:scale-105">
              Documents
            </Link>
            <Link href="/app?country=USA&region=Arizona&election=Arizona+Special+Election" className="text-gray-400 hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase hover:tracking-[0.2em] hover:scale-105">
              Compare
            </Link>
            <button className="text-gray-400 hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase hover:tracking-[0.2em] hover:scale-105">
              About
            </button>
            <button className="text-gray-400 hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase hover:tracking-[0.2em] hover:scale-105">
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="relative z-10 px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Main Headline with enhanced typography */}
            <div className="mb-12 md:mb-16 relative">
              <div className="absolute -top-4 -left-4 w-2 h-2 bg-black rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] font-extralight tracking-tight leading-[0.85] text-black mb-6 md:mb-10 relative">
                <span 
                  className="inline-block transition-all duration-700 hover:tracking-wider"
                  style={{ transform: `translateY(${scrollY * -0.02}px)` }}
                >
                  Democracy
                </span>
                <br/>
                <span 
                  className="text-gray-400 transition-all duration-700 hover:text-gray-500 hover:tracking-wider inline-block"
                  style={{ transform: `translateY(${scrollY * -0.01}px)` }}
                >
                  Elevated
                </span>
              </h1>
              <div 
                className="h-px bg-gradient-to-r from-black via-gray-400 to-transparent mb-10 transition-all duration-1000"
                style={{ 
                  width: isLoaded ? '8rem' : '0rem',
                  transform: `translateX(${scrollY * 0.05}px)`
                }}
              ></div>
              <p 
                className="text-xl md:text-2xl xl:text-3xl font-extralight text-gray-600 max-w-3xl leading-[1.6] tracking-wide transition-all duration-500 hover:text-gray-700"
                style={{ transform: `translateY(${scrollY * -0.005}px)` }}
              >
                Where artificial intelligence meets political intelligence. 
                <br className="hidden md:block"/>
                <span className="inline-block transition-all duration-500 hover:tracking-wider">
                  Welcome to Next Voters — experience democracy through a new lens.
                </span>
              </p>
            </div>

            {/* Featured Document Spotlight */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-gray-100/80 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="p-4 bg-blue-100 rounded-xl shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        NEW FEATURE
                      </span>
                      <span className="text-sm text-gray-500 tracking-wider uppercase">
                        Document Analysis
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-extralight text-black mb-4 leading-tight tracking-wide">
                      Analyze the "Big Beautiful Bill"
                    </h3>
                    <p className="text-gray-600 text-lg lg:text-xl font-light leading-relaxed mb-6 max-w-2xl tracking-wide">
                      Dive deep into the comprehensive legislative package that's been making headlines. Our AI analyzes every section, provision, and implication to help you understand what it really means.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/docs"
                        className="group inline-flex items-center bg-black text-white px-8 py-4 text-lg font-light tracking-wide hover:bg-gray-900 transition-all duration-500 hover:scale-105 hover-target"
                      >
                        Explore Documents
                        <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                      <Link 
                        href="/app?country=USA&region=National&election=Presidential+Election+2024"
                        className="group inline-flex items-center border border-gray-300 text-black px-8 py-4 text-lg font-light tracking-wide hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover-target"
                      >
                        Compare Candidates
                        <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section with magnetic effects */}
            <div className="mb-16 md:mb-20">
              <Link 
                href="/app?country=USA&region=National&election=Congressional+Primary"
                className="group relative inline-flex items-center bg-black text-white px-16 py-5 text-lg font-light tracking-[0.1em] hover:bg-gray-900 transition-all duration-500 overflow-hidden hover-target"
                style={{
                  transform: mousePosition.x > 0 ? 
                    `translate(${(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${(mousePosition.y - window.innerHeight / 2) * 0.01}px)` : 
                    'translate(0, 0)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)'
                }}
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Launch Platform</span>
                <svg className="w-5 h-5 ml-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {/* Enhanced hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="relative z-10 px-8 py-40 border-t border-gray-100/60">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {/* Feature 1 - Document Analysis */}
              <div className="group cursor-default">
                <div className="mb-8 transition-all duration-700 group-hover:translate-y-[-2px]">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mb-6 group-hover:scale-[2] group-hover:bg-blue-700 transition-all duration-700"></div>
                  <h3 className="text-2xl md:text-3xl font-extralight text-black mb-6 tracking-wide group-hover:tracking-wider transition-all duration-500">
                    Document Analysis
                  </h3>
                  <p className="text-gray-600 font-extralight leading-[1.7] text-lg group-hover:text-gray-700 transition-colors duration-500">
                    Deep dive into legislative documents like the "Big Beautiful Bill" with AI-powered analysis that breaks down complex provisions into understandable insights.
                  </p>
                </div>
              </div>

              {/* Feature 2 - Candidate Comparison */}
              <div className="group cursor-default">
                <div className="mb-8 transition-all duration-700 group-hover:translate-y-[-2px]">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mb-6 group-hover:scale-[2] group-hover:bg-black transition-all duration-700"></div>
                  <h3 className="text-2xl md:text-3xl font-extralight text-black mb-6 tracking-wide group-hover:tracking-wider transition-all duration-500">
                    Candidate Comparison
                  </h3>
                  <p className="text-gray-600 font-extralight leading-[1.7] text-lg group-hover:text-gray-700 transition-colors duration-500">
                    Side-by-side analysis of candidate positions across all major policy areas, helping you understand the differences that matter most to you.
                  </p>
                </div>
              </div>

              {/* Feature 3 - Real-Time Intelligence */}
              <div className="group cursor-default">
                <div className="mb-8 transition-all duration-700 group-hover:translate-y-[-2px]">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mb-6 group-hover:scale-[2] group-hover:bg-gray-800 transition-all duration-700"></div>
                  <h3 className="text-2xl md:text-3xl font-extralight text-black mb-6 tracking-wide group-hover:tracking-wider transition-all duration-500">
                    Real-Time Intelligence
                  </h3>
                  <p className="text-gray-600 font-extralight leading-[1.7] text-lg group-hover:text-gray-700 transition-colors duration-500">
                    Lightning-fast processing delivers instant insights, keeping you ahead of the rapidly evolving political landscape with real-time updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section id="stats-section" className="relative z-10 px-8 py-40 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1500 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-center">
              <div className="group cursor-default">
                <div className="text-5xl md:text-6xl xl:text-7xl font-extralight text-black mb-4 tracking-tight group-hover:scale-105 transition-transform duration-700">
                  {counters.dataPoints}M+
                </div>
                <div className="w-8 h-px bg-gray-300 mx-auto mb-3 group-hover:w-12 group-hover:bg-black transition-all duration-500"></div>
                <div className="text-xs font-extralight text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-700 transition-colors duration-500">
                  Words Analyzed
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-5xl md:text-6xl xl:text-7xl font-extralight text-black mb-4 tracking-tight group-hover:scale-105 transition-transform duration-700">
                  {counters.topics}+
                </div>
                <div className="w-8 h-px bg-gray-300 mx-auto mb-3 group-hover:w-12 group-hover:bg-black transition-all duration-500"></div>
                <div className="text-xs font-extralight text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-700 transition-colors duration-500">
                  Policy Topics
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-5xl md:text-6xl xl:text-7xl font-extralight text-black mb-4 tracking-tight group-hover:scale-105 transition-transform duration-700">
                  {counters.realTime}s
                </div>
                <div className="w-8 h-px bg-gray-300 mx-auto mb-3 group-hover:w-12 group-hover:bg-black transition-all duration-500"></div>
                <div className="text-xs font-extralight text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-700 transition-colors duration-500">
                  Avg Response Time
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-5xl md:text-6xl xl:text-7xl font-extralight text-black mb-4 tracking-tight group-hover:scale-105 transition-transform duration-700">
                  {counters.monitoring}/7
                </div>
                <div className="w-8 h-px bg-gray-300 mx-auto mb-3 group-hover:w-12 group-hover:bg-black transition-all duration-500"></div>
                <div className="text-xs font-extralight text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-700 transition-colors duration-500">
                  Intelligence Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 py-48">
        <div className="max-w-5xl mx-auto text-center">
          <div className={`transition-all duration-1500 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-6xl md:text-8xl xl:text-9xl font-extralight text-black mb-12 tracking-tight leading-[0.9]">
              The Future of
              <br/>
              <span className="text-gray-400 transition-colors duration-700 hover:text-gray-500">Political Intelligence</span>
            </h2>
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-black to-transparent mx-auto mb-16"></div>
            <p className="text-xl md:text-2xl xl:text-3xl font-extralight text-gray-600 mb-20 max-w-4xl mx-auto leading-[1.6] tracking-wide">
              Join the revolution in democratic engagement. Experience intelligence that adapts, learns, and evolves with the political landscape.
            </p>
            <Link 
              href="/app"
              className="group relative inline-flex items-center bg-black text-white px-20 py-6 text-xl font-extralight tracking-[0.15em] hover:bg-gray-900 transition-all duration-700 overflow-hidden"
            >
              <span className="relative z-10 transition-all duration-500 group-hover:tracking-[0.2em]">Begin Your Journey</span>
              <svg className="w-6 h-6 ml-6 group-hover:translate-x-3 transition-transform duration-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {/* Advanced hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Ultra-minimal Footer */}
      <footer className="relative z-10 border-t border-gray-100/60 px-8 py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="text-sm font-extralight text-gray-400 tracking-[0.2em] uppercase">
              © 2024 Political Intelligence
            </div>
          </div>
          <div className="flex space-x-12">
            <button className="text-sm font-extralight text-gray-400 hover:text-black transition-all duration-500 tracking-[0.15em] uppercase hover:tracking-[0.2em] hover:scale-105">
              Privacy
            </button>
            <button className="text-sm font-extralight text-gray-400 hover:text-black transition-all duration-500 tracking-[0.15em] uppercase hover:tracking-[0.2em] hover:scale-105">
              Terms
            </button>
            <button className="text-sm font-extralight text-gray-400 hover:text-black transition-all duration-500 tracking-[0.15em] uppercase hover:tracking-[0.2em] hover:scale-105">
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      {scrollProgress > 20 && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4">
          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group w-14 h-14 bg-black/90 backdrop-blur-sm text-white rounded-full hover:bg-black hover:scale-110 transition-all duration-500 flex items-center justify-center shadow-lg hover:shadow-2xl"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          
          {/* Social Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Next Voters - Political Intelligence',
                  text: 'Experience democracy through artificial intelligence',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="group w-14 h-14 bg-white/90 backdrop-blur-sm text-black rounded-full hover:bg-white hover:scale-110 transition-all duration-500 flex items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200/50"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      )}
    </div>
    </>
  );
}  
