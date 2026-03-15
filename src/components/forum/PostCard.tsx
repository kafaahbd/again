"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { MessageSquare, Heart, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import TextExpander from "../TextExpander"; // adjust path
import { getProfileColor, getTimeAgo } from "../../typescriptfile/utils";
import PostMenu from "./PostMenu";

interface PostCardProps {
  post: any;
  currentUserId?: string;
  onToggleReact: (postId: string) => void;
  onShare: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onBlock: (userId: string) => void;
  lang: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onToggleReact,
  onShare,
  onEdit,
  onDelete,
  onBlock,
  lang,
}: PostCardProps) => {
  const navigate = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwnPost = post.user_id === currentUserId;

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(post.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(post.id);
  };

  const handleBlock = () => {
    handleMenuClose();
    onBlock(post.user_id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-8 group"
    >
      <div className="flex justify-between items-start mb-3 md:mb-6">
        <div className="flex gap-2 md:gap-4">
          <div
            onClick={() => navigate.push(`/profile/${post.user_id}`)}
            className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-tr ${
              post.author_profile_color || getProfileColor(post.author_name)
            } flex items-center justify-center text-white font-black text-base md:text-lg border-2 border-white dark:border-gray-700 uppercase cursor-pointer shadow-sm`}
          >
            {post.author_name?.[0]}
          </div>
          <div>
            <h4
              onClick={() => navigate.push(`/profile/${post.user_id}`)}
              className="font-black text-gray-900 dark:text-white leading-none text-sm md:text-base cursor-pointer hover:text-blue-600 transition-colors"
            >
              {post.author_name}
            </h4>
            <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2">
              <span className="text-[8px] md:text-[9px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 md:px-2 py-0.5 rounded-md uppercase">
                {post.category}
              </span>
              <span className="text-[8px] md:text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 md:px-2 py-0.5 rounded-md uppercase">
                {post.batch}
              </span>
              <span className="text-[8px] md:text-[9px] font-bold text-gray-400 ml-1">
                  {getTimeAgo(post.created_at, lang as 'en' | 'bn')}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="text-gray-400 p-1 md:p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-all"
          >
            <MoreHorizontal size={18} className="md:w-5 md:h-5" />
          </button>

          <PostMenu
            isOpen={menuOpen}
            onClose={handleMenuClose}
            postId={post.id}
            isOwnPost={isOwnPost}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBlock={handleBlock}
            lang={lang}
          />
        </div>
      </div>

      <TextExpander
        text={post.content}
        limit={150}
        className="text-gray-700 dark:text-gray-300 text-sm md:text-[16px] leading-relaxed mb-4 md:mb-7 font-medium whitespace-pre-wrap"
      />

      {post.image_url && (
        <div className="mb-4 md:mb-7 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <img src={post.image_url} alt="Post attachment" className="w-full max-h-[500px] object-contain bg-gray-50 dark:bg-gray-950" />
        </div>
      )}

      <div className="flex items-center gap-6 md:gap-8 pt-3 md:pt-6 border-t border-gray-50 dark:border-gray-700/30">
        <button
          onClick={() => onToggleReact(post.id)}
          className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-black transition-all ${
            post.is_reacted ? "text-red-500" : "text-gray-400"
          }`}
        >
          <Heart
            size={18}
            className="md:w-[22px] md:h-[22px]"
            fill={post.is_reacted ? "currentColor" : "none"}
          />{" "}
          {post.react_count || 0}
        </button>
        <button
          onClick={() => navigate.push(`/post/${post.id}`)}
          className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-black text-gray-400 hover:text-blue-600 transition-colors"
        >
          <MessageSquare size={18} className="md:w-[22px] md:h-[22px]" />{" "}
          {post.comment_count || 0}
        </button>
        <button
          onClick={() => onShare(post.id)}
          className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-black text-gray-400 hover:text-green-600 transition-colors ml-auto"
        >
          <Share2 size={16} className="md:w-5 md:h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default PostCard;