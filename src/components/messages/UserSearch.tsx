"use client";
import React from "react";
import { Search } from "lucide-react";

interface ChatUser {
  id: string;
  name: string;
  username: string;
  profile_color: string;
}

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ChatUser[];
  onSelectUser: (user: ChatUser) => void;
  lang: string;
}

const UserSearch: React.FC<UserSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectUser,
  lang
}) => {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <h1 className="text-xl font-black text-gray-900 dark:text-white mb-4">
        {lang === "bn" ? "মেসেজ" : "Messages"}
      </h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={lang === "bn" ? "সার্চ করুন..." : "Search users..."}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery.length > 1 && (
        <div className="absolute left-0 right-0 mt-2 mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="p-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">
              {lang === "bn" ? "সার্চ রেজাল্ট" : "Search Results"}
            </p>
            {searchResults.map(u => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm"
                  style={{ backgroundColor: u.profile_color || '#3B82F6' }}
                >
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate text-sm">{u.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">@{u.username}</p>
                </div>
              </button>
            ))}
            {searchResults.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-xs">
                {lang === "bn" ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
