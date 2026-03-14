"use client";
import React, { useRef, useEffect } from "react";
import { ChevronLeft, Phone, Video, MoreVertical, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

interface ChatUser {
  id: string;
  name: string;
  username: string;
  profile_color: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}

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
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10">
          <Send size={40} className="rotate-12" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {lang === "bn" ? "আপনার মেসেজগুলো" : "Your Messages"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs font-medium">
          {lang === "bn" ? "কথোপকথন শুরু করতে বাম পাশ থেকে কাউকে বেছে নিন।" : "Select a conversation from the left to start messaging."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 relative">
      {/* Chat Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
              style={{ backgroundColor: selectedUser.profile_color || '#3B82F6' }}
            >
              {selectedUser.name[0]}
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="font-black text-gray-900 dark:text-white leading-tight">{selectedUser.name}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              {isOnline ? (lang === "bn" ? "অনলাইন" : "Online") : (lang === "bn" ? "অফলাইন" : "Offline")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-gray-950/50">
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
      </div>

      {/* Message Input */}
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={onSendMessage}
        onTyping={onTyping}
        lang={lang}
      />
    </div>
  );
};

export default ChatWindow;
