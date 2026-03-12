"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const { user } = useAuth();
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

  const categories = ["Common", "Science", "Arts", "Commerce"];
  const filterCategories = ["All", ...categories];
  const batches = ["All", "SSC", "HSC"]; // assuming these are the batches

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await forumService.getPosts(activeCategory, activeBatch);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, activeBatch]);

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
    navigate(`/edit-post/${postId}`);
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

      <PostCreator
        userName={user?.name}
        userProfileColor={user?.profile_color}
        placeholder={lang === "bn" ? "আপনার মনে কি আছে?" : "What's on your mind?"}
      />

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