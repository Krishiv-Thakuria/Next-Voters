"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import { Spinner } from "@/components/ui/spinner";
import MessageBubble from "../../components/message-bubble";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import PreferenceSelector from "@/components/preference-selector";

const Chat = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  const initialMessage = searchParams.get('message');
  const [message, setMessage] = useState(initialMessage|| '');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    console.log('API Response:', data);

    const responses = data.responses.map((response: any) => ({
      partyName: response.partyName,
      response: response.response,
      citations: response.citations
    }));

    console.log(responses); 
    
    setChatHistory((prev) => [...prev, { 
      type: 'agent', 
      parties: responses.partyName, 
      response: responses.response, 
      citations: responses.citations 
    }]);
    
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (initialMessage) {
      mutate();
    }
  }, []);

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
            <div className="flex items-center justify-center h-full p-8">
              <Card className="bg-slate-50 w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a conversation by typing a message below. Your chat history will appear here.
                  </p>
                </CardContent>
              </Card>
            </div>
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