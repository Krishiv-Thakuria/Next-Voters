"use client";

import React, { 
  useState, 
  useRef, 
  useEffect 
} from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import { Spinner } from "@/components/ui/spinner";
import MessageBubble from "../../components/message-bubble";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import PreferenceSelector from "@/components/preference-selector";
import NoChatScreen from "@/components/no-chat-screen";

const Chat = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  const initialMessage = searchParams.get('message');
  const [message, setMessage] = useState(initialMessage|| '');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const hasAutoSent = useRef(false);

  const { preference } = usePreference();

  const requestChat = async () => {
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        region: preference?.region,
      })
    })
    const data = await response.json();

    const parties = data.responses.map((response: any) => ({
      partyName: response.partyName,
      text: response.response.message.answer,
      citations: response.citations
    }));
    
    setChatHistory((prev) => [
      ...prev, 
      {
          type: 'me',
          message
      },
      { 
        type: 'agent', 
        parties: parties
      }
    ]);
    
    setMessage('');
    return data.responses;
  }

  const { mutate } = useMutation({
    mutationFn: requestChat,
    onSuccess: () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  })

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialMessage && !hasAutoSent.current && isMounted) {
      hasAutoSent.current = true;
      mutate();
    }
  }, [initialMessage, isMounted, mutate]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="bg-black" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length > 0 ? (
            chatHistory.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                isFromMe={msg.type === "me"}
              />
            ))
          ) : (
            <NoChatScreen />
          )}
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
                className="w-full bg-slate-50 py-3 px-4 pr-14 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder-slate-500 text-slate-900 resize-none max-h-32"
                value={message}
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                rows={1}
                style={{ 
                  minHeight: '44px', 
                  height: 'auto',
                  lineHeight: '1.5'
                }}
              />
              <Button
                onClick={() => mutate()}
                disabled={!message.trim()}
                size="sm"
                className="absolute right-2 bottom-2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all duration-200 border-0 p-0"
              >
                <SendHorizonal size={14} className="ml-0.5" />
              </Button>

              <PreferenceSelector />  
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