"use client";
import React from "react";
import { Send, Smile, Paperclip } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSend: (e: React.FormEvent) => void;
  onTyping: () => void;
  lang: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onTyping,
  lang
}) => {
  return (
    <div className="p-3 md:p-4 bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800/60">
      <form onSubmit={onSend} className="flex items-center gap-2 md:gap-3 max-w-7xl mx-auto">
        
        {/* Attachment Button (Optional but kept for professional look) */}
        <button 
          type="button" 
          className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-xl transition-all duration-200"
        >
          <Paperclip size={20} />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder={lang === "bn" ? "আপনার মেসেজ লিখুন..." : "Type your message..."}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
          />
          
          {/* Emoji Button */}
          <button 
            type="button" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors duration-200"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-3.5 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center ${
            newMessage.trim() 
              ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-emerald-500/20 hover:scale-105 active:scale-95' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          <Send size={20} className={newMessage.trim() ? 'translate-x-0.5 -translate-y-0.5 rotate-12' : ''} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;