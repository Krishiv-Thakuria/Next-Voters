import React from 'react'
import { 
    Card, 
    CardContent 
} from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const NoChatScreen = () => {
  return (
    <div className="flex items-center justify-center h-full p-8">
        <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a conversation by typing a message below. Your chat history will appear here.
            </p>
        </CardContent>
        </Card>
    </div>
  )
}

export default NoChatScreen