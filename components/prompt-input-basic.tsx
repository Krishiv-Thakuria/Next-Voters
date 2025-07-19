"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUp, Square } from "lucide-react"
import { useState } from "react"

interface PromptInputBasicProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (event: React.FormEvent) => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
  // Dropdown props
  country: string
  region: string
  election: string
  availableRegions: string[]
  availableElections: string[]
  countryData: Record<string, string[]>
  electionOptions: Record<string, string[]>
  onCountryChange: (value: string) => void
  onRegionChange: (value: string) => void
  onElectionChange: (value: string) => void
}

export function PromptInputBasic({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading = false, 
  placeholder = "Ask me anything...",
  disabled = false,
  country,
  region,
  election,
  availableRegions,
  availableElections,
  countryData,
  electionOptions,
  onCountryChange,
  onRegionChange,
  onElectionChange
}: PromptInputBasicProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled && value.trim()) {
      onSubmit(event)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PromptInput
        value={value}
        onValueChange={() => {}}
        isLoading={isLoading}
        className="w-full max-w-4xl"
      >
        <div className="space-y-2">
          {/* Textarea on top */}
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <PromptInputTextarea 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onKeyDown={handleKeyDown}
                className="min-h-[40px] resize-none"
              />
            </div>
            
            {/* Send button aligned with textarea */}
            <div className="flex-shrink-0">
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={disabled || !value.trim()}
              >
                {isLoading ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Dropdowns below textarea */}
          <div className="flex gap-2 items-center">
            <Select value={country} onValueChange={onCountryChange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(countryData).map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={onRegionChange} disabled={!country || availableRegions.length === 0}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {availableRegions.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r.length > 12 ? r.substring(0, 12) + '...' : r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={election} onValueChange={onElectionChange} disabled={!country || availableElections.length === 0}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Election" />
              </SelectTrigger>
              <SelectContent>
                {availableElections.map((e) => (
                  <SelectItem key={e} value={e} className="text-xs">
                    {e.length > 20 ? e.substring(0, 20) + '...' : e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PromptInput>
    </form>
  )
}
