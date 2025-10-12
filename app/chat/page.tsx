"use client";

import React, { 
  useState, 
  useRef, 
  useEffect 
} from "react";
import { useSearchParams } from 'next/navigation';
import usePreference from "@/hooks/preferences";
import MessageBubble from "@/components/chat-platform/message-bubble";
import { Message } from "@/types/chat-platform/message";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import PreferenceSelector from "@/components/preference-selector";
import NoChatScreen from "@/components/chat-platform/no-chat-screen";
import { AIAgentResponse } from "@/types/chat-platform/chat-platform";
import LoadingMessageBubble from "@/components/chat-platform/loading-message-bubble";
import ClientMountWrapper from "@/components/client-mount-wrapper";

const Chat = () => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');
  const [message, setMessage] = useState('');

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  // boolean tags
  const hasAutoSent = useRef(false);
  const messageLoading = useRef(false);

  const { preference } = usePreference();

  const requestChat = async () => {  
    messageLoading.current = true;  
    setChatHistory((prev) => [
      ...prev, 
      {
          type: 'reg',
          message
      },
    ]);
    
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
    const parties = data.responses.map((response: AIAgentResponse) => ({
      partyName: response.partyName,
      partyStance: response.partyStance,  
      supportingDetails: response.supportingDetails,
      citations: response.citations
    }));
    
    setChatHistory((prev) => [
      ...prev, 
      { 
        type: 'agent', 
        parties: parties
      }
    ]);
    messageLoading.current = false; 
    setMessage('');
    
    return data.responses;
  }

  const { mutate } = useMutation({
    mutationFn: requestChat,
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      mutate();
    }
  };

  useEffect(() => {
    if (initialMessage && !hasAutoSent.current) {
      hasAutoSent.current = true;
      mutate();
    }
  }, [initialMessage, mutate]);

  return (
    <ClientMountWrapper className="h-screen bg-slate-50 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length > 0 ? (
            <>
            {chatHistory.map((msg, index) => (
              
                <MessageBubble
                  key={index}
                  message={msg}
                  isFromMe={msg.type === "reg"}
                />
              
            ))}
            {messageLoading.current && (
              <LoadingMessageBubble />
            )}
            </>
          ) : (
            <NoChatScreen />
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                className="w-full bg-slate-50 py-3 px-4 pr-14 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder-slate-500 text-slate-900 resize-none max-h-32"
                value={message}
                placeholder="Type your message..."
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
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
    </ClientMountWrapper>
  );
};

export default Chat