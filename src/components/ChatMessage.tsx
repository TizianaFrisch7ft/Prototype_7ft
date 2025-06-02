import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`chat-message ${message.isUser ? 'user' : 'agent'}`}>
      <div className="flex items-start gap-2">
        {!message.isUser && (
          <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs">
            AI
          </div>
        )}
        <div className="flex-1">
          <p>{message.content}</p>
          <div className="text-xs mt-1 opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;