"use client";
import React, { useState, useMemo } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquare, Zap, Settings, User, LogOut, X, Menu, Bell, Mail } from 'lucide-react';
import { getProfileColor } from '../typescriptfile/utils';
import { useSocket } from '../contexts/SocketContext';



const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { user, confirmLogout } = useAuth();
  const { unreadMessagesCount, unreadNotificationsCount, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useSocket();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = useMemo(() => [
    { path: '/', icon: BookOpen, label: t('nav.study'), color: 'emerald' },
    { path: '/forum', icon: MessageSquare, label: t('nav.forum'), color: 'amber' },
    { path: '/mistakes', icon: Zap, label: t('nav.mistakes'), color: 'rose' },
  ], [t]);

  const activeColors: Record<string, { bg: string; icon: string; label: string }> = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', label: 'text-emerald-700 dark:text-emerald-300' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-500/10',   icon: 'text-amber-600 dark:text-amber-400',   label: 'text-amber-700 dark:text-amber-300' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-500/10',     icon: 'text-rose-600 dark:text-rose-400',     label: 'text-rose-700 dark:text-rose-300' },
  };

  return (
    <>
      {/* ── UNIFIED NAVBAR (Mobile & Desktop) ── */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-100 dark:border-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* 1. Left: Logo & Links */}
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
                  alt="Logo"
                  className="h-9 md:h-11 w-auto"
                />
              </Link>

              {/* Mobile & Desktop Integrated Links */}
              <div className="flex items-center gap-1 md:gap-2">
                {navLinks.map(({ path, icon: Icon, label, color }) => {
                  const active = isActive(path);
                  return (
                    <Link 
                      key={path} 
                      href={path} 
                      className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl transition-all ${
                        active 
                        ? activeColors[color].bg + ' ' + activeColors[color].icon 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                      <span className={`text-xs md:text-sm font-bold ${active ? 'block' : 'hidden md:block'}`}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2. Right: User Profile & Settings Toggle */}
            <div className="flex items-center gap-2">
              {/* Desktop Only Toggles */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mr-2">
                <LanguageToggle />
                <ThemeToggle />
                            {/* Messages & Notifications */}
              <div className="flex items-center gap-1 md:gap-2 mr-1 md:mr-2">
                <Link 
                  href={user ? "/messages" : "/login"} 
                  className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
                >
                  <Mail size={20} />
                  {user && unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                {user && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
                    >
                      <Bell size={20} />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-900 overflow-hidden z-[130]"
                        >
                          <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
                            {unreadNotificationsCount > 0 && (
                              <button 
                                onClick={markAllNotificationsAsRead}
                                className="text-xs text-emerald-600 font-bold hover:underline"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-gray-500 text-sm">
                                No notifications yet
                              </div>
                            ) : (
                              notifications.map(notif => (
                                <Link 
                                  key={notif.id}
                                  href={notif.type === 'message' ? '/messages' : `/post/${notif.related_id}`}
                                  onClick={() => {
                                    if (!notif.is_read) markNotificationAsRead(notif.id);
                                    setShowNotifications(false);
                                  }}
                                  className={`block p-4 border-b border-gray-50 dark:border-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${!notif.is_read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                                >
                                  <p className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {notif.message || (notif.type === 'comment_reply' ? 'Someone replied to your comment.' : 'New notification')}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {new Date(notif.created_at).toLocaleString()}
                                  </p>
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Profile/Settings Icon for Mobile (Drawer Trigger) */}
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 p-1 md:p-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-800 active:scale-90 transition-all"
              >
                {user ? (
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${user.profile_color || getProfileColor(user.name)} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                )}
                <Settings size={18} className="text-gray-400 mr-1 hidden md:block" />
                <Menu size={20} className="text-gray-500 md:hidden mr-1" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Spacer to avoid content overlap */}
      <div className="h-16 md:h-20" />

      {/* ── SETTINGS DRAWER (Mobile) ── */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white dark:bg-gray-950 z-[120] shadow-2xl p-6 border-l border-gray-100 dark:border-gray-900"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 hover:rotate-90 transition-transform">
                  <X size={20}/>
                </button>
              </div>

              <div className="space-y-6">
                {/* User Section */}
                {user ? (
                   <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                     <div className="flex items-center gap-3 mb-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${user.profile_color || getProfileColor(user.name)} flex items-center justify-center text-white font-bold`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Active Student</p>
                        </div>
                     </div>
                     <Link href="/profile" onClick={() => setShowSettings(false)} className="block w-full text-center py-2 bg-white dark:bg-gray-900 rounded-lg text-xs font-black text-emerald-600 shadow-sm">
                       View Profile
                     </Link>
                   </div>
                ) : (
                  <Link href="/login" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl font-bold text-gray-700 dark:text-gray-300">
                    <User size={20} /> Login / Register
                  </Link>
                )}

                {/* Preference Section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Preferences</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Language</span>
                      <LanguageToggle />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Dark Mode</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {/* Logout */}
                {user && (
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => { setShowSettings(false); confirmLogout(); }}
                      className="w-full flex items-center gap-3 p-4 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Bottom Decoration */}
              <div className="absolute bottom-8 left-0 right-0 text-center opacity-10">
                 <p className="text-[10px] font-black tracking-[0.3em]">KAFA'AH STUDY</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;