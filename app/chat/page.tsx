"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import { Spinner } from "@/components/ui/spinner";
import MessageBubble, { Message } from "../components/message-bubble";

const messages: Message[] = [
  {
    type: "me",
    text: "Welcome to group everyone !"
  },
  {
    type: "agent",
    parties: [
      {
        partyName: "Democratic Party",
        text: "Thank you! Excited to be here and looking forward to working with all of you."
      },
      {
        partyName: "Republican Party",
        text: "Thanks for the warm welcome! We're eager to contribute and collaborate on this project."
      }
    ]
  },
  {
    type: "me",
    text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, repudiandae.",
  },
  {
    type: "agent",
    parties: [
      {
        partyName: "Democratic Party",
        text: "Looking forward to our collaboration on this project and achieving great results together."
      },
      {
        partyName: "Republican Party",
        text: "We're excited about the opportunities ahead and are committed to making this a success for everyone involved."
      }
    ]
  },
  {
    type: "me",
    text: "Absolutely! This is going to be great",
  },
  {
    type: "agent",
    parties: [
      {
        partyName: "Democratic Party",
        text: "Happy holidays everyone! 🎉",
      },
      {
        partyName: "Republican Party",
        text: "Wishing everyone a joyful holiday season and a prosperous new year! The church should be honoured! 🎄✨",
      }
    ]
  }
];


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
              isFromMe={msg.type === "me"} 
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