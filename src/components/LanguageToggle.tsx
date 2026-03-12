"use client";
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const LanguageToggle: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center bg-gray-200/50 dark:bg-gray-700/50 h-8 w-[72px] rounded-xl p-1 shadow-inner focus:outline-none transition-colors duration-300"
      aria-label="Toggle Language"
    >
      {/* Sliding Background Indicator */}
      <motion.div
        className="absolute h-6 w-[32px] bg-white dark:bg-gray-900 rounded-lg shadow-sm"
        animate={{ x: lang === 'bn' ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Language Labels */}
      <div className="relative z-10 flex w-full justify-between items-center px-1 text-[10px] font-black uppercase tracking-tighter">
        <span className={`w-8 text-center transition-colors duration-300 ${lang === 'en' ? 'text-green-600 dark:text-blue-400' : 'text-gray-400'}`}>
          EN
        </span>
        <span className={`w-8 text-center transition-colors duration-300 ${lang === 'bn' ? 'text-green-600 dark:text-blue-400' : 'text-gray-400'}`}>
          বাং
        </span>
      </div>
    </button>
  );
};

export default LanguageToggle;