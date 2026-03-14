"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEO from "../../components/SEO";
import ConversationList from "../../components/messages/ConversationList";
import ChatWindow from "../../components/messages/ChatWindow";
import UserSearch from "../../components/messages/UserSearch";
import { ChatUser, Message } from "../../types/messages";
import { MessageSquare } from "lucide-react";

const MessagesContent = () => {
  const { user, api } = useAuth();
  const { socket, onlineUsers, refreshUnreadCounts } = useSocket();
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const targetUserId = searchParams.get("userId");
  const targetConvId = searchParams.get("conversationId");

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- API: Fetch Conversations ---
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/messages/conversations");
      const mappedUsers = res.data.map((c: any) => ({
        id: c.other_user_id,
        conversation_id: c.id,
        name: c.other_user_name,
        username: c.other_user_username,
        profile_color: c.other_user_profile_color,
        last_message: c.last_message,
        last_message_time: c.last_message_time,
        unread_count: c.unread_count
      }));
      setUsers(mappedUsers);
      
      // Handle URL targets (Conversation or Direct User)
      if (targetConvId) {
        const targetConv = mappedUsers.find((u: ChatUser) => u.conversation_id === targetConvId);
        if (targetConv) { setSelectedUser(targetConv); setShowMobileList(false); }
      } else if (targetUserId) {
        const targetUser = mappedUsers.find((u: ChatUser) => u.id === targetUserId);
        if (targetUser) { 
          setSelectedUser(targetUser); 
          setShowMobileList(false); 
        } else {
          // Create new conversation logic
          const convRes = await api.post("/messages/conversations", { otherUserId: targetUserId });
          const userRes = await api.get(`/messages/search?q=${targetUserId}`);
          const foundUser = userRes.data.find((u: any) => u.id === targetUserId);
          if (foundUser) {
            setSelectedUser({
              id: foundUser.id,
              conversation_id: convRes.data.id,
              name: foundUser.name,
              username: foundUser.username,
              profile_color: foundUser.profile_color
            });
            setShowMobileList(false);
          }
        }
      }
    } catch (error) { console.error("Conversations error:", error);
    } finally { setLoading(false); }
  }, [api, targetUserId, targetConvId]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // --- Logic: Messages & Socket ---
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(res.data);
      await api.put(`/messages/seen/${conversationId}`);
      refreshUnreadCounts();
      setUsers(prev => prev.map(u => u.conversation_id === conversationId ? { ...u, unread_count: 0 } : u));
    } catch (error) { console.error("Messages fetch error:", error); }
  }, [api, refreshUnreadCounts]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.conversation_id);
      socket?.emit('mark_seen', { conversationId: selectedUser.conversation_id, receiverId: user?.id });
    }
  }, [selectedUser, socket, fetchMessages, user?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message: Message) => {
      if (selectedUser?.conversation_id === message.conversation_id) {
        setMessages(prev => [...prev, message]);
        if (message.sender_id === selectedUser.id) {
          api.put(`/messages/seen/${selectedUser.conversation_id}`);
          socket.emit('mark_seen', { conversationId: selectedUser.conversation_id, receiverId: user?.id });
        }
      }
      fetchUsers();
    });

    socket.on('typing_start', (data: { senderId: string }) => {
      if (selectedUser?.id === data.senderId) setIsTyping(true);
    });

    socket.on('typing_end', (data: { senderId: string }) => {
      if (selectedUser?.id === data.senderId) setIsTyping(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing_start');
      socket.off('typing_end');
    };
  }, [socket, selectedUser, user, api, fetchUsers]);

  // --- Handlers ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messageData = {
      receiverId: selectedUser.id,
      conversationId: selectedUser.conversation_id,
      messageText: newMessage.trim()
    };

    const optimisticMsg: Message = {
      id: Date.now().toString(),
      conversation_id: selectedUser.conversation_id,
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

  const selectUser = async (u: any) => {
    if (!u.conversation_id) {
      try {
        const res = await api.post("/messages/conversations", { otherUserId: u.id });
        const chatUser: ChatUser = { ...u, conversation_id: res.data.id };
        setSelectedUser(chatUser);
        router.push(`/messages?conversationId=${res.data.id}`, { scroll: false });
      } catch (err) { console.error(err); }
    } else {
      setSelectedUser(u);
      router.push(`/messages?conversationId=${u.conversation_id}`, { scroll: false });
    }
    setShowMobileList(false);
    setSearchQuery("");
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="text-emerald-600" size={40} />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login Required</h2>
      <p className="text-gray-500 max-w-xs">Please login to your Kafa'ah account to start safe and private conversations.</p>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0B1120] overflow-hidden transition-colors duration-500">
      <SEO title={lang === "bn" ? "মেসেজ - কাফআহ" : "Messages - Kafa'ah"} />
      
      {/* --- Left Sidebar: Conversation List --- */}
      <motion.div 
        className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-800/60 bg-white dark:bg-[#0F172A] z-20`}
        initial={false}
      >
        <div className="p-4 border-b border-gray-50 dark:border-gray-800/50">
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-4 uppercase">
            {lang === "bn" ? "চ্যাট" : "Chats"}
          </h1>
          <UserSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSelectUser={selectUser}
            lang={lang}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ConversationList 
            users={users}
            selectedUserId={selectedUser?.id}
            onlineUsers={onlineUsers}
            onSelectUser={selectUser}
            loading={loading}
            lang={lang}
          />
        </div>
      </motion.div>

      {/* --- Right Section: Chat Window --- */}
      <main className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-white dark:bg-[#0B1120] relative`}>
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div 
              key={selectedUser.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <ChatWindow 
                selectedUser={selectedUser}
                messages={messages}
                currentUserId={user.id}
                isTyping={isTyping}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                onBack={() => setShowMobileList(true)}
                isOnline={onlineUsers.has(selectedUser.id)}
                lang={lang}
              />
            </motion.div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6 rotate-12">
                <MessageSquare className="text-gray-400 dark:text-gray-600" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {lang === "bn" ? "আপনার ভাই/বোনদের সাথে কথা বলুন" : "Select a conversation"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                {lang === "bn" ? "বাম দিক থেকে কাউকে সিলেক্ট করুন অথবা নতুন ইউজার খুঁজুন।" : "Choose someone from the list to start a secure discussion."}
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950 text-emerald-600 font-bold">LOADING KAFA'AH...</div>}>
      <MessagesContent />
    </Suspense>
  );
}