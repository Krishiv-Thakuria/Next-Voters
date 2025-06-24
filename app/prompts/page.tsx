'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptSuggestion,
} from '@/components/prompt-kit';

function PromptSuggestionBasic() {
  const [value, setValue] = React.useState('');

  const suggestions = [
    'Tell me a joke.',
    'How does this work?',
    'What is the meaning of life?',
    'Summarize the latest news.',
  ];

  return (
    <PromptInput>
      <div className="flex items-center gap-2 overflow-x-auto p-2">
        {suggestions.map((suggestion, index) => (
          <PromptSuggestion
            key={index}
            onClick={() => setValue(suggestion)}
          >
            {suggestion}
          </PromptSuggestion>
        ))}
      </div>
      <PromptInputTextarea
        placeholder="Type your message here..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <PromptInputActions>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log('Sending: ', value)}
        >
          Send
        </Button>
      </PromptInputActions>
    </PromptInput>
  );
}

export default function PromptsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-2xl rounded-lg border p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">Prompt Suggestions</h1>
        <PromptSuggestionBasic />
      </div>
    </div>
  );
}
