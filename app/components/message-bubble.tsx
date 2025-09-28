import React, { FC } from 'react'
import PoliticalPerspective from './political-perspective';

interface MessageBubbleProps {
    message: { 
        text?: string, 
        partyOne?: {
            partyName: string,
            text: string
        }, 
        partyTwo?: {
            partyName: string,
            text: string
        } 
    };
    isFromMe: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message, isFromMe }) => {
  const myMessage = "py-3 px-4 rounded-2xl shadow-sm max-w-md bg-red-500 text-white rounded-br-md ml-auto";
  const AIMessage = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={isFromMe ? myMessage : AIMessage}>
        {isFromMe ? (
          <p className="text-sm">{message.text}</p>
        ) : (
          <div className="w-screen flex space-x-3">
            <PoliticalPerspective
              title={message?.partyOne?.partyName}
              content={message?.partyOne.text}
              loading={false}
              color="blue"
            />
            <PoliticalPerspective
              title={message?.partyTwo?.partyName}
              content={message?.partyTwo.text}
              loading={false}
              color="red"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;