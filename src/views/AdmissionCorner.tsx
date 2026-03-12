"use client";
import React, { useMemo } from "react";
import Link from "next/link";

import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import SEO from "../components/SEO";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  path: string;
}

interface Category {
  name: string;
  icon: string;
  gradient: string;
  accent: string;
  hoverBorder: string;
  subjects: Subject[];
}

const AdmissionCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const categories: Category[] = useMemo(() => [
    {
      name: t("study.admission.engineering"),
      icon: "⚙️",
      gradient: "from-emerald-600 to-teal-700",
      accent: "group-hover/sub:text-emerald-600 dark:group-hover/sub:text-emerald-400",
      hoverBorder: "hover:border-emerald-500/30",
      subjects: [
        { name: t("study.admission.physics"), path: "/exam?group=admission&subject=engineering-physics" },
        { name: t("study.admission.chemistry"), path: "/exam?group=admission&subject=engineering-chemistry" },
        { name: t("study.admission.highermath"), path: "/exam?group=admission&subject=engineering-highermath" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=engineering-english" },
      ],
    },
    {
      name: t("study.admission.medical"),
      icon: "🏥",
      gradient: "from-rose-600 to-red-700",
      accent: "group-hover/sub:text-rose-600 dark:group-hover/sub:text-rose-400",
      hoverBorder: "hover:border-rose-500/30",
      subjects: [
        { name: t("study.admission.physics"), path: "/exam?group=admission&subject=medical-physics" },
        { name: t("study.admission.chemistry"), path: "/exam?group=admission&subject=medical-chemistry" },
        { name: t("study.admission.biology"), path: "/exam?group=admission&subject=medical-biology" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=medical-english" },
        { name: t("study.admission.gk"), path: "/exam?group=admission&subject=medical-gk" },
      ],
    },
    {
      name: t("study.admission.university"),
      icon: "🏛️",
      gradient: "from-amber-600 to-orange-700",
      accent: "group-hover/sub:text-amber-600 dark:group-hover/sub:text-amber-400",
      hoverBorder: "hover:border-amber-500/30",
      subjects: [
        { name: t("study.admission.bangla"), path: "/exam?group=admission&subject=university-bangla" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=university-english" },
        { name: t("study.admission.gk"), path: "/exam?group=admission&subject=university-gk" },
        { name: t("study.hsc.subjects.history"), path: "/exam?group=admission&subject=university-history" },
        { name: t("study.hsc.subjects.economics"), path: "/exam?group=admission&subject=university-economics" },
      ],
    },
  ], [t]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 py-8 lg:py-12 px-4 transition-colors relative overflow-hidden">
      {/* Decorative Islamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-exercise.png')]"></div>

      <SEO 
        title={lang === "bn" ? "এডমিশন কর্নার - কাফআহ" : "Admission Corner - Kafa'ah"} 
        image="https://study.kafaahbd.com/admis.jpg"
        url="/admission"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <header className="mb-10 lg:mb-14">
          <Link
            href="/"
            className="group inline-flex items-center text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 hover:text-emerald-600 transition-colors mb-6"
          >
            <i className="fas fa-chevron-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {t("study.back")}
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-100 dark:border-gray-900 pb-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full mb-4"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">Gateway to Excellence</span>
              </motion.div>
              <h1 className="text-4xl lg:text-6xl font-serif font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t("study.admission.title")}
              </h1>
              <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("study.admission.subtitle")}
              </p>
            </div>
          </div>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <ScrollAnimation key={idx}>
              <div className="group bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] h-full flex flex-col relative overflow-hidden">
                
                {/* Header with Geometric Touch */}
                <div className={`bg-gradient-to-br ${category.gradient} p-8 text-white relative`}>
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-8 -translate-y-8">
                     <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L100 50 L50 100 L0 50 Z"/></svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 drop-shadow-md">{category.icon}</div>
                    <h2 className="text-2xl font-black tracking-tight">{category.name}</h2>
                    <div className="h-1 w-8 bg-white/30 rounded-full mt-2"></div>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-5 lg:p-6 space-y-2.5 flex-grow">
                  {category.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      href={subject.path}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800 border border-transparent ${category.hoverBorder} hover:shadow-sm transition-all group/sub active:scale-[0.98]`}
                    >
                      <span className={`font-bold text-gray-700 dark:text-gray-300 ${category.accent} transition-colors text-sm lg:text-[15px]`}>
                        {subject.name}
                      </span>
                      <motion.div 
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 ${category.accent}`}
                      >
                        <i className="fas fa-chevron-right text-[8px]"></i>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Footer Badge */}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-t border-gray-50 dark:border-gray-800 pt-4">
                    <i className="fas fa-lock text-[8px]"></i>
                    Premium Content Loading
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Feature Highlights - Slim & Modern */}
        <div className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { icon: "fa-calendar-alt", label: "Calendar", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20" },
            { icon: "fa-vial", label: "Model Test", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20" },
            { icon: "fa-file-alt", label: "Analysis", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" },
            { icon: "fa-headset", label: "Support", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20" },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] text-center shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-3`}>
                <i className={`fas ${f.icon}`}></i>
              </div>
              <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tighter">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Support Note - Premium Islamic Quote Style */}
        <div className="mt-16 lg:mt-24 relative">
          <div className="absolute inset-0 bg-emerald-600/5 dark:bg-emerald-400/5 rounded-[3rem] -rotate-1 scale-105"></div>
          <div className="relative bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] p-10 lg:p-16 text-center shadow-xl shadow-emerald-900/5">
            <div className="w-12 h-[2px] bg-emerald-500 mx-auto mb-8"></div>
            <p className="text-xl lg:text-3xl font-serif text-gray-800 dark:text-gray-200 leading-relaxed italic max-w-4xl mx-auto">
               "{lang === "bn"
                ? "ইঞ্জিনিয়ারিং, মেডিকেল ও ইউনিভার্সিটি এডমিশনের জন্য সম্পূর্ণ প্রস্তুতি খুব শীঘ্রই আসছে ইনশাআল্লাহ।"
                : "Complete preparation for Engineering, Medical, and University Admission will be available very soon InshaAllah."}"
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
               <div className="w-2 h-2 rotate-45 bg-emerald-500"></div>
               <div className="w-2 h-2 rotate-45 bg-emerald-200 dark:bg-emerald-800"></div>
               <div className="w-2 h-2 rotate-45 bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCorner;