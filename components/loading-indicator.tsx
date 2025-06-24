"use client"

import { Loader } from "@/components/ui/loader"
import { useEffect, useState } from "react"

const loadingMessages = [
  "Analyzing sources",
  "Comparing candidate stances",
  "Checking voting records",
  "Reviewing policy documents",
  "Synthesizing information",
  "Drafting response",
]

export function LoadingIndicator() {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = loadingMessages.indexOf(prevMessage)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 2000) // Change message every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center p-4">
      <Loader variant="loading-dots" text={currentMessage} />
    </div>
  )
}
