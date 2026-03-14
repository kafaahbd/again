"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface Notification {
  id: string;
  type: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
  related_id?: string;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  refreshUnreadCounts: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, api } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshUnreadCounts = async () => {
    if (!token) return;
    try {
      const [msgRes, notifRes, notifListRes] = await Promise.all([
        api.get("/messages/unread/count"),
        api.get("/notifications/unread/count"),
        api.get("/notifications")
      ]);
      setUnreadMessagesCount(msgRes.data.count);
      setUnreadNotificationsCount(notifRes.data.count);
      setNotifications(notifListRes.data);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPushNotifications = async () => {
    if (!token || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const res = await api.get("/push/public-key");
      const publicVapidKey = res.data.publicKey;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      await api.post("/push/subscribe", subscription);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  useEffect(() => {
    if (user && token) {
      const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:3000';
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join', user.id);
      });

      newSocket.on('user_status_change', (data: { userId: string, isOnline: boolean }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.isOnline) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      newSocket.on('receive_message', () => {
        setUnreadMessagesCount(prev => prev + 1);
      });

      newSocket.on('new_notification', (data: any) => {
        setUnreadNotificationsCount(prev => prev + 1);
        setNotifications(prev => [data, ...prev]);
        
        // Show browser notification if supported and permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Kafaah Study Corner', {
            body: data.message,
            icon: '/icon.png'
          });
        }
      });

      refreshUnreadCounts();

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            subscribeToPushNotifications();
          }
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        subscribeToPushNotifications();
      }

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
      setOnlineUsers(new Set());
      setUnreadMessagesCount(0);
      setUnreadNotificationsCount(0);
      setNotifications([]);
    }
  }, [user, token]);

  const markNotificationAsRead = async (id: string) => {
    if (!token) return;
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!token) return;
    try {
      await api.put("/notifications/read-all", {});
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadNotificationsCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      onlineUsers,
      unreadMessagesCount,
      unreadNotificationsCount,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      refreshUnreadCounts
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
