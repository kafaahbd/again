"use client";
import Link from "next/link";

import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-gray-900 transition-colors overflow-hidden">
      <div className="relative max-w-2xl w-full text-center">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-green-600 to-green-100 dark:from-blue-600 dark:to-gray-900 opacity-20 dark:opacity-40">
            404
          </h1>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative -mt-24 md:-mt-32 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/50 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none"
        >
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 border border-amber-100 dark:border-amber-800 animate-bounce">
            <i className="fas fa-map-signs text-3xl"></i>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            {t('notFound.title') || (lang === 'bn' ? 'রাস্তা হারিয়ে ফেলেছেন?' : 'Are you lost?')}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
            {t('notFound.message') || (lang === 'bn' 
              ? 'দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি অথবা সরিয়ে ফেলা হয়েছে।' 
              : 'The page you are looking for does not exist or has been moved to a new destination.')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {t('notFound.goHome') || 'Go Home'}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-transparent border-2 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              {lang === 'bn' ? 'পেছনে যান' : 'Go Back'}
            </button>
          </div>
        </motion.div>

        {/* Floating Icons for Decoration */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-10 left-10 text-green-300 dark:text-blue-900/30 text-6xl -z-10 opacity-50"
        >
          <i className="fas fa-book-open"></i>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-10 right-10 text-green-300 dark:text-blue-900/30 text-6xl -z-10 opacity-50"
        >
          <i className="fas fa-graduation-cap"></i>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;