"use client";
import { useRouter } from "next/navigation";

import { MessageSquare, Heart, Share2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getProfileColor, getTimeAgo } from "../../typescriptfile/utils";

interface PostsListProps {
  userPosts: any[];
  visiblePosts: any[];
  isPostsLoading: boolean;
  postsToShow: number;
  onShowMore: () => void;
  onToggleReact: (postId: string) => void;
  profileUser: any;
}

const PostsList = ({
  userPosts,
  visiblePosts,
  isPostsLoading,
  
  onShowMore,
  onToggleReact,
  profileUser,
}: PostsListProps) => {
  const { lang } = useLanguage();
  const navigate = useRouter();

  if (isPostsLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-sm font-bold">
        No posts yet.
      </div>
    );
  }

  return (
    <>
      {visiblePosts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${
                  profileUser.profile_color || getProfileColor(profileUser.name)
                } flex items-center justify-center text-white font-black text-base border-2 border-white dark:border-gray-700 uppercase shadow-sm`}
              >
                {profileUser.name[0]}
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white leading-none text-sm">
                  {profileUser.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[8px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md uppercase">
                    {post.category}
                  </span>
                  <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded-md uppercase">
                    {post.batch}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 ml-1">
                    {getTimeAgo(post.created_at, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 font-medium whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-700/30">
            <button
              onClick={() => onToggleReact(post.id)}
              className={`flex items-center gap-2 text-xs font-black transition-all ${
                post.is_reacted ? "text-red-500" : "text-gray-400"
              }`}
            >
              <Heart size={18} fill={post.is_reacted ? "currentColor" : "none"} />{" "}
              {post.react_count || 0}
            </button>
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 transition-colors"
            >
              <MessageSquare size={18} /> {post.comment_count || 0}
            </button>
            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-green-600 transition-colors ml-auto">
              <Share2 size={16} />
            </button>
          </div>
        </motion.div>
      ))}

      {userPosts.length > visiblePosts.length && (
        <button
          onClick={onShowMore}
          className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest hover:bg-gray-200 transition-colors"
        >
          {lang === "bn" ? "আরও দেখুন" : "Show More"}
        </button>
      )}
    </>
  );
};

export default PostsList;