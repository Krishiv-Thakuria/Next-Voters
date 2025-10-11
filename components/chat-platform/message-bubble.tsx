import React, { FC } from 'react'
import PoliticalPerspective from '@/components/chat-platform/political-perspective';
import { Message } from '@/types/chat-platform/message';

interface MessageBubbleProps {
    message: Message; 
    isFromMe: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const myMessage = "py-3 px-4 rounded-2xl shadow-sm max-w-md bg-red-500 text-white rounded-br-md ml-auto";
  const otherMessage = "grid grid-cols-1 md:grid-cols-2 gap-4";

  if (message.type === "reg") {
    return (
      <div className="flex justify-end mb-4">
        <div className={myMessage}>
          <p className="text-sm">{message.message}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-start mb-4">
        <div className={otherMessage}>
          <div className="w-screen flex space-x-3">
            {message.parties.map((party, index) => (
              <PoliticalPerspective
                key={index}
                title={party.partyName}
                content={party.text}
                loading={false}
                color={index % 2 === 0 ? "blue" : "red"} 
                citations={party.citations}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default MessageBubble;