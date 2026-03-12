"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import SEO from "../components/SEO";
import { useExamState } from "../hooks/useExamState";
import { getGroupName, getSubjectName } from "../typescriptfile/utils";
import SetupScreen from "../components/SetupScreen";
import ExamMode from "../components/ExamMode";
import PracticeMode from "../components/PracticeMode";
import ReviewMode from "../components/ReviewMode";
import PracticeCompleted from "../components/PracticeCompleted";
import FinishedResult from "../components/FinishedResult";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";

const ExamCenter: React.FC = () => {
  const navigate = useRouter();
  const [searchParams] = useSearchParams();
  const groupParam = searchParams.get("group");
  const subjectParam = searchParams.get("subject");

  const state = useExamState();
  const { lang, examState, setGroupSubject, chaptersForSubject } = state;

  useEffect(() => {
    if (!groupParam || !subjectParam) {
      navigate("/");
    } else {
      setGroupSubject(groupParam, subjectParam);
    }
  }, [groupParam, subjectParam, navigate, setGroupSubject]);

  const groupName = getGroupName(groupParam, lang);
  const subjectName = getSubjectName(subjectParam, lang);

  // ডাইনামিক টাইটেল এবং ডেসক্রিপশন
  const pageTitle = `${subjectName} - ${groupName} | ${lang === "bn" ? "কাফআহ এক্সাম সেন্টার" : "Kafa'ah Exam Center"}`;
  const pageDescription =
    lang === "bn"
      ? `${subjectName} এর ওপর অনলাইন মডেল টেস্ট এবং প্র্যাকটিস সেশন। আপনার প্রস্তুতি যাচাই করুন কাফআহ স্টাডি কর্নারে।`
      : `Take professional model tests and practice sessions for ${subjectName}. Evaluate your preparation with Kafa'ah Study Corner.`;

  // সাবজেক্ট না পাওয়া গেলে ডাইনামিক এরর স্ক্রিন
  if (chaptersForSubject.length === 0 && groupParam && subjectParam) {
    const errorTitle = lang === "bn" ? `${subjectName} পাওয়া যায়নি` : `${subjectName} Not Found`;
    
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <SEO 
          title={errorTitle} 
          description={pageDescription}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
          
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-amber-500" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            {errorTitle}
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8 leading-relaxed">
            {lang === "bn"
              ? `দুঃখিত! ${subjectName} বিষয়ের জন্য এখনো কোনো প্রশ্ন বা অধ্যায় আমাদের ডাটাবেজে যুক্ত করা হয়নি।`
              : `Apologies! No questions or chapters have been uploaded for ${subjectName} yet.`}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none"
          >
            <ArrowLeft size={16} />
            {lang === "bn" ? "পেছনে যান" : "Go Back"}
          </button>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          href="https://wa.me/your-number"
          className="mt-8 flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]"
        >
          <MessageCircle size={14} />
          {lang === "bn" ? "ভুল পেলে রিপোর্ট করুন" : "Report an issue"}
        </motion.a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 transition-colors duration-500">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        image="https://study.kafaahbd.com/exam.jpg"
        url={`/exam?group=${groupParam}&subject=${subjectParam}`}
        // keywords props টি এখন কাজ করবে যদি আপনি SEO.tsx এ এটি এড করেন
        keywords={`${subjectName}, ${groupName}, Exam Center, Kafa'ah, Study Corner`}
      />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={examState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {examState === "setup" && <SetupScreen state={state} />}
            {examState === "running_exam" && <ExamMode state={state} />}
            {examState === "running_practice" && <PracticeMode state={state} />}
            {examState === "practice_review" && <ReviewMode state={state} />}
            {examState === "practice_completed" && <PracticeCompleted state={state} />}
            {examState === "finished" && <FinishedResult state={state} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ExamCenter;