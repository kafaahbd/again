"use client";
import React from "react";
import { MessageSquare, Users, Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { ChatUser } from "../../types/messages";

interface ConversationListProps {
  users: ChatUser[];
  selectedUserId?: string;
  onlineUsers: Set<string>;
  onSelectUser: (user: ChatUser) => void;
  loading: boolean;
  lang: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  users,
  selectedUserId,
  onlineUsers,
  onSelectUser,
  loading,
  lang
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header & Search Placeholder */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {lang === "bn" ? "মেসেজ" : "Messages"}
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {users.length}
            </span>
          </h2>
        </div>
        
        {/* Subtle Search Bar UI */}
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder={lang === "bn" ? "কাউকে খুঁজুন..." : "Search brothers/sisters..."}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {loading ? (
          // Simple Skeleton Loading Placeholder
          [1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl" />
              <div className="flex-1">
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-900 rounded mb-2" />
                <div className="h-2 w-full bg-gray-50 dark:bg-gray-900/50 rounded" />
              </div>
            </div>
          ))
        ) : (
          users.map(u => (
            <ConversationItem 
              key={u.id}
              user={u}
              isSelected={selectedUserId === u.id}
              isOnline={onlineUsers.has(u.id)}
              onClick={() => onSelectUser(u)}
              lang={lang}
            />
          ))
        )}
        
        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2rem] flex items-center justify-center mb-6 text-emerald-600/30 dark:text-emerald-500/20 rotate-6 border border-emerald-100 dark:border-emerald-900/20">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-1">
              {lang === "bn" ? "কোনো মেসেজ নেই" : "No Messages Found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-[180px] leading-relaxed">
              {lang === "bn" 
                ? "নতুন কোনো কথোপকথন শুরু করতে আপনার পরিচিত কাউকে খুঁজুন।" 
                : "Start a new conversation to bridge the bond of brotherhood."}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Subtle Branding */}
      <div className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Users size={12} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Kafa'ah Community
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;