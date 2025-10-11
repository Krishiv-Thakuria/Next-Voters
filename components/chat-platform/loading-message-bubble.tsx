import React from 'react'

const LoadingMessageBubble = () => {
  return (
    <div className="mb-4">
      <div className="w-fit max-w-[95%] md:max-w-[75%] bg-gray-200 rounded-2xl shadow-sm p-4">
        <div className="animate-pulse flex space-x-2">
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingMessageBubble