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
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | string) => void
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export function PromptInputWithActions({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  disabled,
  children,
}: PromptInputWithActionsProps) {
  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    if (!isLoading && input.trim()) {
      onSubmit(e)
    }
  }

  const handleValueChange = (value: string) => {
    if (typeof onInputChange === 'function') {
      // The `useChat` hook's `handleInputChange` can accept a string directly.
      // This avoids creating a synthetic event.
      onInputChange(value)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <PromptInput
        value={input}
        onValueChange={handleValueChange}
        isLoading={isLoading}
        disabled={disabled}
        onSubmit={() => handleFormSubmit()}
        className="w-full"
      >
        <div className="flex w-full flex-col">
          <div className="flex w-full items-end">
            <PromptInputTextarea
              placeholder="Ask about a candidate's stance..."
              className="min-h-[44px] flex-grow border-none px-4 shadow-none focus-visible:ring-0"
              value={input}
              onChange={(e) => onInputChange(e)}
            />
            <PromptInputActions>
              <Button
                type="submit"
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
    </form>
  )
}
