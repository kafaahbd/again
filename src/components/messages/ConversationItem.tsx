"use client";
import React from "react";
import { format } from "date-fns";

import { ChatUser } from "../../types/messages";

interface ConversationItemProps {
  user: ChatUser;
  isSelected: boolean;
  isOnline: boolean;
  onClick: () => void;
  lang: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  user, 
  isSelected, 
  isOnline, 
  onClick,
  lang 
}) => {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, "p");
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left mb-1 ${
        isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
          style={{ backgroundColor: user.profile_color || '#3B82F6' }}
        >
          {user.name[0]}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <p className={`font-bold truncate ${user.unread_count && user.unread_count > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {user.name}
          </p>
          {user.last_message_time && (
            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
              {formatTime(user.last_message_time)}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-xs truncate flex-1 ${user.unread_count && user.unread_count > 0 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500'}`}>
            {user.last_message || (lang === "bn" ? "কথোপকথন শুরু করুন" : "Start a conversation")}
          </p>
          {user.unread_count && user.unread_count > 0 ? (
            <span className="ml-2 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {user.unread_count}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
