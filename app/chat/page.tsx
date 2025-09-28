"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import { Spinner } from "@/components/ui/spinner";
import PoliticalPerspective from "../components/political-perspective";

const messages = [
  {
    from: "me",
    text: "Welcome to group everyone !",
  },
  {
    from: "ai",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat at praesentium, quisquam eligendi...",
  },
  {
    from: "me",
    text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, repudiandae.",
  },
  {
    from: "ai",
    text: "Happy holidays everyone! 🎉",
  },
  {
    from: "ai",
    text: "Thanks for the warm welcome!",
  },
  {
    from: "other",
    text: "Looking forward to our collaboration on this project",
  },
  {
    from: "me",
    text: "Absolutely! This is going to be great",
  },
  {
    from: "other",
    text: "Let me know if you need any help getting started with anything",
  }
];

const lastConservative = "Conservatives focus on fiscal responsibility, small government, and traditional values.";
const lastLiberal = "Liberals emphasize social equality, healthcare access, and progressive policies.";
const MessageBubble = ({ message, isFromMe }) => {
  const myMessage = "py-3 px-4 rounded-2xl shadow-sm max-w-md bg-red-500 text-white rounded-br-md ml-auto";
  const AIMessage = "grid grid-cols-1 md:grid-cols-2 gap-4";
  
  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={isFromMe ? myMessage : AIMessage}>
        {isFromMe ? (
          <p className="text-sm">{message.text}</p>
        ) : (
          <div className="w-screen flex space-x-3">
            <PoliticalPerspective
              title="Conservative Party"
              subtitle="Based on official 2025 party platform"
              content={lastConservative}
              loading={false}
              color="blue"
            />
            <PoliticalPerspective
              title="Liberal Party"
              subtitle="Based on official 2025 party platform"
              content={lastLiberal}
              loading={false}
              color="red"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');
  const [message, setMessage] = useState(initialMessage || '');
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { handleGetPreference } = usePreference();
  const preference = handleGetPreference();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="bg-black" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="mr-2.5">
            <span className="text-blue-800 font-semibold text-xl">N</span>
            <span className="text-red-800 font-semibold text-xl">V</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Chat Platform</h1>
            <p className="text-sm text-slate-500">
              {preference ? `${preference.region} | ${preference.election}` : 'No preferences set'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <MessageBubble 
              key={index} 
              message={msg} 
              isFromMe={msg.from === "me"} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                className="w-full bg-slate-50 py-3 px-4 pr-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder-slate-500 text-slate-900 resize-none max-h-32"
                value={message}
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ minHeight: '44px', height: 'auto' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="absolute right-2 bottom-2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;