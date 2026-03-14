"use client";
import React from "react";
import { motion } from "framer-motion";

interface TypingIndicatorProps {
  profileColor?: string;
  initials?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ profileColor, initials }) => {
  return (
    <div className="flex justify-start items-center gap-2">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: profileColor || '#3B82F6' }}
      >
        {initials}
      </div>
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex gap-1">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
