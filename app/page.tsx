'use client'
import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages: bibleMessages, setMessages: setBibleMessages, input: bibleInput, handleInputChange: handleBibleInputChange, handleSubmit: handleBibleSubmit } = useChat( {api: 'api/bible'});
  const { messages: quranMessages, setMessages: setQuranMessages, input: quranInput, handleInputChange: handleQuranInputChange, handleSubmit: handleQuranSubmit } = useChat( {api: 'api/quran'});
  const { messages: torahMessages,  setMessages: setTorahMessages, input: torahInput, handleInputChange: handleTorahInputChange, handleSubmit: handleTorahSubmit } = useChat( {api: 'api/torah'});
  const { messages: gitaMessages,  setMessages: setGitaMessages, input: gitaInput, handleInputChange: handleGitaInputChange, handleSubmit: handleGitaSubmit } = useChat( {api: 'api/gita'});
  const [userInput, setUserInput] = useState('');

  const askTheAlmighty = (event: React.FormEvent<HTMLFormElement> ) => {
    // cant figure out how to fix the bug where i have to press enter twice to get the messages to show up
    // something to do with the streaming? like its trying to get the stream before its loaded?
    event.preventDefault();
    console.log('askTheAlmighty')

    const inputEvent = {
        target: {
            value: userInput,
        },
    };
    console.log('inputEvent', inputEvent)

    handleBibleInputChange(inputEvent);
    handleBibleSubmit(event);
    handleQuranInputChange(inputEvent);
    handleQuranSubmit(event);
    handleTorahInputChange(inputEvent);
    handleTorahSubmit(event);
    handleGitaInputChange(inputEvent);
    handleGitaSubmit(event);
    console.log('hi')
    console.log('bibleMessages', bibleMessages)
  }

  return (
    <div className="flex flex-wrap justify-center items-center h-screen p-4 md:p-10">
      <div className="w-1/2 md:w-1/2 p-2">
        <h1 className="text-2xl font-bold text-center">The Holy Quran</h1>
        <div className="flex flex-col border p-2 bg-gray-100 mt-2 rounded overflow-y-auto h-32 md:h-80 md:min-h-96 md:max-h-1/2 w-full md:w-3/4 mx-auto">
          {quranMessages[quranMessages.length - 1]?.content}
        </div>
      </div>
  
      <div className="w-1/2 md:w-1/2 p-2">
        <h1 className="text-2xl font-bold text-center">The New Testament</h1>
        <div className="flex flex-col border p-2 bg-gray-100 mt-2 rounded overflow-y-auto h-32 md:h-80 w-full md:w-3/4 mx-auto">
          {bibleMessages[bibleMessages.length - 1]?.content}
        </div>
      </div>
  
      <div className="w-full flex justify-center items-center p-2 md:p-0">
        <form onSubmit={askTheAlmighty}>
          <input
            className="border border-2 p-2 text-lg rounded-lg w-full"
            placeholder="Ask me anything..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </form>
      </div>
  
      <div className="w-1/2 md:w-1/2 p-2">
        <h1 className="text-2xl font-bold text-center">The Written Torah</h1>
        <div className="flex flex-col border p-2 bg-gray-100 mt-2 rounded overflow-y-auto h-32 md:h-80 md:min-h-96 md:max-h-1/2 w-full md:w-3/4 mx-auto">
          {torahMessages[torahMessages.length - 1]?.content}
        </div>
      </div>
  
      <div className="w-1/2 md:w-1/2 p-2">
        <h1 className="text-2xl font-bold text-center">The Bhagavad Gita</h1>
        <div className="flex flex-col border p-2 bg-gray-100 mt-2 rounded overflow-y-auto h-32 md:h-80 md:min-h-96 md:max-h-1/2 w-full md:w-3/4 mx-auto">
          {gitaMessages[gitaMessages.length - 1]?.content}
        </div>
      </div>
    </div>
  )  
}  
