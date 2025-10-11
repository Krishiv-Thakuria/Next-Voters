import React from 'react'
import MessageBubble from './message-bubble'

const LoadimgMessageBubble = () => {
  return (
    <MessageBubble
      message={{
        type: 'reg',
        message: 'Thinking...'
      }}
      isFromMe={false}
    />
  )
}

export default LoadimgMessageBubble