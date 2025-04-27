'use client'
import React, { useState } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(error.message || 'Error fetching Conservative response');
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
      setError(error.message || 'Error fetching Liberal response');
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
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Canadian Political Perspectives</h1>
        <p className="text-gray-600 italic">Compare policy viewpoints across Canada's major political parties</p>
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
          </div>
          <div className="flex-1 bg-blue-50 p-5 rounded-lg shadow-md overflow-y-auto h-64 md:h-96 border-2 border-blue-200 relative">
            {conservativeLoading && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center">
                <div className="animate-pulse text-blue-600">Loading...</div>
              </div>
            )}
            <p className="text-blue-800 leading-relaxed">
              {lastConservative || "The Conservative perspective will appear here..."}
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-[30%] flex flex-col">
          <div className="border-b-2 border-red-600 pb-2 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-red-600">Liberal Party</h2>
          </div>
          <div className="flex-1 bg-red-50 p-5 rounded-lg shadow-md overflow-y-auto h-64 md:h-96 border-2 border-red-200 relative">
            {liberalLoading && (
              <div className="absolute inset-0 bg-red-50 bg-opacity-50 flex items-center justify-center">
                <div className="animate-pulse text-red-600">Loading...</div>
              </div>
            )}
            <p className="text-red-800 leading-relaxed">
              {lastLiberal || "The Liberal perspective will appear here..."}
            </p>
          </div>
        </div>
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
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isLoading || conservativeLoading || liberalLoading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            disabled={isLoading || conservativeLoading || liberalLoading}
          >
            {isLoading || conservativeLoading || liberalLoading ? 'Loading...' : 'Ask'}
          </button>
        </form>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <a 
          className="inline-block border-b border-gray-400 pb-0.5 hover:text-black hover:border-black transition-colors" 
          href="https://twitter.com/krishivthakuria" 
          target="_blank" 
          rel="noreferrer"
        >
          Built by Krishiv
        </a>
      </footer>
    </div>
  )  
}  
