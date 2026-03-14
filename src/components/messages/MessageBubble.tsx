"use client";
import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";

import { Message } from "../../types/messages";

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
    try {
      const date = new Date(dateStr);
      return format(date, "p");
    } catch (e) {
      return "";
    }
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-1`}>
      {/* Other User Avatar */}
      {!isMe && (
        <div className="w-8 h-8 flex-shrink-0 mb-5">
          {showAvatar ? (
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm transform transition-all"
              style={{ 
                backgroundColor: profileColor || '#10B981',
                background: `linear-gradient(135deg, ${profileColor || '#10B981'} 0%, #059669 100%)`
              }}
            >
              {initials?.toUpperCase()}
            </div>
          ) : (
            <div className="w-8" /> // Spacer to keep messages aligned
          )}
        </div>
      )}

      <div className={`max-w-[80%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Message Content */}
        <div className={`px-4 py-2.5 text-sm transition-all duration-200 ${
          isMe 
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-tr-none shadow-md shadow-emerald-500/10 font-medium' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700/50 shadow-sm'
        }`}>
          <p className="leading-relaxed break-words">
            {message.message_text}
          </p>
        </div>

        {/* Message Meta Info */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
          {isMe && (
            <span className="flex items-center">
              {message.status === 'seen' ? (
                <CheckCheck size={14} className="text-emerald-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={14} className="text-gray-400" />
              ) : (
                <Check size={14} className="text-gray-400" />
              )}
            </span>
          )}
          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;