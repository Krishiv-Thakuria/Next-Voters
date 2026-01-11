'use client';

import React from 'react';
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

const countryData = {
  USA: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  Canada: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
};

const electionOptions = {
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

const politicalPerspectives = {
  USA: {
    perspective1: { name: 'DEMOCRATIC PERSPECTIVE', color: 'blue' },
    perspective2: { name: 'REPUBLICAN PERSPECTIVE', color: 'red' }
  },
  Canada: {
    perspective1: { name: 'LIBERAL PERSPECTIVE', color: 'red' },
    perspective2: { name: 'CONSERVATIVE PERSPECTIVE', color: 'blue' }
  }
};

const mockResponses = {
  "What are the candidates' positions on healthcare reform?": {
    USA: {
      democratic: `Our healthcare plan focuses on expanding access to affordable care for all Americans. We propose:

• **Universal Coverage**: Ensuring every American has access to quality healthcare
• **Lower Prescription Costs**: Negotiating drug prices to reduce costs for families
• **Mental Health Support**: Expanding mental health services and coverage
• **Preventive Care**: Investing in preventive care to reduce long-term costs

We believe healthcare is a fundamental right, not a privilege.`,
      republican: `Our healthcare approach emphasizes choice, competition, and free market solutions:

• **Market-Based Solutions**: Increasing competition to lower costs naturally
• **Health Savings Accounts**: Expanding HSAs to give families more control
• **Reduce Regulations**: Eliminating barriers that increase healthcare costs
• **State Flexibility**: Allowing states to tailor solutions to their needs

We believe in empowering individuals to make their own healthcare decisions.`
    }
  },
  "How do the candidates plan to address climate change?": {
    USA: {
      democratic: `Climate change requires immediate action through green energy investments, stricter emissions standards, and rejoining international climate agreements. We'll create millions of clean energy jobs while protecting our environment for future generations.`,
      republican: `We support an all-of-the-above energy strategy that includes clean coal, natural gas, and renewable sources. Innovation and technology, not government mandates, will drive environmental progress while maintaining energy independence and jobs.`
    }
  },
  "What are their positions on immigration policy?": {
    USA: {
      democratic: `We need comprehensive immigration reform that provides a pathway to citizenship for undocumented immigrants, protects DACA recipients, and treats asylum seekers with dignity. America's strength comes from our diversity and welcoming spirit.`,
      republican: `We must secure our borders first, enforce existing immigration laws, and implement merit-based immigration that prioritizes skills and legal entry. Strong borders ensure national security and protect American workers.`
    }
  },
  "How will they handle the economy and inflation?": {
    USA: {
      democratic: `We'll tackle inflation by investing in domestic manufacturing, supporting working families with child tax credits, and ensuring corporations pay their fair share. Our focus is on building an economy that works for everyone, not just the wealthy.`,
      republican: `We'll fight inflation by reducing government spending, cutting regulations on businesses, and unleashing American energy production. Lower taxes and smaller government will restore economic growth and put money back in your pocket.`
    }
  }
};

export default function ChatMainPage() {
  const currentCountry = 'USA';
  const perspectives = politicalPerspectives[currentCountry];
  
  const currentQuestion = "What are the candidates' positions on healthcare reform?";
  const previousQuestion = "How do the candidates plan to address climate change?";
  const inputQuestion = "What are their positions on immigration policy?";

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
    <div className="h-screen bg-white text-gray-900 flex flex-col font-plus-jakarta-sans">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto flex flex-col items-center max-w-5xl">
          <div className="text-sm text-gray-600 text-center">California, USA | Presidential Election 2024</div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <ScrollArea className="flex-grow w-full max-w-5xl mx-auto">
        <div className="p-3 flex flex-col gap-6">

          {/* Current Question and Response */}
          <div className="space-y-4">
            {/* Current User Question */}
            <div className="flex justify-end w-full">
              <div className="bg-blue-500 text-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm">
                <p className="whitespace-pre-line font-plus-jakarta-sans">{currentQuestion}</p>
              </div>
            </div>

            {/* Current Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Perspective 1 Column */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-4">
                  <CardTitle className={`text-${perspectives.perspective1.color}-600 text-lg font-semibold font-plus-jakarta-sans`}>{perspectives.perspective1.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-plus-jakarta-sans">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {mockResponses[currentQuestion][currentCountry].democratic}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Perspective 2 Column */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-4">
                  <CardTitle className={`text-${perspectives.perspective2.color}-600 text-lg font-semibold font-plus-jakarta-sans`}>{perspectives.perspective2.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-plus-jakarta-sans">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {mockResponses[currentQuestion][currentCountry].republican}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Previous Q&A Pair */}
          <div className="space-y-4 border-t border-border pt-4 opacity-75 hover:opacity-100 transition-opacity">
            {/* Previous Question */}
            <div className="flex justify-end w-full">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm border">
                <p className="whitespace-pre-line text-sm">{previousQuestion}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  2:34 PM
                </div>
              </div>
            </div>

            {/* Previous Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Perspective 1 */}
              <Card className="bg-card/50 border-border rounded-lg shadow-sm">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className={`text-${perspectives.perspective1.color}-500 text-sm`}>{perspectives.perspective1.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs text-card-foreground whitespace-pre-line">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {mockResponses[previousQuestion][currentCountry].democratic}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Perspective 2 */}
              <Card className="bg-card/50 border-border rounded-lg shadow-sm">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className={`text-${perspectives.perspective2.color}-500 text-sm`}>{perspectives.perspective2.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs text-card-foreground whitespace-pre-line">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {mockResponses[previousQuestion][currentCountry].republican}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Chat Input Bar */}
      <footer className="bg-white p-4 sticky bottom-0 z-10 border-t border-gray-200">
        <form className="container mx-auto flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Input
            value={inputQuestion}
            placeholder="Type your question here... (e.g., What are the candidate's views on healthcare?)"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none shadow-none font-plus-jakarta-sans"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select value="USA">
                <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-plus-jakarta-sans">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {Object.keys(countryData).map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value="California">
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-plus-jakarta-sans">
                  <SelectValue placeholder="Select Region/State" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {countryData.USA.map((r) => (
                    <SelectItem key={r} value={r} className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value="Presidential Election 2024">
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-plus-jakarta-sans">
                  <SelectValue placeholder="Select Election" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  {electionOptions.USA.map((election) => (
                    <SelectItem key={election} value={election} className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans">{election}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
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