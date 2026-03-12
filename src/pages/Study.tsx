"use client";
import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import ScrollAnimation from "../components/ScrollAnimation";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";

interface Course {
  key: string;
  icon: string;
  path: string;
  color: string;
}

const Study: React.FC = () => {
  const { t, lang } = useLanguage();

  const courses: Course[] = useMemo(() => [
    { key: "ssc", icon: "📘", path: "/ssc", color: "from-blue-600 to-cyan-700" },
    { key: "hsc", icon: "📚", path: "/hsc", color: "from-indigo-600 to-purple-700" },
    { key: "admission", icon: "🎓", path: "/admission", color: "from-amber-500 to-orange-700" },
    { key: "quran", icon: "📖", path: "#", color: "from-emerald-600 to-green-800" },
    { key: "english", icon: "🇬🇧", path: "#", color: "from-rose-600 to-pink-800" },
    { key: "islamic", icon: "🕌", path: "#", color: "from-yellow-600 to-amber-700" },
  ], []);

  const handleClick = useCallback((path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (path === "#") {
      e.preventDefault();
      alert(t("study.coming.soon"));
    }
  }, [t]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 lg:py-16 px-4 transition-colors duration-500">
      <SEO 
        title={lang === "bn" ? "হোম - কাফআহ স্টাডি কর্নার" : "Home - Kafa'ah Study Corner"} 
        description="Premium Responsive Educational Platform"
        url="/"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4"
          >
            {t("head.study")}
          </motion.h1>
          <div className="h-1 w-16 bg-emerald-500 mx-auto rounded-full mb-6"></div>
        </header>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <ScrollAnimation key={course.key}>
              <Link
                href={course.path}
                onClick={(e) => handleClick(course.path, e)}
                className="group relative flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-none"
              >
                {/* 1. Animated Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-3xl`}></div>

                {/* 2. Advanced Icon Animation */}
                <div className="relative mb-6">
                   {/* Spinning Border on Hover */}
                  <div className={`absolute -inset-2 bg-gradient-to-tr ${course.color} rounded-2xl opacity-0 group-hover:opacity-20 group-hover:rotate-180 transition-all duration-700`}></div>
                  
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                    <span className="text-3xl lg:text-4xl drop-shadow-md">{course.icon}</span>
                  </div>
                </div>

                {/* 3. Text & Info */}
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t(`study.${course.key}`)}
                </h2>
                
                <div className="flex items-center justify-center">
                  {course.path === "#" ? (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      {t("study.coming.soon")}
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black flex items-center gap-1 group-hover:gap-3 transition-all duration-300">
                      {lang === "bn" ? "প্রবেশ করুন" : "Get Started"}
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </span>
                  )}
                </div>

                {/* 4. Bottom Border Animation */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent group-hover:w-full transition-all duration-500 rounded-b-3xl"></div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Footer Support - Minimal & Clean */}
        <footer className="mt-16 text-center">
          <p className="text-gray-400 dark:text-gray-600 text-[11px] lg:text-xs tracking-widest uppercase mb-4">
            Assistance & Support
          </p>
          <a 
            href="https://wa.me/01837103985" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-gray-600 dark:text-gray-300 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-sm shadow-sm"
          >
            <i className="fab fa-whatsapp text-emerald-500"></i>
            {lang === "bn" ? "যোগাযোগ করুন" : "Contact Us"}
          </a>
        </footer>
      </div>
    </main>
  );
};

export default Study;