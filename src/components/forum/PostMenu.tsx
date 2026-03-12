import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Trash2, ShieldAlert } from "lucide-react";

interface PostMenuProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  isOwnPost: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBlock: () => void;
  lang: string;
}

const PostMenu = ({
  isOpen,
  isOwnPost,
  onEdit,
  onDelete,
  onBlock,
  lang,
}: PostMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden p-1"
        >
          {isOwnPost ? (
            <>
              <button
                onClick={onEdit}
                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-xl transition-all"
              >
                <Edit3 size={16} /> {lang === "bn" ? "এডিট করুন" : "Edit Post"}
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <Trash2 size={16} /> {lang === "bn" ? "ডিলিট করুন" : "Delete Post"}
              </button>
            </>
          ) : (
            <button
              onClick={onBlock}
              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            >
              <ShieldAlert size={16} /> {lang === "bn" ? "ব্লক করুন" : "Block User"}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostMenu;