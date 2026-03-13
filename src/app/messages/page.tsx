"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import { ArrowLeft, Send, User, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { getProfileColor } from '../../typescriptfile/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatUser {
  id: string;
  name: string;
  profile_color: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}

export default function MessagesPage() {
  const { user, token } = useAuth();
  const { socket, onlineUsers, refreshUnreadCounts } = useSocket();
  const { t } = useLanguage();
  
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (token) {
      fetchChatUsers();
    }
  }, [token]);

  useEffect(() => {
    if (selectedUserId && token) {
      fetchMessages(selectedUserId);
      markMessagesAsSeen(selectedUserId);
    }
  }, [selectedUserId, token]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message: Message) => {
        if (message.sender_id === selectedUserId || message.receiver_id === selectedUserId) {
          setMessages(prev => [...prev, message]);
          if (message.sender_id === selectedUserId) {
            markMessagesAsSeen(selectedUserId);
          }
        }
        fetchChatUsers();
      });

      socket.on('message_sent', (message: Message) => {
        if (message.receiver_id === selectedUserId) {
          setMessages(prev => [...prev, message]);
        }
        fetchChatUsers();
      });

      socket.on('message_status_update', ({ messageId, status }) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status } : m));
      });

      socket.on('typing_start', ({ userId }) => {
        if (userId === selectedUserId) setRemoteTyping(true);
      });

      socket.on('typing_end', ({ userId }) => {
        if (userId === selectedUserId) setRemoteTyping(false);
      });

      return () => {
        socket.off('receive_message');
        socket.off('message_sent');
        socket.off('message_status_update');
        socket.off('typing_start');
        socket.off('typing_end');
      };
    }
  }, [socket, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, remoteTyping]);

  const fetchChatUsers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const res = await axios.get(`${API_URL}/messages/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatUsers(res.data);
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const res = await axios.get(`${API_URL}/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsSeen = async (otherUserId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      await axios.put(`${API_URL}/messages/seen`, { senderId: otherUserId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshUnreadCounts();
      fetchChatUsers();
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !socket) return;

    socket.emit('send_message', {
      senderId: user?.id,
      receiverId: selectedUserId,
      text: newMessage.trim()
    });

    setNewMessage('');
    handleTypingEnd();
  };

  const handleTyping = () => {
    if (!socket || !selectedUserId) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { receiverId: selectedUserId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingEnd();
    }, 2000);
  };

  const handleTypingEnd = () => {
    if (!socket || !selectedUserId) return;
    setIsTyping(false);
    socket.emit('typing_end', { receiverId: selectedUserId });
  };

  const selectedUser = chatUsers.find(u => u.id === selectedUserId);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please login to view messages.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 h-[calc(100vh-80px)]">
      <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-900 h-full flex overflow-hidden">
        
        {/* Users List */}
        <div className={`w-full md:w-1/3 border-r border-gray-100 dark:border-gray-900 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-900">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No conversations yet.</div>
            ) : (
              chatUsers.map(chatUser => (
                <button
                  key={chatUser.id}
                  onClick={() => setSelectedUserId(chatUser.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left border-b border-gray-50 dark:border-gray-900/50 ${selectedUserId === chatUser.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                >
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${chatUser.profile_color || getProfileColor(chatUser.name)} flex items-center justify-center text-white font-bold shadow-sm`}>
                      {chatUser.name.charAt(0).toUpperCase()}
                    </div>
                    {onlineUsers.has(chatUser.id) && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{chatUser.name}</h3>
                      {chatUser.last_message_time && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {new Date(chatUser.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${chatUser.unread_count > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chatUser.last_message || 'No messages yet'}
                    </p>
                  </div>
                  {chatUser.unread_count > 0 && (
                    <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {chatUser.unread_count}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col bg-gray-50/50 dark:bg-gray-900/20 ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          {selectedUserId && selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 flex items-center gap-3">
                <button 
                  onClick={() => setSelectedUserId(null)}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${selectedUser.profile_color || getProfileColor(selectedUser.name)} flex items-center justify-center text-white font-bold shadow-sm`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  {onlineUsers.has(selectedUser.id) && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.has(selectedUser.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isMine = msg.sender_id === user.id;
                  const showAvatar = !isMine && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id);
                  
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
                      {!isMine && (
                        <div className="w-8 flex-shrink-0">
                          {showAvatar && (
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${selectedUser.profile_color || getProfileColor(selectedUser.name)} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                              {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div 
                          className={`px-4 py-2 rounded-2xl ${
                            isMine 
                              ? 'bg-emerald-500 text-white rounded-tr-sm' 
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (
                            <span className="text-gray-400">
                              {msg.status === 'sent' && <Check size={12} />}
                              {msg.status === 'delivered' && <CheckCheck size={12} />}
                              {msg.status === 'seen' && <CheckCheck size={12} className="text-emerald-500" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {remoteTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-8 flex-shrink-0">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${selectedUser.profile_color || getProfileColor(selectedUser.name)} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-colors">
                    <textarea
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-11 w-11 flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your Messages</h3>
              <p className="text-sm max-w-xs">Select a conversation from the list to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
