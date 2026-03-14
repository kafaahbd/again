"use client";
import React from "react";
import { Search, UserPlus } from "lucide-react";

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
    <div className="p-4 border-b border-gray-100 dark:border-gray-800/60 bg-white dark:bg-gray-950">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          {lang === "bn" ? "মেসেজ" : "Messages"}
        </h1>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg text-emerald-600 dark:text-emerald-500">
           <UserPlus size={18} />
        </div>
      </div>

      {/* Search Input Area */}
      <div className="relative group">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" 
          size={18} 
        />
        <input
          type="text"
          placeholder={lang === "bn" ? "কাউকে খুঁজুন..." : "Search brothers/sisters..."}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Floating Search Results Dropdown */}
      {searchQuery.length > 1 && (
        <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[60] max-h-80 overflow-y-auto custom-scrollbar ring-1 ring-black/5">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
                {lang === "bn" ? "সার্চ রেজাল্ট" : "Search Results"}
              </p>
            </div>
            
            <div className="space-y-1">
              {searchResults.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    setSearchQuery(""); // Clear search after selection
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all text-left group"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform duration-200"
                    style={{ 
                      backgroundColor: u.profile_color || '#10B981',
                      background: `linear-gradient(135deg, ${u.profile_color || '#10B981'} 0%, #059669 100%)`
                    }}
                  >
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate text-sm">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      @{u.username}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="py-10 px-4 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                  {lang === "bn" ? "দুঃখিত, কোনো ইউজার পাওয়া যায়নি" : "No users found matching your search"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;