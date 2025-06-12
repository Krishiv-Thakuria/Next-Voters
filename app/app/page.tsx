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
import { ArrowDownCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CANDIDATE_SEPARATOR = "\n\n---\n\n"; // Updated to match backend separator

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

export default function ChatMainPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  
  const [country, setCountry] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [availableElections, setAvailableElections] = useState<string[]>([]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    body: {
      location: country && region ? `${region}, ${country}` : 'Unknown Location',
      election: selectedElection || 'Not Specified',
    },
    onFinish: () => {
      // Any logic to run when streaming finishes
    },
    onError: (err) => {
      console.error("Chat error:", err);
    },
    initialMessages: [],
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom('auto');
    }
  }, [messages, showScrollButton]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

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

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-background p-3 md:p-4 sticky top-0 z-20 fade-edge-to-bottom">
        <div className="container mx-auto flex flex-col items-center max-w-5xl">
          <div className="text-sm sm:text-base text-muted-foreground text-center whitespace-nowrap">
            {(country && region) ? `${region}, ${country}` : 'Location not set'} | {selectedElection || 'Election not specified'}
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} className="flex-grow w-full max-w-5xl mx-auto">
        <div className="p-3 flex flex-col gap-4 flex-grow">

          {/* User's Question Area */}
          {latestUserMessage && (
            <div className="flex justify-end w-full">
              <div className="bg-slate-100 text-slate-800 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-none">
                <p className="whitespace-pre-line">{latestUserMessage.content}</p>
              </div>
            </div>
          )}

          {/* Candidates' Responses Area */}
          {messages.length > 0 ? (
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
              {/* Candidate 1 Column */}
              <Card className="flex flex-col bg-card border-border rounded-lg shadow-none">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className="text-blue-600 text-md">{candidate1Label}</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow p-3">
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none text-card-foreground/90 leading-relaxed">
                    {isLoading && !candidate1Response && latestUserMessage && <p className='opacity-50'>Analyzing policy documents...</p>}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{candidate1Response || (latestUserMessage && !isLoading && !error ? "Waiting for response..." : "")}</ReactMarkdown>
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* Candidate 2 Column */}
              <Card className="flex flex-col bg-card border-border rounded-lg shadow-none">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className="text-purple-600 text-md">{candidate2Label}</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow p-3">
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none text-card-foreground/90 leading-relaxed">
                    {isLoading && !candidate2Response && latestUserMessage && <p className='opacity-50'>Analyzing policy documents...</p>}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{candidate2Response || (latestUserMessage && !isLoading && !error ? "Waiting for response..." : "")}</ReactMarkdown>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center h-full">
              <p className="text-muted-foreground text-lg opacity-50">Ask your first question to begin</p>
            </div>
          )}
          {error && <p className="text-destructive text-center py-2">Error: {error.message}</p>}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          onClick={() => scrollToBottom('smooth')}
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-6 md:right-10 z-40 rounded-full h-12 w-12 bg-background/80 backdrop-blur shadow-md hover:bg-muted"
          aria-label="Scroll to bottom"
        >
          <ArrowDownCircle className="h-6 w-6 text-foreground" />
        </Button>
      )}

      {/* Chat Input Bar */}
      <footer className="bg-background p-3 md:p-4 sticky bottom-0 z-10 fade-edge-to-top">
        <form onSubmit={handleSubmit} className="container mx-auto flex flex-col gap-2 bg-card p-2 rounded-lg border border-border focus:ring-0 focus:outline-none">
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