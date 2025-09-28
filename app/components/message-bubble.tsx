import React from 'react'
import PoliticalPerspective from './political-perspective';

const MessageBubble = ({ message, isFromMe }) => {
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
              title="Conservative Party"
              subtitle="Based on official 2025 party platform"
              content={message}
              loading={false}
              color="blue"
            />
            <PoliticalPerspective
              title="Liberal Party"
              subtitle="Based on official 2025 party platform"
              content={message}
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