import { motion, AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import PostCard from "./PostCard";

interface ForumFeedProps {
  posts: any[];
  loading: boolean;
  currentUserId?: string;
  onToggleReact: (postId: string) => void;
  onShare: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onBlock: (userId: string) => void;
  lang: string;
}

const ForumFeed = ({
  posts,
  loading,
  currentUserId,
  onToggleReact,
  onShare,
  onEdit,
  onDelete,
  onBlock,
  lang,
}: ForumFeedProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 md:h-16 md:w-16 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-blue-600 dark:border-t-blue-500"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-4 md:mt-6 text-gray-400 dark:text-gray-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] animate-pulse">
          {lang === "bn" ? "পোস্ট লোড হচ্ছে..." : "Loading posts..."}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 text-gray-400 font-black uppercase tracking-widest"
      >
        <Inbox size={50} className="mx-auto mb-4 opacity-20" />
        {lang === "bn" ? "কোনো পোস্ট পাওয়া যায়নি" : "No posts found"}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-3 md:space-y-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onToggleReact={onToggleReact}
            onShare={onShare}
            onEdit={onEdit}
            onDelete={onDelete}
            onBlock={onBlock}
            lang={lang}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default ForumFeed;