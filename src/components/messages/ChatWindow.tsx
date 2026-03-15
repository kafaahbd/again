"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, Send, ShieldCheck, User, Info, Ban } from "lucide-react";
import { isSameDay, format, isToday, isYesterday } from "date-fns";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import Link from "next/link";

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
  onEditMessage?: (message: Message) => void;
  onDeleteMessage?: (messageId: string, forEveryone: boolean) => void;
  onReplyMessage?: (message: Message) => void;
  onReactMessage?: (messageId: string, reaction: string) => void;
  replyingToMessage?: Message | null;
  editingMessage?: Message | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onBlockUser?: (userId: string) => void;
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
  lang,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
  onReactMessage,
  replyingToMessage,
  editingMessage,
  onCancelReply,
  onCancelEdit,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onBlockUser
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const infoMenuRef = useRef<HTMLDivElement>(null);

  const previousScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [selectedUser?.id]);

  const scrollToBottom = (force = false) => {
    if (force) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // Scroll to bottom if we are already near the bottom (within 150px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const previousMessagesLengthRef = useRef<number>(messages.length);

  useEffect(() => {
    if (!isLoadingMore && scrollContainerRef.current) {
      if (previousScrollHeightRef.current > 0) {
        // We just finished loading more messages, restore scroll position
        const newScrollHeight = scrollContainerRef.current.scrollHeight;
        scrollContainerRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
        previousScrollHeightRef.current = 0; // Reset
      } else {
        // Normal scroll to bottom (e.g., new message sent/received)
        const lastMessage = messages[messages.length - 1];
        const isNewMessage = messages.length > previousMessagesLengthRef.current;
        const isMyNewMessage = isNewMessage && lastMessage && lastMessage.sender_id === currentUserId;
        
        scrollToBottom(isInitialLoadRef.current || isMyNewMessage);
        if (messages.length > 0) {
          isInitialLoadRef.current = false;
        }
      }
    }
    previousMessagesLengthRef.current = messages.length;
  }, [messages, isTyping, isLoadingMore]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
        setShowInfoMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop === 0 && scrollHeight > clientHeight && hasMore && !isLoadingMore && onLoadMore) {
        previousScrollHeightRef.current = scrollHeight;
        onLoadMore();
      }
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 dark:bg-gray-950/30">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-3xl flex items-center justify-center mb-6 text-[#0084ff] dark:text-blue-500 shadow-sm border border-blue-100/50 dark:border-blue-900/20">
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
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-105 transition-transform duration-200 ${
                selectedUser.profile_color?.startsWith('bg-') ? selectedUser.profile_color : ''
              }`}
              style={!selectedUser.profile_color?.startsWith('bg-') ? { 
                backgroundColor: selectedUser.profile_color || '#10B981',
                background: `linear-gradient(135deg, ${selectedUser.profile_color || '#10B981'} 0%, #059669 100%)`
              } : {}}
            >
              {selectedUser.name[0].toUpperCase()}
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

        <div className="flex items-center relative" ref={infoMenuRef}>
          <button 
            onClick={() => setShowInfoMenu(!showInfoMenu)}
            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <Info size={20} />
          </button>
          
          {showInfoMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
              <Link 
                href={`/profile/${selectedUser.username}`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowInfoMenu(false)}
              >
                <User size={16} />
                {lang === "bn" ? "প্রোফাইল দেখুন" : "View Profile"}
              </Link>
              <button 
                onClick={() => {
                  if (onBlockUser && selectedUser) {
                    onBlockUser(selectedUser.id);
                  }
                  setShowInfoMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <Ban size={16} />
                {lang === "bn" ? "ব্লক করুন" : "Block User"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.97] dark:opacity-100"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[11px] font-medium rounded-full border border-gray-200/50 dark:border-gray-700/30">
            {lang === "bn" ? "নিরাপদ এন্ড-টু-এন্ড এনক্রিপশন" : "Secure End-to-End Encryption"}
          </span>
        </div>

        {messages.filter(msg => {
          if (!msg.deleted_by) return true;
          if (Array.isArray(msg.deleted_by)) return !msg.deleted_by.includes(currentUserId);
          if (typeof msg.deleted_by === 'string') return !(msg.deleted_by as string).includes(currentUserId);
          return true;
        }).map((msg, i, filteredMessages) => {
          const isMe = msg.sender_id === currentUserId;
          const showAvatar = i === 0 || filteredMessages[i-1].sender_id !== msg.sender_id;
          
          let showDateSeparator = false;
          let dateText = "";
          
          if (i === 0) {
            showDateSeparator = true;
          } else {
            const prevDate = new Date(filteredMessages[i-1].created_at);
            const currDate = new Date(msg.created_at);
            if (!isSameDay(prevDate, currDate)) {
              showDateSeparator = true;
            }
          }

          if (showDateSeparator) {
            const date = new Date(msg.created_at);
            if (isToday(date)) {
              dateText = lang === "bn" ? "আজ" : "Today";
            } else if (isYesterday(date)) {
              dateText = lang === "bn" ? "গতকাল" : "Yesterday";
            } else {
              dateText = format(date, "MMMM d, yyyy");
            }
          }

          let showTimestampDefault = true;
          if (i > 0) {
            const prevMsg = filteredMessages[i - 1];
            if (prevMsg.sender_id === msg.sender_id) {
              const timeDiff = new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime();
              if (timeDiff < 5 * 60 * 1000) { // 5 minutes
                showTimestampDefault = false;
              }
            }
          }

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[11px] font-medium rounded-full border border-gray-200/50 dark:border-gray-700/30">
                    {dateText}
                  </span>
                </div>
              )}
              <MessageBubble 
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                profileColor={selectedUser.profile_color}
                initials={selectedUser.name[0]}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                onReply={onReplyMessage}
                onReact={onReactMessage}
                repliedMessage={msg.reply_to_message_id ? filteredMessages.find(m => m.id === msg.reply_to_message_id) : undefined}
                showTimestampDefault={showTimestampDefault}
              />
            </React.Fragment>
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
          replyingToMessage={replyingToMessage}
          editingMessage={editingMessage}
          onCancelReply={onCancelReply}
          onCancelEdit={onCancelEdit}
        />
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
           {lang === "bn" ? "দ্বীনি শিক্ষার সাথে মেসেজিং" : "Bridging knowledge with communication"}
        </p>
      </footer>
    </div>
  );
};

export default ChatWindow;