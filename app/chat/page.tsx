"use client";
import React from "react";

const messages = [
  {
    from: "me",
    text: "Welcome to group everyone !",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "other",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat at praesentium...",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "me",
    text: [
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, repudiandae.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, reiciendis!",
    ],
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "other",
    text: "happy holiday guys!",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "me",
    text: "Thanks for the warm welcome!",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "other",
    text: "Looking forward to our collaboration",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "me",
    text: "Absolutely! This is going to be great",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
  {
    from: "other",
    text: "Let me know if you need any help getting started",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
  },
];

const Chat = () => {
  return (
    <div className="flex flex-col bg-gray-50">
      {/* Main Chat Container */}
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Messages Container - Takes remaining space and scrolls */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col max-w-6xl mx-auto">
            {messages.map((msg, idx) =>
              msg.from === "me" ? (
                <div key={idx} className="flex justify-end">
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                    <div>
                      {Array.isArray(msg.text) ? (
                        msg.text.map((t, i) => (
                          <div
                            key={i}
                            className="mb-1 py-2 px-3 bg-red-500 rounded-bl-2xl rounded-tl-2xl rounded-tr-lg text-white text-sm"
                          >
                            {t}
                          </div>
                        ))
                      ) : (
                        <div className="py-2 px-3 bg-red-500 rounded-bl-2xl rounded-tl-2xl rounded-tr-lg text-white text-sm">
                          {msg.text}
                        </div>
                      )}
                    </div>
                    <img
                      src={msg.img}
                      className="object-cover h-8 w-8 rounded-full flex-shrink-0"
                      alt="me"
                    />
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex justify-start">
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                    <img
                      src={msg.img}
                      className="object-cover h-8 w-8 rounded-full flex-shrink-0"
                      alt="other"
                    />
                    <div className="py-2 px-3 bg-gray-100 rounded-br-2xl rounded-tr-2xl rounded-tl-lg text-gray-800 text-sm">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center space-x-3 max-w-4xl mx-auto">
            <input
              className="flex-1 bg-gray-50 py-3 px-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder-gray-500"
              type="text"
              placeholder="Type your message..."
            />
            <button
              className="bg-black text-white px-6 py-3 rounded-full transition-colors duration-200 text-sm font-medium"
              onClick={() => console.log("Send message")}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;