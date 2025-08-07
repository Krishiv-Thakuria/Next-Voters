'use client';

import React, { useState, FormEvent, useEffect, useRef, UIEvent } from 'react';
import { useChat, Message } from 'ai/react';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentResponseRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  // State to track if we need to process stored data
  const [storedDataToProcess, setStoredDataToProcess] = useState<any>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    
    // Check for data from the landing page
    const storedData = sessionStorage.getItem('nextVotersData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setStoredDataToProcess(parsedData);
        // Remove after we've staged it locally to avoid duplicate sends on refresh
        sessionStorage.removeItem('nextVotersData');
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
    // Fallback: hydrate from URL params if storage missing
    if (!storedData) {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q') || '';
      const c = url.searchParams.get('country') || '';
      const r = url.searchParams.get('region') || '';
      const e = url.searchParams.get('election') || '';
      if (q || c || r || e) {
        setStoredDataToProcess({ question: q, country: c, region: r, election: e });
      }
    }
    // Mark as initialized after first mount to avoid "UI jumping" with placeholders
    setInitialized(true);
  }, []);

  const [country, setCountry] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [availableElections, setAvailableElections] = useState<string[]>([]);
  
  // Store previous Q&A pairs
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  
  // Track the question that's currently being processed
  const currentQuestionRef = useRef<string>('');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages, append } = useChat({
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

  // Set location data immediately when stored data is available
  useEffect(() => {
    if (storedDataToProcess) {
      const { question, country: storedCountry, region: storedRegion, election: storedElection } = storedDataToProcess;
      
      // Set the form data immediately for display
      setCountry(storedCountry);
      setRegion(storedRegion);
      setSelectedElection(storedElection);
      setAvailableRegions(countryData[storedCountry] || []);
      setAvailableElections(electionOptions[storedCountry] || []);
      
      // Set the question in state and ref immediately
      setCurrentQuestion(question);
      currentQuestionRef.current = question;
    }
  }, [storedDataToProcess]);

  // Process chat submission when append function is available
  useEffect(() => {
    if (storedDataToProcess && append) {
      const { question, country: storedCountry, region: storedRegion, election: storedElection } = storedDataToProcess;
      
      // Use a longer delay to ensure state updates are fully processed before API call
      setTimeout(() => {
        // Set the input field value for display
        handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
        
        // Additional delay to ensure state is committed before API call
        setTimeout(() => {
          // Directly send the message using append function - the body will use current state
          append({
            role: 'user',
            content: question
          });
        }, 100);
      }, 500);
      
      // Clear the stored data
      setStoredDataToProcess(null);
    }
  }, [storedDataToProcess, append, handleInputChange]);

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
    setRegion('');
    setSelectedElection('');
    setAvailableRegions(countryData[selectedCountryValue] || []);
    setAvailableElections(electionOptions[selectedCountryValue] || []);
  };

  const handleRegionChange = (selectedRegionValue: string) => {
    setRegion(selectedRegionValue);
  };

  const handleElectionChange = (value: string) => {
    setSelectedElection(value);
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

  // Compute header display values to avoid blanks before state hydrates
  const displayLocation = (country && region)
    ? `${region}, ${country}`
    : (storedDataToProcess?.country && storedDataToProcess?.region)
      ? `${storedDataToProcess.region}, ${storedDataToProcess.country}`
      : (initialized ? 'Location not set' : 'Loading preferences...');
  const displayElection = selectedElection
    || storedDataToProcess?.election
    || (initialized ? 'Election not specified' : '...');

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col font-poppins">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto flex flex-col items-center max-w-5xl">
          <div className="text-sm text-gray-600 text-center">{displayLocation} | {displayElection}</div>
        </div>
      </header>

      {/* Loading banner for clearer feedback while generating */}
      {isLoading && (
        <div className="bg-blue-50 text-blue-700 border-b border-blue-200 py-2 z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-sm">
            <svg className="h-4 w-4 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>Generating responses... this can take a few seconds</span>
          </div>
        </div>
      )}

      {/* Main Content Area - Scrollable */}
      <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} className="flex-grow w-full max-w-5xl mx-auto">
        <div className="p-3 flex flex-col gap-6">

          {/* Current Question and Response */}
          {currentQuestion && (
            <div className="space-y-4" ref={currentResponseRef}>
              {/* Current User Question */}
              <div className="flex justify-end w-full">
                <div className="bg-blue-500 text-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm">
                  <p className="whitespace-pre-line font-poppins">{currentQuestion}</p>
                </div>
              </div>

              {/* Current Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidate 1 Column */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardHeader className="border-b border-gray-200 p-4">
                    <CardTitle className="text-blue-600 text-lg font-semibold font-poppins">{candidate1Label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins">
                      {isLoading && !candidate1Response && (
                        <div className="flex items-center gap-2 text-blue-700">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          <span>Analyzing policy documents...</span>
                        </div>
                      )}
                      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                        {candidate1Response || (!isLoading && !error ? "Waiting for response..." : "")}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate 2 Column */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardHeader className="border-b border-gray-200 p-4">
                    <CardTitle className="text-red-600 text-lg font-semibold font-poppins">{candidate2Label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins">
                      {isLoading && !candidate2Response && (
                        <div className="flex items-center gap-2 text-red-700">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          <span>Analyzing policy documents...</span>
                        </div>
                      )}
                      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                        {candidate2Response || (!isLoading && !error ? "Waiting for response..." : "")}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Previous Q&A Pairs */}
          {qaPairs.map((qaPair, index) => {
            const parts = qaPair.response.split(CANDIDATE_SEPARATOR);
            const prevCandidate1Response = parts[0]?.trim() || '';
            const prevCandidate2Response = parts[1]?.trim() || '';

            return (
              <div key={qaPair.id} className="space-y-4 border-t border-border pt-4 opacity-75 hover:opacity-100 transition-opacity">
                {/* Previous Question */}
                <div className="flex justify-end w-full">
                  <div className="bg-slate-50 text-slate-700 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm border">
                    <p className="whitespace-pre-line text-sm">{qaPair.question}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(qaPair.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Previous Response */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Previous Candidate 1 */}
                  <Card className="bg-card/50 border-border rounded-lg shadow-sm">
                    <CardHeader className="border-b border-border p-3">
                      <CardTitle className="text-blue-500 text-sm">{candidate1Label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="text-xs text-card-foreground whitespace-pre-line">
                        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                          {prevCandidate1Response}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Previous Candidate 2 */}
                  <Card className="bg-card/50 border-border rounded-lg shadow-sm">
                    <CardHeader className="border-b border-border p-3">
                      <CardTitle className="text-purple-500 text-sm">{candidate2Label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="text-xs text-card-foreground whitespace-pre-line">
                        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                          {prevCandidate2Response}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {!currentQuestion && qaPairs.length === 0 && (
            <div className="flex-grow flex items-center justify-center h-64">
              <p className="text-muted-foreground text-lg opacity-50">Ask your first question to begin</p>
            </div>
          )}

          {error && <p className="text-destructive text-center py-2">Error: {error.message}</p>}
        </div>
      </ScrollArea>

      {/* Scroll Controls */}
      {qaPairs.length > 0 && (
        <div className="fixed bottom-24 right-6 md:right-10 z-40 flex flex-col gap-2">
          <Button
            onClick={() => scrollToTop('smooth')}
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 border border-gray-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5 text-gray-700" />
          </Button>
          
          {showScrollButton && (
            <Button
              onClick={() => scrollToBottom('smooth')}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 border border-gray-300"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-5 w-5 text-gray-700" />
            </Button>
          )}
        </div>
      )}

      {/* Chat Input Bar */}
      <footer className="bg-white p-4 sticky bottom-0 z-10 border-t border-gray-200">
        <form onSubmit={handleQuestionSubmit} className="container mx-auto flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question here... (e.g., What are the candidate's views on healthcare?)"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none shadow-none font-poppins"
            disabled={isLoading || !country || !region || !selectedElection}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {Object.keys(countryData).map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleRegionChange} value={region} disabled={!country || availableRegions.length === 0}>
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Select Region/State" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {availableRegions.map((r) => (
                    <SelectItem key={r} value={r} className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleElectionChange} value={selectedElection} disabled={!country || availableElections.length === 0}>
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Select Election" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {availableElections.map((election) => (
                    <SelectItem key={election} value={election} className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">{election}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || !country || !region || !selectedElection}
              className="p-2 aspect-square rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}