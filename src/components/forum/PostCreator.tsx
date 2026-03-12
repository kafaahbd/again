"use client";
import { useRouter } from "next/navigation";

import { Send } from "lucide-react";
import { getProfileColor } from "../../typescriptfile/utils";
import { motion } from "framer-motion";

interface PostCreatorProps {
  userName?: string;
  userProfileColor?: string;
  placeholder?: string;
}

const PostCreator = ({ userName, userProfileColor, placeholder }: PostCreatorProps) => {
  const navigate = useRouter();
  const initial = userName?.[0]?.toUpperCase() || "?";

  return (
    <motion.div
      onClick={() => navigate.push("/create-post")}
      className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[35px] shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 mb-5 md:mb-8 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all"
    >
      <div className="flex gap-3 md:gap-4 items-center">
        <div
          className={`h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-tr ${
            userProfileColor || getProfileColor(userName || "")
          } flex items-center justify-center text-white font-black text-sm md:text-xl shadow-md shadow-blue-500/20 shrink-0 border-2 border-white dark:border-gray-700`}
        >
          {initial}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 border border-gray-100 dark:border-gray-800">
          <p className="text-gray-400 dark:text-gray-500 font-medium text-xs md:text-base">
            {placeholder || "What's on your mind?"}
          </p>
        </div>
        <div className="text-blue-600 dark:text-blue-400 pr-1">
          <Send size={18} className="md:w-5 md:h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default PostCreator;