import React, { FC } from 'react'
import PoliticalPerspective from '@/components/chat-platform/political-perspective';
import { Message } from '@/types/chat-platform/message';

interface MessageBubbleProps {
    message: Message; 
    isFromMe: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message, isFromMe }) => {
  const myMessage = "py-3 px-4 rounded-2xl shadow-sm max-w-md bg-red-500 text-white rounded-br-md ml-auto";

  if (isFromMe && message.type === "reg") {
    return (
      <div className="flex justify-end mb-4">
        <div className={myMessage}>
          <p className="text-sm">{message.message}</p>
        </div>
      </div>
    );
  } else if (message.type === "agent") {
    return (
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4">
        {message.parties.map((party, index) => {
          // Determine color based on party name
          const getPartyColor = (partyName: string): "blue" | "red" => {
            const name = partyName.toLowerCase();
            // US parties
            if (name.includes("democratic")) return "blue";
            if (name.includes("republican")) return "red";
            // Canada parties
            if (name.includes("liberal")) return "red";
            if (name.includes("conservative")) return "blue";
            // Default: alternate by index
            return index % 2 === 0 ? "blue" : "red";
          };

          return (
            <PoliticalPerspective
              key={index}
              title={party.partyName}
              partyStance={party.partyStance}
              supportingDetails={party.supportingDetails}
              color={getPartyColor(party.partyName)}
              citations={party.citations}
            />
          );
        })}
      </div>
    );
  }
};

export default MessageBubble;