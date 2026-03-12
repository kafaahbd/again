"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Latex from "react-latex-next";
import QuestionCard from "./QuestionCard";
import { type Question } from "../typescriptfile/types";
import { motion, AnimatePresence } from "framer-motion";

import type { ExamHookState } from "../typescriptfile/types";

interface Props {
  state: ExamHookState;
}

const ReviewMode: React.FC<Props> = ({ state }) => {
  const navigate = useRouter();
  const {
    lang,
    questions,
    mistakes,
    reviewIndex,
    userAnswers,
    practiceMessage,
    hasChecked,
    selectedOptionColor,
    handleAnswerSelect,
    handleReviewCheck,
    handleReviewNextOrResult,
    setHasChecked,
    setPracticeMessage,
    setSelectedOptionColor,
  } = state;

  const mistakeId = mistakes[reviewIndex];
  const question = questions.find((q: Question) => q.id === mistakeId);

  useEffect(() => {
    setHasChecked(false);
    setPracticeMessage("");
    setSelectedOptionColor({});
  }, [question?.id, setHasChecked, setPracticeMessage, setSelectedOptionColor]);

  if (!question) return null;

  const isLastMistake = reviewIndex === mistakes.length - 1;
  const handleBack = () => {
  navigate.back(); // Next.js এ ব্যাকে যাওয়ার সঠিক নিয়ম
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-2 pb-24 md:pb-6 px-2 md:px-4 transition-colors duration-500">
      {/* Header Area */}
      <div className="w-full lg:w-[85%] xl:w-[75%] mx-auto flex items-center justify-between mb-4 md:mb-8 px-2">
        <button 
          onClick={handleBack} 
          className="flex items-center text-gray-500 hover:text-red-500 transition-colors font-bold text-[10px] md:text-sm"
        >
          <i className="fas fa-arrow-left mr-1 md:mr-2"></i>
          {lang === "bn" ? "পেছনে" : "Back"}
        </button>
        
        <div className="flex flex-col items-center">
          <img
            src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
            alt="Kafa'ah"
            className="h-5 md:h-10 mb-0.5 md:mb-1"
          />
          <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-black text-red-500 animate-pulse">
            {lang === "bn" ? "ভুল সংশোধন" : "Fixing Mistakes"}
          </span>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-red-200 dark:border-red-800">
          <span className="text-[9px] md:text-xs font-bold text-red-600 dark:text-red-400">
            {lang === "bn" ? `বাকি: ${mistakes.length}` : `Left: ${mistakes.length}`}
          </span>
        </div>
      </div>

      {/* Main Review Card */}
      <main className="flex justify-center">
        <div className={`w-full lg:w-[85%] xl:w-[75%] grid grid-cols-1 ${hasChecked && practiceMessage ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-3 md:gap-4 transition-all duration-500`}>
          
          {/* Left Column: Question & Options */}
          <div className="bg-white dark:bg-gray-900 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-800 relative overflow-hidden animate-glow-pulse dark:animate-dark-glow-pulse shadow-xl">
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-red-50 dark:bg-red-900/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 transition-all"></div>

            {/* Question Header */}
            <div className="relative mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold text-gray-500">
                  #{reviewIndex + 1}
                </span>
                <div className="h-[1px] md:h-[2px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <h2 className="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                <Latex>{question.question}</Latex>
              </h2>
            </div>

            {/* Options Section */}
            <div className="relative z-10">
              <QuestionCard
                question={question}
                userAnswer={userAnswers[question.id]}
                onAnswerSelect={handleAnswerSelect}
                disabled={hasChecked}
                colorMap={selectedOptionColor}
              />
            </div>

            {/* Mobile Explanation Section (Shows below options on small screens) */}
            <AnimatePresence>
              {hasChecked && practiceMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="lg:hidden mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-xl shadow-inner"
                >
                  <div className="flex items-center mb-2 text-amber-700 dark:text-amber-500 font-black uppercase text-[9px] tracking-[0.2em]">
                    <i className="fas fa-lightbulb mr-2"></i>
                    {lang === "bn" ? "সঠিক ব্যাখ্যা" : "Correct Explanation"}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-xs whitespace-pre-wrap">
                    <Latex>{practiceMessage}</Latex>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons (Desktop only) */}
            <div className="hidden md:flex flex-col sm:flex-row gap-3 mt-8">
              {!hasChecked ? (
                <button
                  onClick={() => handleReviewCheck(question.id, userAnswers[question.id])}
                  disabled={!userAnswers[question.id]}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all font-black text-sm shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
                >
                  {lang === "bn" ? "চেক করুন" : "Check Answer"}
                </button>
              ) : (
                <button
                  onClick={handleReviewNextOrResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-black text-sm shadow-lg shadow-green-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLastMistake
                    ? (lang === "bn" ? "ফলাফল দেখুন" : "View Results")
                    : (lang === "bn" ? "পরবর্তী ভুল" : "Next Mistake")}
                  <i className={`fas ${isLastMistake ? 'fa-flag-checkered' : 'fa-chevron-right'}`}></i>
                </button>
              )}
            </div>

            {/* Back Button under card */}
            <div className="mt-4 text-center">
              <button
                onClick={handleBack}
                className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                {lang === "bn" ? "পেছনে যান" : "Go Back"}
              </button>
            </div>
          </div>

          {/* Right Column: Desktop Explanation Section */}
          <AnimatePresence>
            {hasChecked && practiceMessage && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="hidden lg:block bg-amber-50/80 dark:bg-amber-900/10 p-6 xl:p-8 rounded-[2rem] border border-amber-200/50 dark:border-amber-800/50 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center mb-6 pb-4 border-b border-amber-200 dark:border-amber-800/50">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-inner">
                    <i className="fas fa-lightbulb text-lg"></i>
                  </div>
                  <h3 className="text-amber-800 dark:text-amber-500 font-black uppercase tracking-widest text-sm">
                    {lang === "bn" ? "সঠিক ব্যাখ্যা" : "Explanation"}
                  </h3>
                </div>
                <div className="prose prose-amber dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-sm xl:text-base whitespace-pre-wrap">
                    <Latex>{practiceMessage}</Latex>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Sticky Mobile Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-50">
        {!hasChecked ? (
          <button
            onClick={() => handleReviewCheck(question.id, userAnswers[question.id])}
            disabled={!userAnswers[question.id]}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 disabled:opacity-30 active:scale-95 transition-all"
          >
            {lang === "bn" ? "চেক করুন" : "Check Answer"}
          </button>
        ) : (
          <button
            onClick={handleReviewNextOrResult}
            className="w-full py-3.5 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLastMistake
              ? (lang === "bn" ? "ফলাফল দেখুন" : "View Results")
              : (lang === "bn" ? "পরবর্তী ভুল" : "Next Mistake")}
            <i className={`fas ${isLastMistake ? 'fa-flag-checkered' : 'fa-chevron-right'}`}></i>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 md:mt-12 text-center pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          <i className="fab fa-whatsapp text-green-500"></i>
          <span className="text-[10px] md:text-xs font-medium text-gray-500">
            {lang === "bn" ? "সংশোধনে সাহায্য লাগবে?" : "Need help with correction?"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;