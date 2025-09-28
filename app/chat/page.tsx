"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import { Spinner } from "@/components/ui/spinner";

const messages = [
  {
    from: "me",
    text: "Welcome to group everyone !",
  },
  {
    from: "other",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat at praesentium, quisquam eligendi...",
  },
  {
    from: "me",
    text: [
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, repudiandae.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, reiciendis!"
    ],
  },
  {
    from: "other",
    text: "Happy holidays everyone! 🎉",
  },
  {
    from: "me",
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
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

  if (!isMounted) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Spinner size="lg" className="bg-black" />
    </div>
  );


  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
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
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) =>
            msg.from === "me" ? (
              <div key={index} className="flex justify-end">
                <div className="flex items-end space-x-2 max-w-md">
                  <div className="space-y-1">
                    {Array.isArray(msg.text) ? (
                      msg.text.map((t, i) => (
                        <div
                          key={i}
                          className="py-3 px-4 bg-red-500 text-white rounded-2xl rounded-br-md shadow-sm"
                        >
                          <p className="text-sm leading-relaxed">{t}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-3 px-4 bg-red-500 text-white rounded-2xl rounded-br-md shadow-sm">
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start">
                <div className="flex items-end space-x-3 max-w-md">
                  <div className="space-y-1">
                    <div className="py-3 px-4 bg-white border border-slate-200 rounded-2xl rounded-bl-md shadow-sm">
                      <p className="text-sm leading-relaxed text-slate-800">{msg.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
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
                style={{
                  minHeight: '44px',
                  height: 'auto'
                }}
              />
              <div className="absolute right-2 bottom-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
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