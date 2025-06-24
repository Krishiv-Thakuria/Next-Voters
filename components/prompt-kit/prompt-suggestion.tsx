"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const promptSuggestionVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-full border px-3 py-1 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-background text-primary-foreground",
        outline: "border-input bg-transparent",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export interface PromptSuggestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof promptSuggestionVariants> {}

const PromptSuggestion = React.forwardRef<HTMLButtonElement, PromptSuggestionProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(promptSuggestionVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PromptSuggestion.displayName = "PromptSuggestion"

export { PromptSuggestion, promptSuggestionVariants }
