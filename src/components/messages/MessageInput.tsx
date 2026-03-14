"use client";
import React from "react";
import { Send, Smile, Paperclip, X, Edit2, Reply } from "lucide-react";
import { Message } from "../../types/messages";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSend: (e: React.FormEvent) => void;
  onTyping: () => void;
  lang: string;
  replyingToMessage?: Message | null;
  editingMessage?: Message | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onTyping,
  lang,
  replyingToMessage,
  editingMessage,
  onCancelReply,
  onCancelEdit
}) => {
  return (
    <div className="p-3 md:p-4 bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800/60 flex flex-col gap-2">
      {/* Reply Preview */}
      {replyingToMessage && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border-l-4 border-emerald-500 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Reply size={16} className="text-emerald-500 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Replying to:</span>
              <span className="text-gray-500 dark:text-gray-400 truncate">{replyingToMessage.message_text}</span>
            </div>
          </div>
          <button onClick={onCancelReply} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Edit Preview */}
      {editingMessage && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/10 p-2 rounded-xl border-l-4 border-amber-500 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Edit2 size={16} className="text-amber-500 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-amber-700 dark:text-amber-500 mr-2">Editing message:</span>
              <span className="text-amber-600/80 dark:text-amber-400/80 truncate">{editingMessage.message_text}</span>
            </div>
          </div>
          <button onClick={onCancelEdit} className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={onSend} className="flex items-center gap-2 md:gap-3 max-w-7xl mx-auto w-full">
        
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