"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { 
  Search, Send, MoreVertical, Phone, Video, 
  ChevronLeft, Check, CheckCheck, Smile, Paperclip,
  User, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../../components/SEO";

interface ChatUser {
  id: string;
  name: string;
  username: string;
  profile_color: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}

const MessagesContent = () => {
  const { user, api } = useAuth();
  const { socket, onlineUsers, refreshUnreadCounts } = useSocket();
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams.get("userId");

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/messages/users");
      setUsers(res.data);
      
      // If targetUserId is provided in URL, select that user
      if (targetUserId) {
        const targetUser = res.data.find((u: ChatUser) => u.id === targetUserId);
        if (targetUser) {
          setSelectedUser(targetUser);
          setShowMobileList(false);
        } else {
          // If not in conversation list, fetch user details
          try {
            // Try to find them in the search if not in list
            const searchRes = await api.get(`/messages/search?q=${targetUserId}`);
            const foundUser = searchRes.data.find((u: any) => u.id === targetUserId);
            if (foundUser) {
              setSelectedUser(foundUser);
              setShowMobileList(false);
            }
          } catch (err) {
            console.error("Error fetching target user:", err);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [targetUserId]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await api.get(`/messages/search?q=${searchQuery}`);
          setSearchResults(res.data);
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchMessages = async (otherUserId: string) => {
    try {
      const res = await api.get(`/messages/${otherUserId}`);
      setMessages(res.data);
      
      // Mark as seen
      await api.put("/messages/seen", { senderId: otherUserId });
      refreshUnreadCounts();
      
      // Update local users list unread count
      setUsers(prev => prev.map(u => u.id === otherUserId ? { ...u, unread_count: 0 } : u));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      
      if (socket) {
        socket.emit('mark_seen', { senderId: selectedUser.id, receiverId: user?.id });
      }
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      if (selectedUser && (message.sender_id === selectedUser.id || message.receiver_id === selectedUser.id)) {
        setMessages(prev => [...prev, message]);
        if (message.sender_id === selectedUser.id) {
          api.put("/messages/seen", { senderId: selectedUser.id });
          socket.emit('mark_seen', { senderId: selectedUser.id, receiverId: user?.id });
        }
      }
      fetchUsers(); // Refresh conversation list
    };

    const handleMessageStatusUpdate = (data: { messageId: string, status: string, receiverId: string }) => {
      if (selectedUser && data.receiverId === selectedUser.id) {
        setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, status: data.status as any } : m));
      }
    };

    const handleMessagesSeen = (data: { senderId: string, receiverId: string }) => {
      if (selectedUser && data.senderId === user?.id && data.receiverId === selectedUser.id) {
        setMessages(prev => prev.map(m => ({ ...m, status: 'seen' })));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_status_update', handleMessageStatusUpdate);
    socket.on('messages_seen', handleMessagesSeen);
    socket.on('typing_start', (data: { senderId: string }) => {
      if (selectedUser && data.senderId === selectedUser.id) setIsTyping(true);
    });
    socket.on('typing_end', (data: { senderId: string }) => {
      if (selectedUser && data.senderId === selectedUser.id) setIsTyping(false);
    });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_status_update', handleMessageStatusUpdate);
      socket.off('messages_seen', handleMessagesSeen);
      socket.off('typing_start');
      socket.off('typing_end');
    };
  }, [socket, selectedUser, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messageData = {
      receiverId: selectedUser.id,
      messageText: newMessage.trim()
    };

    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      sender_id: user?.id || '',
      receiver_id: selectedUser.id,
      message_text: newMessage.trim(),
      status: 'sent',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");

    socket.emit('send_message', messageData);
    socket.emit('typing_end', { receiverId: selectedUser.id });
  };

  const handleTyping = () => {
    if (!socket || !selectedUser) return;
    
    socket.emit('typing_start', { receiverId: selectedUser.id });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_end', { receiverId: selectedUser.id });
    }, 2000);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectUser = (u: ChatUser) => {
    setSelectedUser(u);
    setShowMobileList(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/messages?userId=${u.id}`, { scroll: false });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please login to view messages.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <SEO title={lang === "bn" ? "মেসেজ - কাফআহ" : "Messages - Kafa'ah"} />
      
      {/* Left Sidebar - Conversation List */}
      <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all`}>
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
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery.length > 1 ? (
            <div className="p-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">
                {lang === "bn" ? "সার্চ রেজাল্ট" : "Search Results"}
              </p>
              {searchResults.map(u => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`} style={{ backgroundColor: u.profile_color || '#3B82F6' }}>
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                  </div>
                </button>
              ))}
              {searchResults.length === 0 && (
                <p className="text-center py-10 text-gray-400 text-sm">
                  {lang === "bn" ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"}
                </p>
              )}
            </div>
          ) : (
            <div className="p-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left mb-1 ${selectedUser?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`} style={{ backgroundColor: u.profile_color || '#3B82F6' }}>
                      {u.name[0]}
                    </div>
                    {onlineUsers.has(u.id) && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`font-bold truncate ${u.unread_count && u.unread_count > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {u.name}
                      </p>
                      {u.last_message_time && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {formatTime(u.last_message_time)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-xs truncate flex-1 ${u.unread_count && u.unread_count > 0 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500'}`}>
                        {u.last_message || (lang === "bn" ? "কথোপকথন শুরু করুন" : "Start a conversation")}
                      </p>
                      {u.unread_count && u.unread_count > 0 ? (
                        <span className="ml-2 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {u.unread_count}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
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
          )}
        </div>
      </div>

      {/* Right Chat Window */}
      <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-white dark:bg-gray-900 relative`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm`} style={{ backgroundColor: selectedUser.profile_color || '#3B82F6' }}>
                    {selectedUser.name[0]}
                  </div>
                  {onlineUsers.has(selectedUser.id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-black text-gray-900 dark:text-white leading-tight">{selectedUser.name}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    {onlineUsers.has(selectedUser.id) ? (lang === "bn" ? "অনলাইন" : "Online") : (lang === "bn" ? "অফলাইন" : "Offline")}
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
                const isMe = msg.sender_id === user?.id;
                const showAvatar = i === 0 || messages[i-1].sender_id !== msg.sender_id;
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isMe && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedUser.profile_color || '#3B82F6' }}>
                            {selectedUser.name[0]}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                        {msg.message_text}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 px-1">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                          {formatTime(msg.created_at)}
                        </span>
                        {isMe && (
                          <span className="text-gray-400">
                            {msg.status === 'seen' ? (
                              <CheckCheck size={12} className="text-blue-500" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck size={12} />
                            ) : (
                              <Check size={12} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedUser.profile_color || '#3B82F6' }}>
                    {selectedUser.name[0]}
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
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
                      handleTyping();
                    }}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all">
                    <Smile size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${newMessage.trim() ? 'bg-blue-600 text-white shadow-blue-500/20 hover:scale-105 active:scale-95' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
