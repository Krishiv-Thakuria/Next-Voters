'use client'
import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check if error is rate limit related
  const isRateLimitError = (errorMsg: string) => {
    return (
      errorMsg.toLowerCase().includes('rate limit') ||
      errorMsg.toLowerCase().includes('too many requests') ||
      errorMsg.toLowerCase().includes('tokens per minute')
    );
  };

  const {
    messages: conservativeMessages,
    input: conservativeInput,
    handleInputChange: handleConservativeInputChange,
    handleSubmit: handleConservativeSubmit,
    isLoading: conservativeLoading,
    error: conservativeError
  } = useChat({ 
    api: 'api/conservative',
    onError: (error) => {
      console.error('Conservative API error:', error);
      const errorMsg = error.message || 'Error fetching Conservative response';
      
      if (isRateLimitError(errorMsg)) {
        setError("Sorry, we're getting a ton of traffic right now - check back in a minute to try again!");
      } else {
        setError(errorMsg);
      }
    }
  });

  const {
    messages: liberalMessages,
    input: liberalInput,
    handleInputChange: handleLiberalInputChange,
    handleSubmit: handleLiberalSubmit,
    isLoading: liberalLoading,
    error: liberalError
  } = useChat({ 
    api: 'api/liberal',
    onError: (error) => {
      console.error('Liberal API error:', error);
      const errorMsg = error.message || 'Error fetching Liberal response';
      
      if (isRateLimitError(errorMsg)) {
        setError("Sorry, we're getting a ton of traffic right now - check back in a minute to try again!");
      } else {
        setError(errorMsg);
      }
    }
  });

  // Extract last assistant responses
  const lastConservative = [...conservativeMessages].reverse().find(m => m.role === 'assistant')?.content;
  const lastLiberal = [...liberalMessages].reverse().find(m => m.role === 'assistant')?.content;

  const askTheAlmighty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Clear any previous errors
    setError(null);
    
    // Only submit if there's input and not already loading
    if (!conservativeInput.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Trigger both chat submissions
      // Ensure input is set in hooks first
      handleConservativeInputChange({ target: { value: conservativeInput } } as React.ChangeEvent<HTMLInputElement>);
      handleLiberalInputChange({ target: { value: conservativeInput } } as React.ChangeEvent<HTMLInputElement>);
      
      // Submit both requests
      await Promise.all([
        handleConservativeSubmit(event),
        handleLiberalSubmit(event)
      ]);

      // Clear inputs after submitting
      handleConservativeInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      handleLiberalInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    } catch (err) {
      console.error('Error submitting chats:', err);
      setError(err instanceof Error ? err.message : 'Failed to get responses');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Next Voters</h1>
        <p className="text-gray-600">Compare policy viewpoints across Canada's major political parties</p>
      </header>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg mx-auto max-w-xl text-center">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        <div className="w-full md:w-[30%] flex flex-col">
          <div className="border-b-2 border-blue-600 pb-2 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-blue-600">Conservative Party</h2>
            <p className="text-xs text-blue-600 opacity-75">Based on official 2025 party platform</p>
          </div>
          <div className="flex-1 bg-blue-50 p-5 rounded-lg shadow-md overflow-y-auto h-64 md:h-96 border-2 border-blue-200 relative">
            {conservativeLoading && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center">
                <div className="animate-pulse text-blue-600">Loading...</div>
              </div>
            )}
            <div className="text-blue-800">
              {lastConservative ? (
                <MarkdownRenderer content={lastConservative} />
              ) : (
                "The Conservative perspective will appear here..."
              )}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-center justify-center">
          <p className="text-gray-700 font-medium">NextVoters.com</p>
          <p className="text-gray-600 text-sm">See the true policies</p>
        </div>
        
        <div className="w-full md:w-[30%] flex flex-col">
          <div className="border-b-2 border-red-600 pb-2 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-red-600">Liberal Party</h2>
            <p className="text-xs text-red-600 opacity-75">Based on official 2025 party platform</p>
          </div>
          <div className="flex-1 bg-red-50 p-5 rounded-lg shadow-md overflow-y-auto h-64 md:h-96 border-2 border-red-200 relative">
            {liberalLoading && (
              <div className="absolute inset-0 bg-red-50 bg-opacity-50 flex items-center justify-center">
                <div className="animate-pulse text-red-600">Loading...</div>
              </div>
            )}
            <div className="text-red-800">
              {lastLiberal ? (
                <MarkdownRenderer content={lastLiberal} />
              ) : (
                "The Liberal perspective will appear here..."
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 mb-6 text-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            // Create temporary notification
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
            notification.style.zIndex = '50';
            notification.textContent = 'Link copied to clipboard!';
            document.body.appendChild(notification);
            // Remove notification after 3 seconds
            setTimeout(() => {
              notification.remove();
            }, 3000);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share with friends to help them vote
        </button>
      </div>
      
      <div className="max-w-xl mx-auto w-full mt-auto">
        <form onSubmit={askTheAlmighty} className="relative">
          <input
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-full bg-white focus:outline-none focus:border-black transition-colors"
            placeholder="Ask about Canadian political issues..."
            value={conservativeInput}
            onChange={(e) => { 
              handleConservativeInputChange(e); 
              handleLiberalInputChange(e); 
            }}
            disabled={isLoading || conservativeLoading || liberalLoading}
          />
          <button
            type="submit"
            disabled={isLoading || conservativeLoading || liberalLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Click to compare party positions on issues that matter to you</p>
        </div>
      </div>
    </div>
  );
} 