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
import { ArrowDownCircle, ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  useEffect(() => {
    document.documentElement.classList.remove('dark');
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

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-background p-3 md:p-4 sticky top-0 z-20 fade-edge-to-bottom border-b border-border">
        <div className="container mx-auto flex flex-col items-center max-w-5xl">
          <div className="text-sm sm:text-base text-muted-foreground text-center whitespace-nowrap">
            {(country && region) ? `${region}, ${country}` : 'Location not set'} | {selectedElection || 'Election not specified'}
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} className="flex-grow w-full max-w-5xl mx-auto">
        <div className="p-3 flex flex-col gap-6">

          {/* Current Question and Response */}
          {currentQuestion && (
            <div className="space-y-4" ref={currentResponseRef}>
              {/* Current User Question */}
              <div className="flex justify-end w-full">
                <div className="bg-slate-100 text-slate-800 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm">
                  <p className="whitespace-pre-line">{currentQuestion}</p>
                </div>
              </div>

              {/* Current Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Candidate 1 Column */}
                <Card className="bg-card border-border rounded-lg shadow-sm">
                  <CardHeader className="border-b border-border p-3">
                    <CardTitle className="text-blue-600 text-md">{candidate1Label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="text-sm text-card-foreground whitespace-pre-line min-h-[100px]">
                      {isLoading && !candidate1Response && <p className='opacity-50'>Analyzing policy documents...</p>}
                      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                        {candidate1Response || (!isLoading && !error ? "Waiting for response..." : "")}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate 2 Column */}
                <Card className="bg-card border-border rounded-lg shadow-sm">
                  <CardHeader className="border-b border-border p-3">
                    <CardTitle className="text-purple-600 text-md">{candidate2Label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="text-sm text-card-foreground whitespace-pre-line min-h-[100px]">
                      {isLoading && !candidate2Response && <p className='opacity-50'>Analyzing policy documents...</p>}
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
            className="rounded-full h-10 w-10 bg-background/80 backdrop-blur shadow-md hover:bg-muted"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5 text-foreground" />
          </Button>
          
          {showScrollButton && (
            <Button
              onClick={() => scrollToBottom('smooth')}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-background/80 backdrop-blur shadow-md hover:bg-muted"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-5 w-5 text-foreground" />
            </Button>
          )}
        </div>
      )}

      {/* Chat Input Bar */}
      <footer className="bg-background p-3 md:p-4 sticky bottom-0 z-10 fade-edge-to-top border-t border-border">
        <form onSubmit={handleQuestionSubmit} className="container mx-auto flex flex-col gap-2 bg-card p-2 rounded-lg border border-border focus:ring-0 focus:outline-none">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question here... (e.g., What are the candidate's views on healthcare?)"
            className="flex-grow bg-transparent border-none text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none shadow-none"
            disabled={isLoading || !country || !region || !selectedElection}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-auto md:w-[150px] bg-card border-border text-card-foreground focus:ring-ring focus:border-primary text-xs md:text-sm p-2 h-9 md:h-10">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border z-[50]">
                  {Object.keys(countryData).map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-accent focus:bg-accent">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleRegionChange} value={region} disabled={!country || availableRegions.length === 0}>
                <SelectTrigger className="w-full md:w-[180px] shadow-none focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Select Region/State" />
                </SelectTrigger>
                <SelectContent className="z-[50]">
                  {availableRegions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleElectionChange} value={selectedElection} disabled={!country || availableElections.length === 0}>
                <SelectTrigger className="w-full md:w-[180px] shadow-none focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Select Election" />
                </SelectTrigger>
                <SelectContent className="z-[50]">
                  {availableElections.map((election) => (
                    <SelectItem key={election} value={election}>{election}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || !country || !region || !selectedElection}
              className="p-2 aspect-square rounded-full shadow-none"
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