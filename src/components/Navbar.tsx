"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Zap,
  Settings,
  User,
  LogOut,
  X,
  Menu,
  Bell,
  Mail,
} from "lucide-react";
import { getProfileColor } from "../typescriptfile/utils";
import { useSocket } from "../contexts/SocketContext";

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { user, confirmLogout } = useAuth();
  const {
    unreadMessagesCount,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useSocket();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = useMemo(
    () => [
      { path: "/", icon: BookOpen, label: t("nav.study"), color: "emerald" },
      { path: "/forum", icon: MessageSquare, label: t("nav.forum"), color: "emerald" }, // Consistently Emerald
      { path: "/mistakes", icon: Zap, label: t("nav.mistakes"), color: "rose" },
    ],
    [t]
  );

  const activeColors: Record<string, { bg: string; icon: string }> = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      icon: "text-emerald-600 dark:text-emerald-400",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-500/10",
      icon: "text-rose-600 dark:text-rose-400",
    },
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-md bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* 1. Left: Logo (Desktop Only) & Navigation */}
            <div className="flex items-center gap-2 md:gap-8">
              <Link href="/" className="flex-shrink-0 hidden md:block">
                <img
                  src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
                  alt="Logo"
                  className="h-10 w-auto"
                />
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                {navLinks.map(({ path, icon: Icon, label, color }) => {
                  const active = isActive(path);
                  return (
                    <Link
                      key={path}
                      href={path}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-200 ${
                        active
                          ? `${activeColors[color]?.bg || activeColors.emerald.bg} ${activeColors[color]?.icon || activeColors.emerald.icon}`
                          : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                      }`}
                    >
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                      <span className="text-sm font-bold hidden sm:block">
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2. Right: Action Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              
              {/* Inbox */}
              <Link
                href={user ? "/messages" : "/login"}
                className="relative p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
              >
                <Mail size={22} />
                {user && unreadMessagesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-950">
                    {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
                  >
                    <Bell size={22} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-950">
                        {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Logic (Animations simplified for brevity) */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[130]"
                      >
                        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                          <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">Notifications</h4>
                          <button onClick={markAllNotificationsAsRead} className="text-[10px] text-emerald-600 font-black hover:underline uppercase">Clear All</button>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 text-xs font-medium">No new alerts</div>
                          ) : (
                            notifications.map((notif) => (
                              <Link
                                key={notif.id}
                                href={notif.type === "message" ? "/messages" : `/post/${notif.related_id}`}
                                onClick={() => { if (!notif.is_read) markNotificationAsRead(notif.id); setShowNotifications(false); }}
                                className={`block p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors ${!notif.is_read ? "bg-emerald-50/20 dark:bg-emerald-500/5" : ""}`}
                              >
                                <p className={`text-sm ${!notif.is_read ? "font-bold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{notif.message}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-[9px] text-gray-400 uppercase font-bold">{new Date(notif.created_at).toLocaleTimeString()}</p>
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      deleteNotification(notif.id);
                                    }}
                                    className="text-[9px] font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                                  >
                                    {lang === "bn" ? "মুছে ফেলুন" : "Delete"}
                                  </button>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* PC Desktop Toggles (HIDDEN ON MOBILE) */}
              <div className="hidden md:flex items-center bg-gray-100/50 dark:bg-gray-900 p-1 rounded-xl">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              {/* User/Menu Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 p-1 md:p-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 active:scale-95 transition-all shadow-sm"
              >
                {user ? (
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${user.profile_color || getProfileColor(user.name)} flex items-center justify-center text-white text-xs font-black shadow-inner`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center text-gray-500"><User size={20} /></div>
                )}
                <Menu size={20} className="text-gray-500 mr-1" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16 md:h-20" />

      {/* Settings Drawer */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-gray-950 z-[120] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Menu</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500"><X size={20} /></button>
              </div>

              <div className="flex-1 space-y-6">
                {user ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                    <div className={`h-12 w-12 mx-auto rounded-2xl bg-gradient-to-tr ${user.profile_color || getProfileColor(user.name)} flex items-center justify-center text-white font-black text-xl mb-3`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <Link href="/profile" onClick={() => setShowSettings(false)} className="mt-3 block py-2 bg-white dark:bg-gray-900 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 shadow-sm uppercase">Profile</Link>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setShowSettings(false)} className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl font-bold text-gray-700 dark:text-gray-300">Login</Link>
                )}

                {/* Mobile Preference (Only visible on mobile/tablet to avoid PC duplication) */}
                <div className="md:hidden space-y-3 pt-4 border-t border-gray-100 dark:border-gray-900">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Display Settings</p>
                   <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Language</span>
                      <LanguageToggle />
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Theme</span>
                      <ThemeToggle />
                   </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Options</p>
                  <button onClick={() => { setShowSettings(false); /* logic */ }} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-all"><Settings size={18} /> Account Settings</button>
                  {user && (
                    <button onClick={() => { setShowSettings(false); confirmLogout(); }} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"><LogOut size={18} /> Logout</button>
                  )}
                </div>
              </div>

              <div className="pt-6 text-center opacity-20"><p className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-500">Kafa'ah Study</p></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;