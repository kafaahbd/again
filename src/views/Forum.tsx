"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, X, SlidersHorizontal, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import PostCreator from "../components/forum/PostCreator";
import FilterBar from "../components/forum/FilterBar";
import FilterModal from "../components/forum/FilterModal";
import ForumFeed from "../components/forum/ForumFeed";
import { ChatUser } from "../types/messages";

const Forum: React.FC = () => {
  const { user, api } = useAuth();
  const { lang } = useLanguage();
  const navigate = useRouter();

  // --- States ---
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeBatch, setActiveBatch] = useState<string>("All");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null }>({
    isOpen: false,
    postId: null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false); // New Search Toggle State

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<ChatUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // --- Search Logic ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userSearchQuery.trim().length > 1) {
        setIsSearchingUsers(true);
        try {
          const response = await api.get(`/messages/search?q=${userSearchQuery}`);
          setUserSearchResults(response.data);
        } catch (err) {
          console.error("Error searching users:", err);
        } finally {
          setIsSearchingUsers(false);
        }
      } else {
        setUserSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearchQuery, api]);

  // --- Fetch Logic ---
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await forumService.getPosts(activeCategory, activeBatch);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeBatch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Action Handlers ---
  const handleToggleReact = async (postId: string) => {
    if (!user) {
      setToast({ msg: lang === "bn" ? "রিঅ্যাক্ট দিতে লগইন করুন" : "Login to react", type: "error" });
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, is_reacted: !p.is_reacted, react_count: !p.is_reacted ? Number(p.react_count) + 1 : Number(p.react_count) - 1 } : p))
    );
    try { await forumService.toggleReact(postId); } catch { fetchPosts(); }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast({ msg: lang === "bn" ? "লিঙ্ক কপি হয়েছে!" : "Link copied!", type: "success" });
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.postId) return;
    try {
      await forumService.deletePost(deleteModal.postId);
      setToast({ msg: lang === "bn" ? "পোস্ট ডিলিট হয়েছে" : "Post removed", type: "success" });
      setDeleteModal({ isOpen: false, postId: null });
      fetchPosts();
    } catch { setToast({ msg: "Error", type: "error" }); }
  };

  const handleBlock = async (userId: string) => {
    try {
      await forumService.blockUser(userId);
      setToast({ msg: lang === "bn" ? "ইউজার ব্লক করা হয়েছে" : "User blocked", type: "success" });
      fetchPosts();
    } catch { setToast({ msg: "Failed to block", type: "error" }); }
  };

  const categories = ["Common", "Science", "Arts", "Commerce"];
  const filterCategories = ["All", ...categories];
  const batches = ["All", "SSC", "HSC"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] pb-10 transition-colors duration-500">
      <SEO title={lang === "bn" ? "ফোরাম - কাফআহ" : "Forum - Kafa'ah"} url="/forum" />

      {/* --- Islamic Floating Header --- */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <h1 className="text-lg font-black text-gray-800 dark:text-white tracking-tight uppercase">
              {lang === "bn" ? "ফোরাম" : "Forum"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`p-2 rounded-xl transition-all ${isSearchVisible ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
            >
              {isSearchVisible ? <X size={22} /> : <Search size={22} />}
            </button>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-xl transition-all"
            >
              <SlidersHorizontal size={22} />
            </button>
          </div>
        </div>

        {/* --- Dynamic Search Overlay --- */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto px-4 pb-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder={lang === "bn" ? "ইউজার খুঁজুন..." : "Find members..."}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {userSearchQuery.length > 1 && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-64 overflow-y-auto">
                  {isSearchingUsers ? (
                    <div className="p-4 text-center text-xs text-emerald-500 animate-pulse font-bold">SEARCHING...</div>
                  ) : userSearchResults.length > 0 ? (
                    userSearchResults.map((u) => (
                      <Link 
                        key={u.id} 
                        href={`/messages?userId=${u.id}`}
                        className="flex items-center justify-between p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: u.profile_color || '#10B981' }}>{u.name[0]}</div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-[10px] text-gray-500">@{u.username}</p>
                          </div>
                        </div>
                        <MessageSquare size={16} className="text-emerald-500" />
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-center text-xs text-gray-400">No users found</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-3xl mx-auto px-3 md:px-4 mt-6">
        {/* Modals & Alerts */}
        <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, postId: null })} onConfirm={confirmDelete} title={lang === "bn" ? "পোস্ট ডিলিট করবেন?" : "Delete Post?"} />
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {/* User Engagement Section */}
        {user ? (
          <PostCreator userName={user?.name} userProfileColor={user?.profile_color} placeholder={lang === "bn" ? "আজকের কোনো ইসলামী জ্ঞান শেয়ার করুন..." : "Share some Islamic knowledge..."} />
        ) : (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 mb-6 shadow-lg text-white">
            <h3 className="text-lg font-bold mb-1">{lang === "bn" ? "আলোচনায় অংশ নিন" : "Join the Ummah"}</h3>
            <p className="text-emerald-50 text-xs mb-4 opacity-90">{lang === "bn" ? "পোস্ট করতে এবং মন্তব্য করতে আপনার একাউন্ট ব্যবহার করুন।" : "Login to participate in community discussions."}</p>
            <button onClick={() => navigate.push("/login")} className="px-6 py-2 bg-white text-emerald-700 font-bold rounded-xl text-sm transition-transform active:scale-95 shadow-md">
              {lang === "bn" ? "লগইন করুন" : "Login"}
            </button>
          </div>
        )}

        {/* --- Standard Filters (Original Feature Restored) --- */}
        <FilterBar
          activeCategory={activeCategory}
          activeBatch={activeBatch}
          onClearFilters={() => { setActiveCategory("All"); setActiveBatch("All"); }}
          onOpenFilterModal={() => setIsFilterOpen(true)}
          lang={lang}
        />

        {/* --- Main Forum Feed --- */}
        <div className="mt-6">
          <ForumFeed
            posts={posts}
            loading={loading}
            currentUserId={user?.id}
            onToggleReact={handleToggleReact}
            onShare={handleShare}
            onEdit={(id) => navigate.push(`/edit-post/${id}`)}
            onDelete={(id) => setDeleteModal({ isOpen: true, postId: id })}
            onBlock={handleBlock}
            lang={lang}
          />
        </div>
      </div>

      {/* Filter Modal (Restored) */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeCategory={activeCategory}
        activeBatch={activeBatch}
        categories={filterCategories}
        batches={batches}
        onCategoryChange={setActiveCategory}
        onBatchChange={setActiveBatch}
        lang={lang}
      />
    </div>
  );
};

export default Forum;