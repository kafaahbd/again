"use client";
import React, { useRef, useEffect } from "react";
import { ChevronLeft, Send, ShieldCheck, User, Info } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

import { ChatUser, Message } from "../../types/messages";

interface ChatWindowProps {
  selectedUser: ChatUser | null;
  messages: Message[];
  currentUserId: string;
  isTyping: boolean;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onTyping: () => void;
  onBack: () => void;
  isOnline: boolean;
  lang: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  currentUserId,
  isTyping,
  newMessage,
  setNewMessage,
  onSendMessage,
  onTyping,
  onBack,
  isOnline,
  lang
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 dark:bg-gray-950/30">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-500 shadow-sm border border-emerald-100/50 dark:border-emerald-900/20">
          <Send size={32} className="-rotate-12 translate-x-0.5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {lang === "bn" ? "আসসালামু আলাইকুম" : "Assalamu Alaikum"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm leading-relaxed">
          {lang === "bn" 
            ? "আপনার দ্বীনি ভাই বা বোনের সাথে নিরাপদ মেসেজিং শুরু করতে কাউকে বেছে নিন।" 
            : "Select a conversation to start a secure and respectful messaging."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-[#0B1120] relative overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="relative group cursor-pointer">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-105 transition-transform duration-200"
              style={{ 
                backgroundColor: selectedUser.profile_color || '#10B981',
                background: `linear-gradient(135deg, ${selectedUser.profile_color || '#10B981'} 0%, #059669 100%)`
              }}
            >
              {selectedUser.name[0]}
            </div>
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0B1120] rounded-full"></span>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base flex items-center gap-1.5">
              {selectedUser.name}
              <ShieldCheck size={14} className="text-emerald-500" />
            </h2>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
              {isOnline ? (lang === "bn" ? "অনলাইন" : "Online") : (lang === "bn" ? "অফলাইন" : "Offline")}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <button className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.97] dark:opacity-100">
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[11px] font-medium rounded-full border border-gray-200/50 dark:border-gray-700/30">
            {lang === "bn" ? "নিরাপদ এন্ড-টু-এন্ড এনক্রিপশন" : "Secure End-to-End Encryption"}
          </span>
        </div>

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId;
          const showAvatar = i === 0 || messages[i-1].sender_id !== msg.sender_id;
          
          return (
            <MessageBubble 
              key={msg.id}
              message={msg}
              isMe={isMe}
              showAvatar={showAvatar}
              profileColor={selectedUser.profile_color}
              initials={selectedUser.name[0]}
            />
          );
        })}
        
        {isTyping && (
          <TypingIndicator 
            profileColor={selectedUser.profile_color}
            initials={selectedUser.name[0]}
          />
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer / Input */}
      <footer className="p-2 md:p-4 bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800/60">
        <MessageInput 
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSend={onSendMessage}
          onTyping={onTyping}
          lang={lang}
        />
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
           {lang === "bn" ? "দ্বীনি শিক্ষার সাথে মেসেজিং" : "Bridging knowledge with communication"}
        </p>
      </footer>
    </div>
  );
};

export default ChatWindow;