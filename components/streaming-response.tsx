"use client"

import { Markdown } from "@/components/ui/markdown"
import { useTextStream } from "@/components/ui/response-stream"


interface StreamingResponseProps {
  text: string
}

export function StreamingResponse({ text }: StreamingResponseProps) {
  const { displayedText } = useTextStream({
    textStream: text,
    mode: "fade",
    speed: 20, // Faster speed for chat
  })

  return <Markdown>{displayedText}</Markdown>
}
