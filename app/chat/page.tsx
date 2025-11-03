"use client"

import LoadingMessageBubble from "@/components/chat-platform/loading-message-bubble";
import MessageBubble from "@/components/chat-platform/message-bubble";
import NoChatScreen from "@/components/chat-platform/no-chat-screen";
import ClientMountWrapper from "@/components/client-mount-wrapper";
import PreferenceSelector from "@/components/preference-selector";
import { getPreference } from "@/lib/preferences";
import { AIAgentResponse } from "@/types/chat-platform/chat-platform";
import { Message } from "@/types/chat-platform/message";
import { useMutation } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import handleFindRegionDetails from "@/lib/chat-platform/find-info-region";

const Chat = () => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');
  const [message, setMessage] = useState('');

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  // boolean tags
  const hasAutoSent = useRef(false);
  const messageLoading = useRef(false);

  const region = getPreference();

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          region: region,
          collectionName: handleFindRegionDetails("collectionName", region),
        })
      });
      return response.json();
    },
    onMutate: (message) => {
      // Optimistically update the UI
      messageLoading.current = true;
      setChatHistory(prev => [
        ...prev,
        {
          type: 'reg' as const,
          message
        }
      ]);
    },
    onSuccess: (data) => {
      const parties = data.responses.map((response: AIAgentResponse) => ({
        partyName: response.partyName,
        partyStance: response.partyStance,
        supportingDetails: response.supportingDetails,
        citations: response.citations
      }));
      
      setChatHistory(prev => [
        ...prev,
        {
          type: 'agent' as const,
          parties
        }
      ]);
      setMessage('');
    },
    onSettled: () => {
      messageLoading.current = false;
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setChatHistory(prev => [
        ...prev,
        {
          type: 'agent' as const,
          parties: [{
            partyName: 'System',
            partyStance: ['Error'],
            supportingDetails: ['Failed to send message. Please try again.'],
            citations: []
          }]
        }
      ]);
    }
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (message.trim()) {
        sendMessage(message);
      }
    }
  };

  useEffect(() => {
    if (initialMessage && !hasAutoSent.current) {
      hasAutoSent.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage, sendMessage]);

  return (
    <ClientMountWrapper className="h-screen bg-slate-50 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-10 mb-28">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto lg:mb-0 mb-4">
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
                onClick={() => message.trim() && sendMessage(message)}
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
            AI can be incorrect. Double check with citations.
          </p>
        </div>
      </div>
    </ClientMountWrapper>
  );
};

const ChatPage = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading chat...</div>}>
      <Chat />
    </Suspense>
  )
}

export default ChatPage;