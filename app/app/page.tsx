'use client';

import React, { useState, FormEvent, useEffect, useRef, UIEvent } from 'react';
import { useChat, Message } from 'ai/react';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PromptInputWithActions } from '@/components/prompt-input-with-actions';
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
import { LoadingIndicator } from '@/components/loading-indicator';
import { StreamingResponse } from '@/components/streaming-response';
import { PromptSuggestion } from '../../components/prompt-kit/prompt-suggestion';

const CANDIDATE_SEPARATOR = "\n\n---\n\n"; // Updated to match backend separator

const countryData: Record<string, string[]> = {
  USA: ['N/A', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  Canada: ['N/A', 'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
};

// Updated election options based on country
const electionOptions: Record<string, string[]> = {
  USA: [
    'Presidential Election 2024',
    'Arizona Special Election',
    'Virginia Gubernatorial Election 2025',
    'New Jersey General Assembly Election 2025',
    'Congressional Primary',
    'Midterm Elections',
    'General Election'
  ],
  Canada: [
    'Federal Election 2025',
    'General Election',
    'Provincial Election'
  ],
};

export default function ChatMainPage() {
  // Force a re-compile to fix stale server state
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [country, setCountry] = useState('USA');
  const [region, setRegion] = useState('Arizona');
  const [availableRegions, setAvailableRegions] = useState<string[]>(countryData.USA);
  const [selectedElection, setSelectedElection] = useState('Arizona Special Election');
  const [availableElections, setAvailableElections] = useState<string[]>(electionOptions.USA);

  const [candidate1Response, setCandidate1Response] = useState('');
  const [candidate2Response, setCandidate2Response] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<Message | null>(null);

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [],
    id: uuidv4(),
    body: {
      country,
      region,
      election: selectedElection,
    },
    onResponse: () => setIsStreaming(true),
    onFinish: (message) => {
      setIsStreaming(false);
      setAssistantMessage(message);
    },
    onError: (err) => {
      console.error(err);
      setIsStreaming(false);
    },
  });

  const latestUserMessage = messages.filter((m) => m.role === 'user').pop();

  const handleCountryChange = (newCountry: string) => {
    if (newCountry === country) return;

    const newRegions = countryData[newCountry] || [];
    const newElections = electionOptions[newCountry] || [];

    setCountry(newCountry);
    setAvailableRegions(newRegions);
    setAvailableElections(newElections);
    setRegion(newRegions[0] || '');
    setSelectedElection(newElections[0] || '');
  };

  const handleRegionChange = (selectedRegionValue: string) => {
    setRegion(selectedRegionValue);
  };

  const handleElectionChange = (value: string) => {
    setSelectedElection(value);
  };

  const getCandidateLabels = () => {
    if (selectedElection.includes('Presidential')) {
      return { candidate1Label: 'Joe Biden', candidate2Label: 'Donald Trump' };
    }
    return { candidate1Label: 'Candidate 1', candidate2Label: 'Candidate 2' };
  };

  const { candidate1Label, candidate2Label } = getCandidateLabels();

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableView) {
        scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior });
      }
    }
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 2;
    if (showScrollButton === isAtBottom) {
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    const countryParam = searchParams.get('country');
    const regionParam = searchParams.get('region');
    const electionParam = searchParams.get('election');

    if (countryParam && countryData[countryParam]) {
      const initialRegions = countryData[countryParam] || [];
      const initialElections = electionOptions[countryParam] || [];

      setCountry(countryParam);
      setAvailableRegions(initialRegions);
      setAvailableElections(initialElections);
      setRegion(regionParam && initialRegions.includes(regionParam) ? regionParam : initialRegions[0] || '');
      setSelectedElection(electionParam && initialElections.includes(electionParam) ? electionParam : initialElections[0] || '');
    }
  }, [searchParams]);

  useEffect(() => {
    if (assistantMessage) {
      const parts = assistantMessage.content.split(CANDIDATE_SEPARATOR);
      setCandidate1Response(parts[0] || '');
      setCandidate2Response(parts[1] || '');
    }
  }, [assistantMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom('auto');
    }
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-background border-b border-border p-3 md:p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">NextVoters</h1>
        </div>
      </header>



      <ScrollArea className="flex-grow" ref={scrollAreaRef} onScroll={handleScroll}>
        { !latestUserMessage && !isLoading ? (
           <div className="flex h-full items-center justify-center">
              <p className="font-mono text-lg text-gray-500">Ask your first question to begin.</p>
          </div>: (
          <div className="container mx-auto flex flex-col gap-4 p-3 md:p-4">
            {latestUserMessage && (
              <div className="flex justify-end w-full">
                <div className="bg-[#F4F4F4] text-gray-900 px-4 py-2 rounded-full max-w-xs sm:max-w-sm md:max-w-md">
                  <p className="whitespace-pre-line">{latestUserMessage.content}</p>
                </div>
              </div>
            )}

            {(isLoading || assistantMessage) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <div className="bg-[#F4F4F4] rounded-3xl p-4 flex flex-col">
                  <h3 className="text-blue-600 font-semibold mb-2 text-md">{candidate1Label}</h3>
                  <div className="text-gray-900 leading-relaxed flex-grow overflow-y-auto">
                    {isLoading && !assistantMessage ? <LoadingIndicator /> : <StreamingResponse text={candidate1Response} />}
                  </div>
                </div>

                <div className="bg-[#F4F4F4] rounded-3xl p-4 flex flex-col">
                  <h3 className="text-purple-600 font-semibold mb-2 text-md">{candidate2Label}</h3>
                  <div className="text-gray-900 leading-relaxed flex-grow overflow-y-auto">
                    {isLoading && !assistantMessage ? <LoadingIndicator /> : <StreamingResponse text={candidate2Response} />}
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-destructive text-center py-2">Error: {error.message}</p>}
            <div ref={messagesEndRef} />
          </div>
        )}
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

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          <PromptSuggestion
            className="px-4 py-2"
            onClick={() => setInput("What are the stances on taxation?")}
          >
            Taxes
          </PromptSuggestion>
          <PromptSuggestion
            className="px-4 py-2"
            onClick={() => setInput("What are the positions on climate change?")}
          >
            Climate Change
          </PromptSuggestion>
          <PromptSuggestion
            className="px-4 py-2"
            onClick={() => setInput("What are the views on healthcare reform?")}
          >
            Healthcare
          </PromptSuggestion>
          <PromptSuggestion
            className="px-4 py-2"
            onClick={() => setInput("What are the policies on immigration?")}
          >
            Immigration
          </PromptSuggestion>
          <PromptSuggestion
            className="px-4 py-2"
            onClick={() => setInput("What is the approach to education funding?")}
          >
            Education
          </PromptSuggestion>
        </div>
      </div>

      <footer className="p-3 md:p-4 sticky bottom-0 z-10 footer-background-gradient">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          <PromptInputWithActions
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || !country || !region || !selectedElection}
          >
            <div className="flex items-center gap-2 shrink-0 pr-2">
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-auto h-8 rounded-full px-3 text-xs">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="z-[50]">
                  {Object.keys(countryData).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleRegionChange} value={region} disabled={!country || availableRegions.length === 0}>
                <SelectTrigger className="w-auto h-8 rounded-full px-3 text-xs">
                  <SelectValue placeholder="Region/State" />
                </SelectTrigger>
                <SelectContent className="z-[50]">
                  {availableRegions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleElectionChange} value={selectedElection} disabled={!country || availableElections.length === 0}>
                <SelectTrigger className="w-auto h-8 rounded-full px-3 text-xs">
                  <SelectValue placeholder="Election" />
                </SelectTrigger>
                <SelectContent className="z-[50]">
                  {availableElections.map((election) => (
                    <SelectItem key={election} value={election}>{election}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PromptInputWithActions>
        </form>
      </footer>
    </div>
  );
}