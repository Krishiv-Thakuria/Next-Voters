#!/bin/bash

# Create a new file with the changes
cat > app/page.tsx.new << 'EOF'
'use client'
import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [hasIncrementedCount, setHasIncrementedCount] = useState(false);

  // Fetch question count on component mount
  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch('/api/questionCount');
        if (!response.ok) {
          console.error('Error response from questionCount API:', response.status);
          return;
        }
        const data = await response.json();
        if (data && typeof data.count === 'number') {
          setQuestionCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching question count:', error);
      }
    };

    fetchQuestionCount();
  }, []);

  // Increment the global question count
  const incrementQuestionCount = async () => {
    if (hasIncrementedCount) return;
    
    try {
      const response = await fetch('/api/questionCount', { method: 'POST' });
      if (!response.ok) {
        console.error('Error response from questionCount API:', response.status);
        return;
      }
      const data = await response.json();
      if (data && typeof data.count === 'number') {
        setQuestionCount(data.count);
        setHasIncrementedCount(true);
      }
    } catch (error) {
      console.error('Error incrementing question count:', error);
    }
  };

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
    },
    onFinish: () => {
      // Only increment count when both responses have finished
      if (!liberalLoading) {
        incrementQuestionCount();
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
    },
    onFinish: () => {
      // We only need to check in one onFinish
      // The conservative onFinish already handles this
    }
  });
EOF

# Append the rest of the original file after line 90
tail -n +90 app/page.tsx >> app/page.tsx.new

# Replace the original file with the new file
mv app/page.tsx.new app/page.tsx

echo "Successfully updated app/page.tsx to handle rate limit errors"
