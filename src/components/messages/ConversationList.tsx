"use client";
import React from "react";
import { User } from "lucide-react";
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
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
      {users.map(u => (
        <ConversationItem 
          key={u.id}
          user={u}
          isSelected={selectedUserId === u.id}
          isOnline={onlineUsers.has(u.id)}
          onClick={() => onSelectUser(u)}
          lang={lang}
        />
      ))}
      
      {users.length === 0 && !loading && (
        <div className="text-center py-20 px-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <User size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {lang === "bn" ? "এখনো কোনো কথোপকথন নেই" : "No conversations yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
