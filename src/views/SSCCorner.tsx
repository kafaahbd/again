"use client";
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
  accentColor: string;
}

const SSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.common"),
      icon: "📖",
      gradient: "from-emerald-600 to-teal-800",
      accentColor: "group-hover/sub:text-emerald-600",
      subjects: [
        { name: t("study.subjects.bangla"), path: "/exam?group=ssc&subject=bangla" },
        { name: t("study.subjects.english"), path: "/exam?group=ssc&subject=english" },
        { name: t("study.subjects.ict"), path: "/exam?group=ssc&subject=ict" },
        { name: t("study.subjects.math"), path: "/exam?group=ssc&subject=math" },
        { name: t("study.subjects.islam"), path: "/exam?group=ssc&subject=islam" },
      ],
    },
    {
      name: t("study.science"),
      icon: "🔬",
      gradient: "from-blue-600 to-indigo-700",
      accentColor: "group-hover/sub:text-blue-600",
      subjects: [
        { name: t("study.subjects.physics"), path: "/exam?group=ssc&subject=physics" },
        { name: t("study.subjects.chemistry"), path: "/exam?group=ssc&subject=chemistry" },
        { name: t("study.subjects.biology"), path: "/exam?group=ssc&subject=biology" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.arts"),
      icon: "🎨",
      gradient: "from-orange-500 to-rose-600",
      accentColor: "group-hover/sub:text-orange-600",
      subjects: [
        { name: t("study.subjects.history"), path: "/exam?group=ssc&subject=history" },
        { name: t("study.subjects.civics"), path: "/exam?group=ssc&subject=civics" },
        { name: t("study.subjects.geography"), path: "/exam?group=ssc&subject=geography" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.commerce"),
      icon: "💼",
      gradient: "from-sky-500 to-blue-700",
      accentColor: "group-hover/sub:text-sky-600",
      subjects: [
        { name: t("study.subjects.accounting"), path: "/exam?group=ssc&subject=accounting" },
        { name: t("study.subjects.business"), path: "/exam?group=ssc&subject=business" },
        { name: t("study.subjects.finance"), path: "/exam?group=ssc&subject=finance" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.optional"),
      icon: "⭐",
      gradient: "from-purple-600 to-fuchsia-700",
      accentColor: "group-hover/sub:text-purple-600",
      subjects: [
        { name: t("study.subjects.highermath"), path: "/exam?group=ssc&subject=highermath" },
        { name: t("study.subjects.agriculture"), path: "/exam?group=ssc&subject=agriculture" },
        { name: t("study.subjects.health"), path: "/exam?group=ssc&subject=health" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] dark:bg-[#0b1120] py-6 lg:py-10 px-3 lg:px-6 transition-colors duration-500 overflow-x-hidden">
      <SEO 
        title={lang === "bn" ? "এসএসসি কর্নার - কাফআহ" : "SSC Corner - Kafa'ah"} 
        image="https://study.kafaahbd.com/ssc.jpg"
        url="/ssc"
      />

      {/* Decorative Islamic Pattern Background */}
      <div className="fixed inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="islamic-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M25 0L30 18L48 20L32 25L35 45L20 30L5 45L10 25L0 20L18 15Z" fill="currentColor"/></pattern><rect width="100%" height="100%" fill="url(#islamic-grid)"/></svg>
      </div>

      <div className="relative z-10 w-full lg:w-[92%] xl:w-[85%] mx-auto">
        {/* Header Section */}
        <header className="mb-8 lg:mb-12">
          <Link
            href="/"
            className="group inline-flex items-center text-xs lg:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full mb-6 hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-800/30"
          >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {t("study.back")}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("study.ssc.title")}<span className="text-emerald-600">.</span>
              </h1>
              <p className="text-base lg:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                {t("study.ssc.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs lg:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                2026 Edition
              </span>
            </div>
          </div>
        </header>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <motion.div 
                whileHover={{ y: -8 }}
                className="group h-full bg-white dark:bg-slate-900/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500 backdrop-blur-sm"
              >
                {/* Modern Header */}
                <div className={`bg-gradient-to-br ${group.gradient} p-6 lg:p-8 text-white relative`}>
                  <div className="absolute -right-4 -top-4 opacity-10 text-8xl transform rotate-12 select-none">
                    {group.icon}
                  </div>
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
                      {group.icon}
                    </div>
                    <h2 className="text-xl lg:text-2xl font-black tracking-tight">{group.name}</h2>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-4 lg:p-6 space-y-3">
                  {group.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      href={subject.path}
                      className="flex items-center justify-between p-3.5 lg:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all group/sub shadow-sm hover:shadow-md"
                    >
                      <span className={`font-bold text-slate-700 dark:text-slate-300 ${group.accentColor} transition-colors text-sm lg:text-[16px]`}>
                        {subject.name}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover/sub:bg-emerald-600 group-hover/sub:text-white transition-all duration-300">
                        <i className="fas fa-chevron-right text-[10px]"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Premium Islamic Info Footer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-12 lg:mt-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center text-4xl shrink-0 border border-white/30">
              <i className="fas fa-lightbulb animate-pulse"></i>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-black mb-3">
                {lang === "bn" ? "জ্ঞানের পথে যাত্রা শুরু হোক" : "Start Your Journey of Knowledge"}
              </h3>
              <p className="text-sm lg:text-lg text-emerald-50 opacity-90 font-medium leading-relaxed max-w-2xl">
                {lang === "bn"
                  ? "আপনার পড়াশোনাকে সহজ করতে আমরা নিয়ে আসছি পূর্ণাঙ্গ সলিউশন। ইনশাআল্লাহ্, প্রতিটি বিষয়ের প্রশ্নব্যাংক ও নোট শীঘ্রই যুক্ত হবে।"
                  : "We are bringing a complete solution to simplify your studies. InshaAllah, question banks and notes for every subject will be added soon."}
              </p>
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default SSCCorner;