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

import { ChatUser, Message } from "../../types/messages";

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

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await api.get("/messages/conversations");
      const mappedUsers = res.data.map((c: {
        id: string;
        other_user_id: string;
        other_user_name: string;
        other_user_username: string;
        other_user_profile_color: string;
        last_message: string;
        last_message_time: string;
        unread_count: number;
      }) => ({
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
      
      // If targetConvId is provided in URL
      if (targetConvId) {
        const targetConv = mappedUsers.find((u: ChatUser) => u.conversation_id === targetConvId);
        if (targetConv) {
          setSelectedUser(targetConv);
          setShowMobileList(false);
        }
      } 
      // Else if targetUserId is provided in URL
      else if (targetUserId) {
        const targetUser = mappedUsers.find((u: ChatUser) => u.id === targetUserId);
        if (targetUser) {
          setSelectedUser(targetUser);
          setShowMobileList(false);
        } else {
          // Create conversation if it doesn't exist
          try {
            const convRes = await api.post("/messages/conversations", { otherUserId: targetUserId });
            const conv = convRes.data;
            
            // Fetch user details to show in header before list refreshes
            const userRes = await api.get(`/messages/search?q=${targetUserId}`);
            const foundUser = userRes.data.find((u: any) => u.id === targetUserId);
            
            if (foundUser) {
              const newChatUser: ChatUser = {
                id: foundUser.id,
                conversation_id: conv.id,
                name: foundUser.name,
                username: foundUser.username,
                profile_color: foundUser.profile_color
              };
              setSelectedUser(newChatUser);
              setShowMobileList(false);
              // Refresh list to include new conversation
              const refreshRes = await api.get("/messages/conversations");
              setUsers(refreshRes.data.map((c: {
                id: string;
                other_user_id: string;
                other_user_name: string;
                other_user_username: string;
                other_user_profile_color: string;
                last_message: string;
                last_message_time: string;
                unread_count: number;
              }) => ({
                id: c.other_user_id,
                conversation_id: c.id,
                name: c.other_user_name,
                username: c.other_user_username,
                profile_color: c.other_user_profile_color,
                last_message: c.last_message,
                last_message_time: c.last_message_time,
                unread_count: c.unread_count
              })));
            }
          } catch (err) {
            console.error("Error creating conversation:", err);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [api, targetUserId, targetConvId]);

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

  const fetchMessages = React.useCallback(async (conversationId: string) => {
    try {
      const res = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(res.data);
      
      // Mark as seen
      await api.put(`/messages/seen/${conversationId}`);
      refreshUnreadCounts();
      
      // Update local users list unread count
      setUsers(prev => prev.map(u => u.conversation_id === conversationId ? { ...u, unread_count: 0 } : u));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [api, refreshUnreadCounts]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.conversation_id);
      
      if (socket) {
        socket.emit('mark_seen', { conversationId: selectedUser.conversation_id, receiverId: user?.id });
      }
    }
  }, [selectedUser, socket, fetchMessages, user?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      if (selectedUser && message.conversation_id === selectedUser.conversation_id) {
        setMessages(prev => [...prev, message]);
        if (message.sender_id === selectedUser.id) {
          api.put(`/messages/seen/${selectedUser.conversation_id}`);
          socket.emit('mark_seen', { conversationId: selectedUser.conversation_id, receiverId: user?.id });
        }
      }
      fetchUsers(); // Refresh conversation list
    };

    const handleMessageStatusUpdate = (data: { messageId: string, status: 'sent' | 'delivered' | 'seen', receiverId: string }) => {
      setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, status: data.status } : m));
    };

    const handleMessagesSeen = (data: { conversationId: string, seenBy: string }) => {
      if (selectedUser && data.conversationId === selectedUser.conversation_id && data.seenBy === selectedUser.id) {
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
  }, [socket, selectedUser, user, api, fetchUsers]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messageData = {
      receiverId: selectedUser.id,
      conversationId: selectedUser.conversation_id,
      messageText: newMessage.trim()
    };

    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
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
    // If it's a user from search, we need to get/create conversation first
    if (!u.conversation_id) {
      try {
        const res = await api.post("/messages/conversations", { otherUserId: u.id });
        const conv = res.data;
        const chatUser: ChatUser = {
          id: u.id,
          conversation_id: conv.id,
          name: u.name,
          username: u.username,
          profile_color: u.profile_color
        };
        setSelectedUser(chatUser);
        router.push(`/messages?conversationId=${conv.id}`, { scroll: false });
      } catch (err) {
        console.error("Error selecting user:", err);
      }
    } else {
      setSelectedUser(u);
      router.push(`/messages?conversationId=${u.conversation_id}`, { scroll: false });
    }
    setShowMobileList(false);
    setSearchQuery("");
    setSearchResults([]);
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
