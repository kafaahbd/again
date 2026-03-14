"use client";
import React from "react";
import { Send, Paperclip, Smile } from "lucide-react";

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
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <form onSubmit={onSend} className="flex items-center gap-2">
        <button type="button" className="p-2 text-gray-400 hover:text-blue-600 transition-all">
          <Paperclip size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={lang === "bn" ? "মেসেজ লিখুন..." : "Type a message..."}
            className="w-full pl-4 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all">
            <Smile size={20} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-3 rounded-2xl transition-all shadow-lg ${
            newMessage.trim() 
              ? 'bg-blue-600 text-white shadow-blue-500/20 hover:scale-105 active:scale-95' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
