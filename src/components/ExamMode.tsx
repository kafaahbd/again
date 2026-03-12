"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Latex from "react-latex-next";
import QuestionCard from "./QuestionCard";
import { formatTime } from "../typescriptfile/utils";
import { motion } from "framer-motion";

import type { ExamHookState } from "../typescriptfile/types";

interface Props {
  state: ExamHookState;
}

const ExamMode: React.FC<Props> = ({ state }) => {
  const navigate = useRouter();
  const { lang, questions, userAnswers, timeLeft, handleAnswerSelect, handleSubmitExam } = state;
  
  const handleBack = () => {
  navigate.back(); // Next.js এ ব্যাকে যাওয়ার সঠিক নিয়ম
};

  // উত্তর দেওয়া হয়েছে এমন প্রশ্নের সংখ্যা
  const answeredCount = Object.keys(userAnswers).length;

  useEffect(() => {
    document.body.classList.add("hide-mobile-nav");
    return () => document.body.classList.remove("hide-mobile-nav");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-2 md:py-6 px-2 md:px-4 transition-colors">
      
      {/* Sticky Top Header with Timer and Progress */}
      <div className="sticky top-0 z-50 w-full mb-4 md:mb-8 pt-1 md:pt-2">
        <div className="w-full lg:w-[70%] mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 md:p-4 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button onClick={handleBack} className="text-gray-500 hover:text-red-500 font-bold flex items-center gap-1 text-[10px] md:text-sm">
            <i className="fas fa-times-circle"></i>
            <span className="hidden sm:inline">{lang === "bn" ? "বাতিল" : "Cancel"}</span>
          </button>

          <div className="flex flex-col items-center">
             <div className={`text-xs md:text-lg font-black tracking-tighter ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-800 dark:text-white'}`}>
                <i className="fas fa-clock mr-1 text-[8px] md:text-[10px]"></i>
                {formatTime(timeLeft)}
             </div>
             <div className="text-[7px] md:text-[9px] uppercase font-bold text-gray-400">
                {lang === "bn" ? "বাকি সময়" : "Time Remaining"}
             </div>
          </div>

          <div className="text-right">
             <div className="text-[10px] md:text-sm font-black text-green-600">
                {answeredCount} / {questions.length}
             </div>
             <div className="text-[7px] md:text-[10px] uppercase font-bold text-gray-400">
                {lang === "bn" ? "পূরণকৃত" : "Answered"}
             </div>
          </div>
        </div>
      </div>

      {/* Main Exam Content */}
      <main className="w-full lg:w-[70%] mx-auto">
        <div className="bg-white dark:bg-gray-900 p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
          
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-10">
            <h2 className="text-base md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
              {lang === "bn" ? "প্রশ্নপত্র" : "Question Paper"}
            </h2>
            <div className="h-[1px] md:h-[2px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>

          <div className="space-y-6 md:space-y-12">
            {questions.map((q, idx: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={q.id} 
                className="group relative"
              >
                {/* Question Number Badge */}
                <div className="flex flex-col md:flex-row items-start gap-2 md:gap-3 lg:gap-4">
                  <span className="flex-none w-6 h-6 md:w-10 md:h-10 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs md:text-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <div className="flex-1 w-full">
                    <p className="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 md:mb-6 leading-relaxed pt-0.5 md:pt-1">
                      <Latex>{q.question}</Latex>
                    </p>
                    <QuestionCard
                      question={q}
                      userAnswer={userAnswers[q.id]}
                      onAnswerSelect={handleAnswerSelect}
                      disabled={false}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="mt-8 md:mt-16 pt-6 md:pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 text-[9px] md:text-sm mb-3 md:mb-6 font-medium italic">
              {lang === "bn" 
                ? "সবগুলো প্রশ্ন চেক করে সাবমিট করুন" 
                : "Please review all questions before submitting."}
            </p>
            <button
              onClick={handleSubmitExam}
              className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-5 bg-green-600 text-white rounded-xl md:rounded-2xl text-base md:text-xl font-black hover:bg-green-700 shadow-xl shadow-green-200 dark:shadow-none transition-all active:scale-95 hover:-translate-y-1"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {lang === "bn" ? "পরীক্ষা জমা দিন" : "Submit Exam"}
            </button>

            <div className="mt-4">
              <button
                onClick={handleBack}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                {lang === "bn" ? "পেছনে যান" : "Go Back"}
              </button>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-8 lg:mt-12 text-center pb-6 lg:pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 text-[10px] lg:text-xs">
            <i className="fab fa-whatsapp text-green-500"></i>
            {lang === "bn"
              ? "প্রশ্ন ভুল মনে হলে আমাদের জানান"
              : "Report mistakes via WhatsApp"}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamMode;