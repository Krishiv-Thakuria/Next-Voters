"use client";
import React from "react";

const users = [
  {
    name: "Luis1994",
    message: "Pick me at 9:00 Am",
    img: "https://source.unsplash.com/_7LbC5J-jw4/600x600",
    active: false,
  },
  {
    name: "Everest Trip 2021",
    message: "Hi Sam, Welcome",
    img: "https://source.unsplash.com/otT2199XwI8/600x600",
    active: false,
  },
  {
    name: "MERN Stack",
    message: "Lusi : Thanks Everyone",
    img: "https://source.unsplash.com/L2cxSuKWbpo/600x600",
    active: true,
  },
  {
    name: "Javascript Indonesia",
    message: "Evan : some one can fix this",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
    active: false,
  },
  {
    name: "Javascript Indonesia",
    message: "Evan : some one can fix this",
    img: "https://source.unsplash.com/vpOeXr5wmR4/600x600",
    active: false,
  },
];

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
];

const Chat = () => { 
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex flex-row flex-1 bg-white overflow-hidden">
        <div className="w-full px-5 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col mt-5">
              {messages.map((msg, idx) =>
                msg.from === "me" ? (
                  <div key={idx} className="flex justify-end mb-4">
                    <div>
                      {Array.isArray(msg.text) ? (
                        msg.text.map((t, i) => (
                          <div
                            key={i}
                            className="mt-4 mr-2 py-3 px-4 bg-red-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                          >
                            {t}
                          </div>
                        ))
                      ) : (
                        <div className="mr-2 py-3 px-4 bg-red-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                          {msg.text}
                        </div>
                      )}
                    </div>
                    <img
                      src={msg.img}
                      className="object-cover h-8 w-8 rounded-full"
                      alt="me"
                    />
                  </div>
                ) : (
                  <div key={idx} className="flex justify-start mb-4">
                    <img
                      src={msg.img}
                      className="object-cover h-8 w-8 rounded-full"
                      alt="other"
                    />
                    <div className="ml-2 py-3 px-4 bg-gray-100 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black">
                      {msg.text}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="py-5 flex-shrink-0">
            <input
              className="w-full bg-gray-300 py-5 px-3 rounded-xl"
              type="text"
              placeholder="type your message here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;