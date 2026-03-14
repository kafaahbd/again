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

  const hasUnread = user.unread_count && user.unread_count > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left mb-2 border ${
        isSelected 
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30' 
          : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-gray-100 dark:hover:border-gray-800'
      }`}
    >
      {/* Profile Section with Squircle Shape */}
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm transform transition-transform group-hover:scale-105"
          style={{ 
            backgroundColor: user.profile_color || '#10B981',
            background: `linear-gradient(135deg, ${user.profile_color || '#10B981'} 0%, #059669 100%)`
          }}
        >
          {user.name[0].toUpperCase()}
        </div>
        
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className={`text-sm font-bold truncate ${hasUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {user.name}
          </p>
          {user.last_message_time && (
            <span className={`text-[10px] font-medium whitespace-nowrap ml-2 ${hasUnread ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
              {formatTime(user.last_message_time)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className={`text-xs truncate flex-1 leading-tight ${hasUnread ? 'text-gray-900 dark:text-gray-200 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
            {user.last_message || (lang === "bn" ? "আসসালামু আলাইকুম..." : "Assalamu Alaikum...")}
          </p>
          
          {hasUnread ? (
            <span className="ml-2 bg-emerald-600 dark:bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg min-w-[20px] text-center shadow-lg shadow-emerald-500/20">
              {user.unread_count}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;