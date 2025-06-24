'use client';

import React, { useState, FormEvent, useEffect, useRef, UIEvent } from 'react';
import { useChat, Message } from 'ai/react';
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
  // Force a re-compile to fix stale server state
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [country, setCountry] = useState<string>('USA');
  const [region, setRegion] = useState<string>('Arizona');
  const [availableRegions, setAvailableRegions] = useState<string[]>(countryData['USA'] || []);
  const [availableElections, setAvailableElections] = useState<string[]>(electionOptions['USA'] || []);
  const [selectedElection, setSelectedElection] = useState<string>('Arizona Special Election');

  const [candidate1Response, setCandidate1Response] = useState('');
  const [candidate2Response, setCandidate2Response] = useState('');

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      country: country,
      region: region,
      election: selectedElection,
    },
  });

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      const parts = lastMessage.content.split(CANDIDATE_SEPARATOR);
      setCandidate1Response(parts[0] || '');
      setCandidate2Response(parts[1] || '');
    }
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

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

  const getCandidateLabels = () => {
    if (country === 'USA' && selectedElection === 'Presidential Election 2024') {
      return { candidate1: 'Joe Biden', candidate2: 'Donald Trump' };
    }
    return { candidate1: 'Candidate 1', candidate2: 'Candidate 2' };
  };

  const { candidate1: candidate1Label, candidate2: candidate2Label } = getCandidateLabels();
  const latestUserMessage = messages.filter((m) => m.role === 'user').pop();
  const assistantMessage = messages.filter((m) => m.role === 'assistant').pop();

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
            <p className="text-muted-foreground text-lg opacity-50">Ask your first question to begin</p>
          </div>
        ) : (
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