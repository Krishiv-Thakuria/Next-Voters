"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PromptInputProps {
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
  onSubmit?: () => void
  className?: string
  children: React.ReactNode
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border border-input bg-background p-3 shadow-sm focus-within:ring-1 focus-within:ring-ring",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PromptInput.displayName = "PromptInput"

interface PromptInputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[60px] w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = "PromptInputTextarea"

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      />
    )
  }
)
PromptInputActions.displayName = "PromptInputActions"

interface PromptInputActionProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltip?: string
}

const PromptInputAction = React.forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ className, tooltip, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        title={tooltip}
        {...props}
      />
    )
  }
)
PromptInputAction.displayName = "PromptInputAction"

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
}
