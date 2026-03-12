"use client";
import React from "react";
import Link from "next/link";

import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import SEO from "../components/SEO";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  path: string;
}

interface Group {
  name: string;
  icon: string;
  subjects: Subject[];
  gradient: string;
  hoverText: string;
  hoverBorder: string;
  bgIcon: string;
}

const HSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.hsc.common"),
      icon: "📚",
      gradient: "from-blue-600 to-indigo-700",
      hoverText: "group-hover/sub:text-blue-600",
      hoverBorder: "hover:border-blue-500/30",
      bgIcon: "group-hover/sub:bg-blue-600",
      subjects: [
        { name: t("study.hsc.subjects.bangla"), path: "/exam?group=hsc&subject=bangla" },
        { name: t("study.hsc.subjects.english"), path: "/exam?group=hsc&subject=english" },
        { name: t("study.hsc.subjects.ict"), path: "/exam?group=hsc&subject=ict" },
      ],
    },
    {
      name: t("study.hsc.science"),
      icon: "🔬",
      gradient: "from-emerald-600 to-teal-700",
      hoverText: "group-hover/sub:text-emerald-600",
      hoverBorder: "hover:border-emerald-500/30",
      bgIcon: "group-hover/sub:bg-emerald-600",
      subjects: [
        { name: t("study.hsc.subjects.physics"), path: "/exam?group=hsc&subject=physics" },
        { name: t("study.hsc.subjects.chemistry"), path: "/exam?group=hsc&subject=chemistry" },
        { name: t("study.hsc.subjects.biology"), path: "/exam?group=hsc&subject=biology" },
        { name: t("study.hsc.subjects.highermath"), path: "/exam?group=hsc&subject=highermath" },
      ],
    },
    {
      name: t("study.hsc.arts"),
      icon: "🎨",
      gradient: "from-orange-500 to-red-600",
      hoverText: "group-hover/sub:text-orange-600",
      hoverBorder: "hover:border-orange-500/30",
      bgIcon: "group-hover/sub:bg-orange-600",
      subjects: [
        { name: t("study.hsc.subjects.history"), path: "/exam?group=hsc&subject=history" },
        { name: t("study.hsc.subjects.logic"), path: "/exam?group=hsc&subject=logic" },
        { name: t("study.hsc.subjects.islamic"), path: "/exam?group=hsc&subject=islamic" },
        { name: t("study.hsc.subjects.civics"), path: "/exam?group=hsc&subject=civics" },
        { name: t("study.hsc.subjects.economics"), path: "/exam?group=hsc&subject=economics" },
        { name: t("study.hsc.subjects.geography"), path: "/exam?group=hsc&subject=geography" },
      ],
    },
    {
      name: t("study.hsc.commerce"),
      icon: "💼",
      gradient: "from-sky-600 to-blue-700",
      hoverText: "group-hover/sub:text-sky-600",
      hoverBorder: "hover:border-sky-500/30",
      bgIcon: "group-hover/sub:bg-sky-600",
      subjects: [
        { name: t("study.hsc.subjects.accounting"), path: "/exam?group=hsc&subject=accounting" },
        { name: t("study.hsc.subjects.management"), path: "/exam?group=hsc&subject=management" },
        { name: t("study.hsc.subjects.finance"), path: "/exam?group=hsc&subject=finance" },
        { name: t("study.hsc.subjects.business"), path: "/exam?group=hsc&subject=business" },
        { name: t("study.hsc.subjects.marketing"), path: "/exam?group=hsc&subject=marketing" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-[#0B1120] py-4 lg:py-10 px-2 lg:px-6 transition-colors">
      <SEO 
        title={lang === "bn" ? "এইচএসসি কর্নার - কাফআহ" : "HSC Corner - Kafa'ah"} 
        image="https://study.kafaahbd.com/hsc.jpg"
        url="/hsc"
      />

      <div className="w-full lg:w-[92%] max-w-6xl mx-auto">
        {/* Header Section - PC size reduced from 7xl to 5xl */}
        <header className="mb-8 lg:mb-12">
          <Link
            href="/"
            className="group inline-flex items-center text-[10px] font-black text-slate-400 dark:text-gray-500 hover:text-emerald-600 transition-colors mb-4 uppercase tracking-[0.2em]"
          >
            <i className="fas fa-chevron-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {t("study.back")}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
                {t("study.hsc.title")}
                <span className="text-emerald-600">.</span>
              </h1>
              <p className="text-sm lg:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed">
                {t("study.hsc.subtitle")}
              </p>
            </div>
            
            <div className="inline-flex items-center self-start gap-2 px-4 py-2 bg-white dark:bg-gray-800/50 shadow-sm border border-slate-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Academic 2026
            </div>
          </div>
        </header>

        {/* Groups Grid - Spacing adjusted for PC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <div className="group bg-white dark:bg-[#151C2C] rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-gray-800/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col h-full">
                
                {/* Group Header - Balanced Padding */}
                <div className={`bg-gradient-to-br ${group.gradient} p-5 lg:p-7 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  
                  <div className="flex items-center space-x-4 lg:space-x-5 relative z-10">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl flex items-center justify-center text-2xl lg:text-3xl border border-white/20">
                      {group.icon}
                    </div>
                    <h2 className="text-xl lg:text-2xl font-black tracking-tight">{group.name}</h2>
                  </div>
                </div>

                {/* Subjects List - Padding reduced for better fit */}
                <div className="p-2 lg:p-6 space-y-1.5 lg:space-y-2 flex-grow">
                  {group.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      href={subject.path}
                      className={`flex items-center justify-between p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-gray-800/30 border border-transparent ${group.hoverBorder} hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 group/sub`}
                    >
                      <span className={`font-bold text-gray-700 dark:text-gray-300 ${group.hoverText} transition-colors text-[14px] lg:text-base`}>
                        {subject.name}
                      </span>
                      <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-gray-600 ${group.bgIcon} group-hover/sub:text-white group-hover/sub:border-transparent transition-all`}>
                        <i className="fas fa-arrow-right text-[10px] lg:text-[12px] -rotate-45 group-hover/sub:rotate-0 transition-transform"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Support Box - More compact on PC */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-20 bg-[#0F172A] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 space-y-4 lg:space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-b from-emerald-400 to-teal-600 text-white rounded-2xl lg:rounded-3xl flex items-center justify-center text-2xl lg:text-3xl mx-auto shadow-xl shadow-emerald-500/20">
              <i className="fas fa-kaaba"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tighter">
                {lang === "bn" ? "নতুন কন্টেন্ট আসছে ইনশাআল্লাহ্" : "New Content Coming Soon!"}
              </h3>
              <p className="text-sm lg:text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                {lang === "bn"
                  ? "এইচএসসি-র প্রতিটি বিষয়ের সেরা প্রস্তুতি নিশ্চিত করতে আমাদের টিম কাজ করছে।"
                  : "Our team is working to ensure the best preparation for every HSC subject."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4 pt-4">
               {['Free Access', 'Premium UI', 'Interactive', 'Fast Loading'].map((tag) => (
                 <span key={tag} className="px-4 lg:px-6 py-2 lg:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-emerald-400 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em]">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HSCCorner;