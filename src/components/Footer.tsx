"use client";
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-white dark:bg-[#0a0f1a] border-t border-gray-100 dark:border-white/5 py-10 z-0">
      {/* Subtle Islamic Geometric Pattern Overlay (Optional) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5.878 18.09h19.022l-15.39 11.18 5.878 18.09L30 36.18l-15.39 11.18 5.878-18.09-15.39-11.18h19.022L30 0z' fill='%239ca3af' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand & Copyright Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 mb-1">
               <div className="h-6 w-1 bg-emerald-600 rounded-full"></div>
               <span className="font-black text-sm tracking-[0.2em] text-gray-900 dark:text-white uppercase">
                 Kafa’ah
               </span>
            </div>
            <p className="text-[10px] md:text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] leading-relaxed text-center md:text-left">
              {lang === 'en' 
                ? '© 2026 Kafa’ah Islamic and Multiproject Company.' 
                : '© ২০২৬ কাফআহ ইসলামিক অ্যান্ড মাল্টিপ্রজেক্ট কোম্পানি।'}
              <span className="block md:inline md:ml-2 opacity-70">
                {lang === 'en' ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}
              </span>
            </p>
          </div>

          {/* Status & Verification Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Platform Status */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
              <div className="relative flex items-center justify-center">
                <span className="absolute h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="relative h-2 w-2 bg-emerald-500 rounded-full"></span>
              </div>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                System Online
              </span>
            </div>

            {/* Language/Global Indicator */}
            <div className="flex items-center gap-2 text-gray-300 dark:text-gray-600">
               <ShieldCheck size={16} className="text-emerald-600/50" />
               <span className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800"></span>
               <Globe size={16} />
            </div>
          </div>

        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;