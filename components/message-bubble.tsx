import React, { FC } from 'react'
import PoliticalPerspective from './political-perspective';
import { Message } from '@/types/message';

interface MessageBubbleProps {
    message: Message; 
    isFromMe: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const myMessage = "py-3 px-4 rounded-2xl shadow-sm max-w-md bg-red-500 text-white rounded-br-md ml-auto";
  const AIMessage = "grid grid-cols-1 md:grid-cols-2 gap-4";

  if (message.type === "me") {
    // TypeScript now knows message is MeMessage
    return (
      <div className="flex justify-end mb-4">
        <div className={myMessage}>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  } else {
    // TypeScript now knows message is AgentMessage
    return (
      <div className="flex justify-start mb-4">
        <div className={AIMessage}>
          <div className="w-screen flex space-x-3">
            <PoliticalPerspective
              title={message.parties[0].partyName}
              content={message.parties[0].text}
              loading={false}
              color="blue"
            />
            <PoliticalPerspective
              title={message.parties[1].partyName}
              content={message.parties[1].text}
              loading={false}
              color="red"
            />
          </div>
        </div>
      </div>
    );
  }
};

export default MessageBubble;