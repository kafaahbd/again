"use client";
import React from "react";
import { motion } from "framer-motion";

interface TypingIndicatorProps {
  profileColor?: string;
  initials?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ profileColor, initials }) => {
  return (
    <div className="flex justify-start items-end gap-2 mb-4">
      {/* User Avatar - Squircle Shape */}
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm"
        style={{ 
          backgroundColor: profileColor || '#10B981',
          background: `linear-gradient(135deg, ${profileColor || '#10B981'} 0%, #059669 100%)`
        }}
      >
        {initials?.toUpperCase()}
      </div>

      {/* Typing Bubble */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.8, 
                delay: index * 0.15,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"
            />
          ))}
        </div>
        
        {/* Optional: Subtle text */}
        <span className="ml-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Typing
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;