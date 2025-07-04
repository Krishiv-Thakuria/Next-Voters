'use client';

import React, { useState, FormEvent, useEffect, useRef, UIEvent } from 'react';
import { useChat, Message } from 'ai/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, ChevronDown, FileText, ArrowLeft, Shield, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Turnstile from '@/components/Turnstile';

interface DocumentConfig {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: string;
}

interface QAPair {
  id: string;
  question: string;
  response: string;
  timestamp: number;
}

export default function DocsPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentResponseRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Document management
  const [availableDocuments, setAvailableDocuments] = useState<DocumentConfig[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentConfig | null>(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  // Q&A management
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const currentQuestionRef = useRef<string>('');

  // Load available documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        if (data.success) {
          setAvailableDocuments(data.documents);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/docs',
    body: {
      documentId: selectedDocument?.id || '',
      
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
        setQAPairs(prev => [newQAPair, ...prev]);
        setCurrentQuestion('');
        currentQuestionRef.current = '';
        setMessages([]);
      }
    },
    onError: (err) => {
      console.error("Docs chat error:", err);
      setCurrentQuestion('');
      currentQuestionRef.current = '';
    },
    initialMessages: [],
  });

  // Handle question submission
  const handleQuestionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedDocument) return;
    
    
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
    
    setCurrentQuestion(newQuestion);
    currentQuestionRef.current = newQuestion;
    setUserHasScrolled(false);
    setMessages([]);
    
    handleSubmit(e);
  };

  // Handle document selection
  const handleDocumentSelect = (document: DocumentConfig) => {
    setSelectedDocument(document);
    setQAPairs([]); // Clear previous Q&A when switching documents
    setCurrentQuestion('');
    currentQuestionRef.current = '';
    setMessages([]);
  };

  // Go back to document selection
  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    setQAPairs([]);
    setCurrentQuestion('');
    currentQuestionRef.current = '';
    setMessages([]);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
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
  const latestAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
  const currentResponse = latestAssistantMessage?.content || '';

  // Turnstile handlers
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

  // Document Selection View
  if (!selectedDocument) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="bg-background p-3 md:p-4 sticky top-0 z-20 fade-edge-to-bottom border-b border-border">
          <div className="container mx-auto flex items-center justify-between max-w-5xl">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Document Analysis</h1>
                <p className="text-sm text-muted-foreground">Select a document to analyze</p>
              </div>
            </div>
          </div>
        </header>

        {/* Document Selection */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose a Document</h2>
              <p className="text-muted-foreground text-lg">
                Select a document below to start asking questions and diving deep into its content.
              </p>
            </div>

            {isLoadingDocuments ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading available documents...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDocuments.map((document) => (
                  <Card 
                    key={document.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border"
                    onClick={() => handleDocumentSelect(document)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">
                            {document.name}
                          </CardTitle>
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">
                            {document.category}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm line-clamp-3">
                        {document.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {document.filename}
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          Analyze →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoadingDocuments && availableDocuments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No documents are currently available for analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Document Analysis View
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-background p-3 md:p-4 sticky top-0 z-20 fade-edge-to-bottom border-b border-border">
        <div className="container mx-auto flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToDocuments}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{selectedDocument.name}</h1>
              <p className="text-sm text-muted-foreground">{selectedDocument.category}</p>
            </div>
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
              <Card className="bg-card border-border rounded-lg shadow-sm">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className="text-blue-600 text-md">Document Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-sm text-card-foreground whitespace-pre-line min-h-[100px]">
                    {isLoading && !currentResponse && (
                      <p className="opacity-50 animate-pulse flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Analyzing document (~1000 pages)… this may take a few seconds
                      </p>
                    )}
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {currentResponse || (!isLoading && !error ? "Waiting for response..." : "")}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Previous Q&A Pairs */}
          {qaPairs.map((qaPair) => (
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
              <Card className="bg-card/50 border-border rounded-lg shadow-sm">
                <CardHeader className="border-b border-border p-3">
                  <CardTitle className="text-blue-500 text-sm">Document Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs text-card-foreground whitespace-pre-line">
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                      {qaPair.response}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Empty State */}
          {!currentQuestion && qaPairs.length === 0 && (
            <div className="flex-grow flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg opacity-50 mb-2">
                  Ask your first question about "{selectedDocument.name}"
                </p>
                <p className="text-sm text-muted-foreground opacity-30">
                  Try asking about key provisions, implications, or specific sections
                </p>
              </div>
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
            placeholder={`Ask a question about "${selectedDocument.name}"...`}
            className="flex-grow bg-transparent border-none text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none shadow-none"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Analyzing: {selectedDocument.filename}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
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
