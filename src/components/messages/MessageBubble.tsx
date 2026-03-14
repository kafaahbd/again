"use client";
import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  profileColor?: string;
  initials?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showAvatar,
  profileColor,
  initials
}) => {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "p");
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isMe && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar && (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: profileColor || '#3B82F6' }}
            >
              {initials}
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
          isMe 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
        }`}>
          {message.message_text}
        </div>
        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
            {formatTime(message.created_at)}
          </span>
          {isMe && (
            <span className="text-gray-400">
              {message.status === 'seen' ? (
                <CheckCheck size={12} className="text-blue-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
