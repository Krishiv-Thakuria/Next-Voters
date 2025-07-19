"use client"

import {
  PromptInput,
  PromptInputActions,
  PromptInputAction,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Loader2 } from "lucide-react"
import React from "react"

interface PromptInputWithActionsProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PromptInputWithActions({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  disabled,
  children,
}: PromptInputWithActionsProps) {
  // The actual form submission is handled by the parent form element
  // in `app/app/page.tsx`. This component just provides the UI.

  return (
    <PromptInput
      value={input}
      onValueChange={onInputChange}
      isLoading={isLoading}
      disabled={disabled}
      className="w-full"
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full items-end">
          <PromptInputTextarea
            placeholder="Ask about a candidate's stance..."
            className="min-h-[44px] flex-grow border-none px-4 shadow-none focus-visible:ring-0"
          />
          <PromptInputActions>
            <Button
              type="submit" // This button will trigger the parent form's onSubmit
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full"
              disabled={disabled || !input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </Button>
          </PromptInputActions>
        </div>
        {children && (
          <div className="mt-2 flex items-center gap-2 self-start px-3 pb-2">
            {children}
          </div>
        )}
      </div>
    </PromptInput>
  );
}
