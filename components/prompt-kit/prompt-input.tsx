"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Textarea, { type TextareaAutosizeProps } from "react-textarea-autosize"

import { cn } from "@/lib/utils"

const promptInputVariants = cva(
  "flex w-full flex-col rounded-lg border p-2",
  {
    variants: {
      variant: {
        default: "bg-background text-primary-foreground",
        outline: "border-input bg-transparent",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export interface PromptInputProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof promptInputVariants> {
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, variant, value, onValueChange, onSubmit, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    }

    return (
      <div
        className={cn(promptInputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PromptInput.displayName = "PromptInput"

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, ...props }, ref) => {
  return (
    <Textarea
      className={cn(
        "flex w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
PromptInputTextarea.displayName = "PromptInputTextarea"

const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex w-full items-center", className)}
      {...props}
    />
  )
})
PromptInputActions.displayName = "PromptInputActions"

export {
  PromptInput,
  promptInputVariants,
  PromptInputTextarea,
  PromptInputActions,
}
