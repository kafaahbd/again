"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Search, MessageSquare } from "lucide-react";
import Link from "next/link";
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

const Forum: React.FC = () => {
  const { user, api } = useAuth();
  const { lang } = useLanguage();
  const navigate = useRouter();

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

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // User search logic
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

  const categories = ["Common", "Science", "Arts", "Commerce"];
  const filterCategories = ["All", ...categories];
  const batches = ["All", "SSC", "HSC"]; // assuming these are the batches

  const fetchPosts = React.useCallback(async () => {
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

  const handleToggleReact = async (postId: string) => {
    if (!user) {
      setToast({
        msg: lang === "bn" ? "রিঅ্যাক্ট দিতে লগইন করুন" : "Login to react",
        type: "error",
      });
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const is_reacted = !p.is_reacted;
          const react_count = is_reacted ? Number(p.react_count) + 1 : Number(p.react_count) - 1;
          return { ...p, is_reacted, react_count };
        }
        return p;
      })
    );

    try {
      await forumService.toggleReact(postId);
    } catch (err) {
      console.error(err);
      fetchPosts(); // rollback
    }
  };

  const handleShare = (postId: string) => {
    const baseUrl = window.location.href.split("/forum")[0];
    const url = `${baseUrl}/post/${postId}`;

    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((resolve, reject) => {
          if (document.execCommand("copy")) {
            resolve(true);
          } else {
            reject(new Error("Copy failed"));
          }
          document.body.removeChild(textArea);
        });
      }
    };

    copyToClipboard(url)
      .then(() => {
        setToast({ msg: lang === "bn" ? "লিঙ্ক কপি হয়েছে!" : "Link copied!", type: "success" });
      })
      .catch(() => {
        setToast({ msg: lang === "bn" ? "কপি করা সম্ভব হয়নি" : "Failed to copy", type: "error" });
      });
  };

  const handleDeleteClick = (postId: string) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const confirmDelete = async () => {
    if (!deleteModal.postId) return;
    try {
      await forumService.deletePost(deleteModal.postId);
      setToast({ msg: lang === "bn" ? "পোস্ট ডিলিট হয়েছে" : "Post removed", type: "success" });
      setDeleteModal({ isOpen: false, postId: null });
      fetchPosts();
    } catch {
      setToast({ msg: "Error", type: "error" });
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      await forumService.blockUser(userId);
      setToast({ msg: lang === "bn" ? "ইউজার ব্লক করা হয়েছে" : "User blocked", type: "success" });
      fetchPosts();
    } catch {
      setToast({ msg: lang === "bn" ? "ব্লক করা সম্ভব হয়নি" : "Failed to block", type: "error" });
    }
  };

  const handleEdit = (postId: string) => {
  navigate.push(`/edit-post/${postId}`); // navigate() এর বদলে .push() হবে
};

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveBatch("All");
  };

  return (
    <div className="max-w-3xl mx-auto pt-0 pb-10 md:pt-4 md:pb-10 px-3 md:px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <SEO
        title={lang === "bn" ? "ফোরাম - কাফআহ" : "Forum - Kafa'ah"}
        image="https://study.kafaahbd.com/forum.jpg"
        url="/forum"
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={confirmDelete}
        title={lang === "bn" ? "পোস্ট ডিলিট করবেন?" : "Delete Post?"}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {user ? (
        <PostCreator
          userName={user?.name}
          userProfileColor={user?.profile_color}
          placeholder={lang === "bn" ? "আপনার মনে কি আছে?" : "What's on your mind?"}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {lang === "bn" ? "পোস্ট করতে লগইন করুন" : "Login to post"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {lang === "bn" ? "ফোরামে আলোচনায় অংশ নিতে আপনার অ্যাকাউন্টে লগইন করুন।" : "Login to your account to participate in the forum discussions."}
          </p>
          <button
            onClick={() => navigate.push("/login")}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            {lang === "bn" ? "লগইন করুন" : "Login"}
          </button>
        </div>
      )}

      {/* User Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={lang === "bn" ? "ইউজার খুঁজুন (নাম বা ইউজারনেম)..." : "Find users (name or username)..."}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>

        {userSearchQuery.length > 1 && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {isSearchingUsers ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userSearchResults.length > 0 ? (
              userSearchResults.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: u.profile_color || '#10B981' }}
                    >
                      {u.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/messages?userId=${u.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>{lang === "bn" ? "মেসেজ" : "Message"}</span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-400 text-xs">
                {lang === "bn" ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"}
              </p>
            )}
          </div>
        )}
      </div>

      <FilterBar
        activeCategory={activeCategory}
        activeBatch={activeBatch}
        onClearFilters={clearFilters}
        onOpenFilterModal={() => setIsFilterOpen(true)}
        lang={lang}
      />

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

      <ForumFeed
        posts={posts}
        loading={loading}
        currentUserId={user?.id}
        onToggleReact={handleToggleReact}
        onShare={handleShare}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onBlock={handleBlock}
        lang={lang}
      />
    </div>
  );
};

export default Forum;