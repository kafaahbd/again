"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import { forumService } from '../services/forumService';
import { ArrowLeft, ShieldAlert, UserCheck, Search } from 'lucide-react';
import { getProfileColor } from '../typescriptfile/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const BlockedUsersPage: React.FC = () => {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const data = await forumService.getBlockedUsers();
                setBlockedUsers(data || []);
            } catch (err) {
                console.error("Error fetching blocked users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (blockedUserId: string) => {
        try {
            await forumService.unblockUser(blockedUserId);
            setBlockedUsers(prev => prev.filter(u => u.id !== blockedUserId));
        } catch {
            alert("Failed to unblock");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 p-4 pt-10 transition-colors duration-500">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate.back()} 
                    className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-8 font-black text-[10px] tracking-widest uppercase transition-all"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                    {lang === "bn" ? "ফিরে যান" : "Back"}
                </button>

                {/* Header Section */}
                <header className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-xl">
                            <ShieldAlert className="text-red-600" size={28} />
                        </div>
                        {lang === "bn" ? "ব্লক লিস্ট" : "Blocked Users"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {lang === "bn" 
                            ? "যাদের ব্লক করেছেন তারা আপনার পোস্ট বা প্রোফাইল দেখতে পাবে না।" 
                            : "Manage users you've restricted from interacting with you."}
                    </p>
                </header>

                {/* Users List Container */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
                    <div className="p-2">
                        <AnimatePresence mode="popLayout">
                            {blockedUsers.length > 0 ? (
                                blockedUsers.map((blockedUser) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        key={blockedUser.id} 
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${getProfileColor(blockedUser.name)} flex items-center justify-center text-white font-black text-lg border-2 border-white dark:border-gray-800 shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3`}>
                                                {blockedUser.name[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{blockedUser.name}</p>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider">
                                                    @{blockedUser.username}
                                                </p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleUnblock(blockedUser.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-sm"
                                        >
                                            <UserCheck size={14} />
                                            {lang === "bn" ? "আনব্লক" : "Unblock"}
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                !loading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="text-gray-300" size={30} />
                                        </div>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm font-bold">
                                            {lang === "bn" ? "কোনো ইউজার ব্লক করা নেই" : "No users in your block list"}
                                        </p>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Tip */}
                <footer className="mt-8 text-center">
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.2em]">
                        Kafa'ah Community Safety
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default BlockedUsersPage;