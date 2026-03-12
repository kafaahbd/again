"use client";
import { useEffect, useState } from 'react';
import { getUserExamHistory } from '../services/examService';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

import SEO from '../components/SEO';
import { 
  Trophy, Activity, Calendar, ArrowRight, 
  History, Timer, CheckCircle2, LayoutDashboard 
} from 'lucide-react';

interface ExamHistory {
  subject_name: string;
  score: number | string;
  total_questions: number | string;
  correct_answers?: number;
  time_taken?: number;
  created_at: string;
}

const Dashboard = () => {
  const [history, setHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getUserExamHistory();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("History load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const totalExams = history.length;
  
  const avgScore = totalExams > 0 
    ? Math.round(
        history.reduce((acc, curr) => {
          const score = Number(curr.score);
          const total = Number(curr.total_questions);
          const actualPercentage = score > total ? score : (score / total) * 100;
          return acc + actualPercentage;
        }, 0) / totalExams
      )
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#FDFCF8] dark:bg-gray-950">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-100 dark:border-emerald-900/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-emerald-600 rounded-full animate-spin"></div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 py-6 lg:py-10 px-3 lg:px-6 transition-colors duration-500">
      <SEO 
        title={lang === "bn" ? "ড্যাশবোর্ড - কাফআহ" : "Dashboard - Kafa'ah"} 
        description={lang === "bn" ? "আপনার পরীক্ষার পরিসংখ্যান এবং অগ্রগতি দেখুন।" : "View your exam statistics and progress."}
        image="https://study.kafaahbd.com/stufy.jpg"
        url="/dashboard"
      />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] tracking-[0.3em] uppercase">
              <LayoutDashboard size={14} />
              {lang === 'bn' ? 'স্টাডি পোর্টাল' : 'Study Portal'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
              {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
              {lang === 'bn' ? 'আপনার সফলতার যাত্রা এখানে ট্র্যাক করুন' : 'Monitor your academic progress and growth'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3 w-full lg:w-auto"
          >
             <Link href="/exam" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider">
                {lang === 'bn' ? 'নতুন পরীক্ষা' : 'New Exam'}
                <ArrowRight size={16} />
             </Link>
          </motion.div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title={lang === 'bn' ? "মোট পরীক্ষা" : "Total Exams"} 
            val={totalExams.toString().padStart(2, '0')} 
            icon={<History size={24} />} 
            color="bg-blue-500" 
            delay={0.1}
          />
          <StatCard 
            title={lang === 'bn' ? "গড় নম্বর" : "Average Score"} 
            val={`${avgScore}%`} 
            icon={<Trophy size={24} />} 
            color="bg-emerald-500" 
            delay={0.2}
          />
          <StatCard 
            title={lang === 'bn' ? "বর্তমান স্ট্যাটাস" : "Current Status"} 
            val={totalExams > 0 ? (avgScore > 70 ? 'Expert' : 'Active') : 'Newbie'} 
            icon={<Activity size={24} />} 
            color="bg-orange-500" 
            delay={0.3}
          />
        </div>

        {/* History Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden transition-all"
        >
          <div className="p-6 lg:p-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
             <div>
               <h2 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white leading-none">Recent Activity</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Historical Performance Data</p>
             </div>
             <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black text-gray-500 uppercase">
                {totalExams} {lang === 'bn' ? 'পরীক্ষা পাওয়া গেছে' : 'Records Found'}
             </div>
          </div>

          <div className="overflow-x-auto p-2 lg:p-4">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-5">{lang === 'bn' ? 'বিষয়' : 'Subject'}</th>
                  <th className="px-6 py-5">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Score'}</th>
                  <th className="px-6 py-5">{lang === 'bn' ? 'সঠিকতা' : 'Accuracy'}</th>
                  <th className="px-6 py-5">{lang === 'bn' ? 'সময়' : 'Duration'}</th>
                  <th className="px-6 py-5">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence>
                {history.map((item, i) => {
                  const s = Number(item.score);
                  const t = Number(item.total_questions);
                  const accuracy = s > t ? s : Math.round((s / t) * 100);
                  const displayScore = s > t ? (item.correct_answers || 0) : s;

                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={i} 
                      className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <CheckCircle2 size={16} />
                          </div>
                          <span className="font-bold text-gray-800 dark:text-gray-200">{item.subject_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="font-black text-gray-900 dark:text-white">{displayScore}</span>
                        <span className="text-gray-400 text-xs font-bold ml-1">/ {t}</span>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${accuracy}%` }}
                                 transition={{ duration: 1, delay: i * 0.1 }}
                                 className={`h-full rounded-full ${accuracy > 70 ? 'bg-emerald-500' : accuracy > 40 ? 'bg-orange-500' : 'bg-red-500'}`} 
                               ></motion.div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500">{accuracy}%</span>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-xs">
                          <Timer size={14} />
                          {item.time_taken ? (
                            lang === 'bn' 
                              ? `${Math.floor(item.time_taken / 60)}মি. ${item.time_taken % 60}সে.`
                              : `${Math.floor(item.time_taken / 60)}m ${item.time_taken % 60}s`
                          ) : '--'}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                          <Calendar size={14} />
                          {new Date(item.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {history.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <History size={40} />
               </div>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No exam records yet</p>
               <Link href="/exam" className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-black text-sm hover:underline">
                  Start your first test <ArrowRight size={16} />
               </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, val, icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6 group hover:border-emerald-500/30 transition-all"
  >
    <div className={`${color} w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-gray-200 dark:shadow-none group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{val}</p>
    </div>
  </motion.div>
);

export default Dashboard;