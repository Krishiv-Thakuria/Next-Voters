'use client';

import React, { useState, FormEvent, useEffect, useRef, UIEvent } from 'react';
import { useChat, Message } from 'ai/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowDownCircle, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Turnstile from '@/components/Turnstile';
import { PromptInputBasic } from '@/components/prompt-input-basic';

const CANDIDATE_SEPARATOR = "---CANDIDATE_SEPARATOR---";

const countryData: Record<string, string[]> = {
  USA: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  Canada: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
};

// Updated election options based on country
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

interface QAPair {
  id: string;
  question: string;
  response: string;
  timestamp: number;
}

export default function ChatMainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentResponseRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const [country, setCountry] = useState<string>('USA');
  const [region, setRegion] = useState<string>('Arizona');
  const [availableRegions, setAvailableRegions] = useState<string[]>(countryData['USA'] || []);
  const [selectedElection, setSelectedElection] = useState<string>('Arizona Special Election');
  const [availableElections, setAvailableElections] = useState<string[]>(electionOptions['USA'] || []);

  // Initialize state from URL parameters
  useEffect(() => {
    const urlCountry = searchParams.get('country');
    const urlRegion = searchParams.get('region');
    const urlElection = searchParams.get('election');
    
    // Set defaults if URL params are missing
    const finalCountry = urlCountry && countryData[urlCountry] ? urlCountry : 'USA';
    const finalRegion = urlRegion && countryData[finalCountry]?.includes(urlRegion) ? urlRegion : 'Arizona';
    const finalElection = urlElection && electionOptions[finalCountry]?.includes(urlElection) ? urlElection : 'Arizona Special Election';
    
    setCountry(finalCountry);
    setRegion(finalRegion);
    setSelectedElection(finalElection);
    setAvailableRegions(countryData[finalCountry] || []);
    setAvailableElections(electionOptions[finalCountry] || []);
    
    // Update URL with defaults if any were missing
    if (!urlCountry || !urlRegion || !urlElection) {
      updateURL(finalCountry, finalRegion, finalElection);
    }
  }, [searchParams]);

  // Function to update URL with current state
  const updateURL = (newCountry?: string, newRegion?: string, newElection?: string) => {
    const params = new URLSearchParams();
    
    if (newCountry || country) params.set('country', newCountry || country);
    if (newRegion || region) params.set('region', newRegion || region);
    if (newElection || selectedElection) params.set('election', newElection || selectedElection);
    
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  // Store previous Q&A pairs
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  
  // Track the question that's currently being processed
  const currentQuestionRef = useRef<string>('');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    body: {
      location: country && region ? `${region}, ${country}` : 'Unknown Location',
      election: selectedElection || 'Not Specified',
    },
    onFinish: (message) => {
      // Use the ref to get the correct question that was being processed
      const questionForThisResponse = currentQuestionRef.current;
      
      if (questionForThisResponse) {
        const newQAPair: QAPair = {
          id: Date.now().toString(),
          question: questionForThisResponse,
          response: message.content,
          timestamp: Date.now()
        };
        setQAPairs(prev => [newQAPair, ...prev]); // Add to beginning for chronological order
        setCurrentQuestion('');
        currentQuestionRef.current = ''; // Clear the ref
        
        // Clear messages to reset for next question
        setMessages([]);
      }
    },
    onError: (err) => {
      console.error("Chat error:", err);
      // Clear on error too
      setCurrentQuestion('');
      currentQuestionRef.current = '';
    },
    initialMessages: [],
  });

  // Override handleSubmit to track current question and manage history properly
  const handleQuestionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !country || !region || !selectedElection) return;
    
    const newQuestion = input.trim();
    
    // If there's already a current question with a response, move it to history first
    const latestAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (currentQuestion && latestAssistantMessage) {
      const completedQAPair: QAPair = {
        id: Date.now().toString() + '_completed',
        question: currentQuestion,
        response: latestAssistantMessage.content,
        timestamp: Date.now()
      };
      setQAPairs(prev => [completedQAPair, ...prev]);
    }
    
    // Set the new question in both state and ref
    setCurrentQuestion(newQuestion);
    currentQuestionRef.current = newQuestion; // Store in ref for onFinish callback
    setUserHasScrolled(false); // Reset scroll tracking for new question
    setMessages([]); // Clear previous messages before starting new chat
    
    // Submit the new question
    handleSubmit(e);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // Track if user has manually scrolled
    if (Math.abs(scrollTop - lastScrollPosition) > 10) {
      setUserHasScrolled(true);
    }
    setLastScrollPosition(scrollTop);
    
    setShowScrollButton(!isAtBottom && qaPairs.length > 0);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior
        });
      }
    }
    setUserHasScrolled(false);
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
          behavior
        });
      }
    }
  };

  // Get current response data
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  const latestAssistantMessage = messages.filter(m => m.role === 'assistant').pop();

  let candidate1Response = '';
  let candidate2Response = '';

  if (latestAssistantMessage) {
    const parts = latestAssistantMessage.content.split(CANDIDATE_SEPARATOR);
    candidate1Response = parts[0]?.trim() || '';
    candidate2Response = parts[1]?.trim() || '';
  }

  const handleCountryChange = (selectedCountryValue: string) => {
    setCountry(selectedCountryValue);
    setAvailableRegions(countryData[selectedCountryValue] || []);
    setAvailableElections(electionOptions[selectedCountryValue] || []);
    setRegion('');
    setSelectedElection('');
    updateURL(selectedCountryValue, '', '');
  };

  const handleRegionChange = (selectedRegionValue: string) => {
    setRegion(selectedRegionValue);
    updateURL(undefined, selectedRegionValue, undefined);
  };

  const handleElectionChange = (value: string) => {
    setSelectedElection(value);
    updateURL(undefined, undefined, value);
  };

  // Determine candidate labels based on country and election
  const getCandidateLabels = () => {
    if (country === 'USA') {
      return ['DEMOCRATIC CANDIDATE', 'REPUBLICAN CANDIDATE'];
    } else if (country === 'Canada') {
      return ['LIBERAL CANDIDATE', 'CONSERVATIVE CANDIDATE'];
    }
    return ['CANDIDATE ONE', 'CANDIDATE TWO'];
  };

  const [candidate1Label, candidate2Label] = getCandidateLabels();

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-4xl font-bold" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-3xl font-semibold" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h2 className="text-2xl font-semibold" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a
        className="text-blue-500 hover:underline dark:text-blue-300"
        {...props}
      />
    ),
    table: ({ node, ...props }) => (
      <table
        className="table-auto border-collapse border border-gray-300 dark:border-gray-700 w-full my-4 bg-white text-black dark:bg-black dark:text-white"
        {...props}
      />
    ),
    thead: ({ node, ...props }) => (
      <thead
        className="bg-white text-black dark:bg-black dark:text-white"
        {...props}
      />
    ),
    th: ({ node, ...props }) => (
      <th
        className="px-4 border border-gray-300 dark:border-gray-700"
        {...props}
      />
    ),
    tr: ({ node, ...props }) => (
      <tr
        className="border border-gray-300 dark:border-gray-700"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        className="px-4 border border-gray-300 dark:border-gray-700"
        {...props}
      />
    ),
    ol: ({ node, ...props }) => (
      <ol
        style={{ listStyleType: "lower-alpha" }}
        className="pl-6"
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6" {...props} />
    ),
    li: ({ node, ...props }) => <li className="" {...props} />,
    p: ({ node, ...props }) => <p className="" {...props} />,
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* SVG Background Pattern */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 0 }}
      >
        <defs>
          <pattern id="backgroundPattern" x="0" y="0" width="100%" height="100%">
            {/* Diagonal lines making an X */}
            <line 
              x1="0" y1="0" 
              x2="100%" y2="100%" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
            <line 
              x1="100%" y1="0" 
              x2="0" y2="100%" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
            
            {/* Vertical line through center */}
            <line 
              x1="50%" y1="0" 
              x2="50%" y2="100%" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
            
            {/* Horizontal line through center */}
            <line 
              x1="0" y1="50%" 
              x2="100%" y2="50%" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
            
            {/* Smaller concentric circle */}
            <circle 
              cx="50%" cy="50%" 
              r="15%" 
              fill="none" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
            
            {/* Larger concentric circle */}
            <circle 
              cx="50%" cy="50%" 
              r="35%" 
              fill="none" 
              stroke="#EEEEEE" 
              strokeWidth="1" 
              opacity="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#backgroundPattern)" />
      </svg>

      <div className="relative z-10 h-full flex flex-col">
        {/* Show centered input only if no messages exist */}
        {qaPairs.length === 0 && !currentQuestion && (
          <div className="flex-grow flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">NextVoters</h1>
                <p className="text-muted-foreground text-sm">Ask questions about candidates and elections</p>
              </div>
              
              <PromptInputBasic
                key="centered-input"
                value={input}
                onChange={handleInputChange}
                onSubmit={handleQuestionSubmit}
                isLoading={isLoading}
                placeholder="Ask your voting question here... (e.g., What are the candidate's views on healthcare?)"
                disabled={false}
                country={country}
                region={region}
                election={selectedElection}
                availableRegions={availableRegions}
                availableElections={availableElections}
                countryData={countryData}
                electionOptions={electionOptions}
                onCountryChange={handleCountryChange}
                onRegionChange={handleRegionChange}
                onElectionChange={handleElectionChange}
              />
              
              {(country && region && selectedElection) && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Asking about: <span className="font-medium">{selectedElection}</span> in <span className="font-medium">{region}, {country}</span></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat UI - shown after first message */}
        {(qaPairs.length > 0 || currentQuestion) && (
          <>
            {/* Header with title and context */}
            <div className="border-b border-border p-4 bg-background/95 backdrop-blur">
              <h1 className="text-xl font-bold text-foreground">NextVoters</h1>
              <p className="text-sm text-muted-foreground">
                {country && region && selectedElection ? 
                  `${selectedElection} in ${region}, ${country}` : 
                  'Ask questions about candidates and elections'
                }
              </p>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} className="flex-grow p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Current Question and Response */}
                {currentQuestion && (
                  <div className="space-y-4" ref={currentResponseRef}>
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md">
                        <p className="whitespace-pre-line">{currentQuestion}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-muted p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-lg">
                        {isLoading && !messages.find(m => m.role === 'assistant') && (
                          <p className="text-muted-foreground italic">Analyzing policy documents...</p>
                        )}
                        {messages.filter(m => m.role === 'assistant').map((message, index) => (
                          <div key={index} className="prose prose-sm max-w-none">
                            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Previous Q&A Pairs */}
                {qaPairs.map((qa) => (
                  <div key={qa.id} className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-primary/80 text-primary-foreground p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md">
                        <p className="whitespace-pre-line text-sm">{qa.question}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {new Date(qa.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-muted/80 p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-lg">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                            {qa.response}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Fixed Input at Bottom - Floating */}
            <div className="p-4">
              <div className="max-w-4xl mx-auto">
                <PromptInputBasic
                  key="chat-input"
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleQuestionSubmit}
                  isLoading={isLoading}
                  placeholder="Ask another question..."
                  disabled={false}
                  country={country}
                  region={region}
                  election={selectedElection}
                  availableRegions={availableRegions}
                  availableElections={availableElections}
                  countryData={countryData}
                  electionOptions={electionOptions}
                  onCountryChange={handleCountryChange}
                  onRegionChange={handleRegionChange}
                  onElectionChange={handleElectionChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}