"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEO from "../../components/SEO";
import ConversationList from "../../components/messages/ConversationList";
import ChatWindow from "../../components/messages/ChatWindow";
import UserSearch from "../../components/messages/UserSearch";

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
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = React.useCallback(async () => {
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
            const searchRes = await api.get(`/messages/search?q=${targetUserId}`);
            const foundUser = searchRes.data.find((u: ChatUser) => u.id === targetUserId);
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
  }, [api, targetUserId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
  }, [searchQuery, api]);

  const fetchMessages = React.useCallback(async (otherUserId: string) => {
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
  }, [api, refreshUnreadCounts]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      
      if (socket) {
        socket.emit('mark_seen', { senderId: selectedUser.id, receiverId: user?.id });
      }
    }
  }, [selectedUser, socket, fetchMessages, user?.id]);

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

    const handleMessageStatusUpdate = (data: { messageId: string, status: 'sent' | 'delivered' | 'seen', receiverId: string }) => {
      if (selectedUser && data.receiverId === selectedUser.id) {
        setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, status: data.status } : m));
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
        <UserSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSelectUser={selectUser}
          lang={lang}
        />

        <ConversationList 
          users={users}
          selectedUserId={selectedUser?.id}
          onlineUsers={onlineUsers}
          onSelectUser={selectUser}
          loading={loading}
          lang={lang}
        />
      </div>

      {/* Right Chat Window */}
      <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-white dark:bg-gray-900 relative`}>
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
          isOnline={selectedUser ? onlineUsers.has(selectedUser.id) : false}
          lang={lang}
        />
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
