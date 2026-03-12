"use client";
import React, { useRef} from "react";
import { useRouter } from "next/navigation";

import Latex from "react-latex-next";


import type { ExamHookState } from "../typescriptfile/types";

interface Props {
  state: ExamHookState;
}

const PracticeCompleted: React.FC<Props> = ({ state }) => {
  const navigate = useRouter();
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  
  const { lang, result, resetToSetup } = state;
  const handleBack = () => {
  navigate.back(); // Next.js এ ব্যাকে যাওয়ার সঠিক নিয়ম
};

  if (!result) return null;

  const handleDownloadPdf = () => {
    // ১. প্রিন্ট হওয়ার সময় পেজের টাইটেল যা থাকবে সেটিই ফাইলের নাম হিসেবে কাজ করবে
    const originalTitle = document.title;
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    document.title = `Practice_Result_${date}`;

    // ২. সামান্য ডিলে দিয়ে প্রিন্ট কমান্ড ট্রিগার করা (স্মুথ এক্সপেরিয়েন্সের জন্য)
    setTimeout(() => {
        window.print();
        // ৩. প্রিন্ট উইন্ডো বন্ধ হওয়ার পর টাইটেল আগের মতো করে দেওয়া
        document.title = originalTitle;
    }, 500);
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-2 md:py-8 px-2 md:px-4">
      {/* Navigation & Actions */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 md:mb-8 px-2">
        <button onClick={handleBack} className="flex items-center text-green-600 font-bold hover:opacity-75 text-xs md:text-base">
          <i className="fas fa-arrow-left mr-1 md:mr-2"></i>
          {lang === "bn" ? "পেছনে" : "Back"}
        </button>
        
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95 text-[10px] md:text-sm"
          >
            <i className="fas fa-file-pdf"></i>
            {lang === "bn" ? "PDF ডাউনলোড" : "Download PDF"}
          </button>
          <img
            src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
            alt="Kafa'ah"
            className="h-6 md:h-10 hidden sm:block"
          />
        </div>
      </div>

      {/* Result Container (PDF Reference) */}
      <div 
        ref={reportTemplateRef} 
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800"
      >
        {/* PDF Header */}
        <div className="text-center border-b-2 border-green-500 pb-4 md:pb-6 mb-4 md:mb-8">
          <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" alt="Logo" className="h-6 md:h-10 mx-auto mb-2 md:mb-3" />
          <h1 className="text-xl md:text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
            {lang === "bn" ? "প্র্যাকটিস রেজাল্ট" : "Practice Summary"}
          </h1>
        </div>

        {/* Score Summary */}
        <div className="flex justify-center mb-6 md:mb-10">
          <div className="bg-green-50 dark:bg-green-900/20 px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-3xl text-center border border-green-100 dark:border-gray-800">
            <div className="text-3xl md:text-6xl font-black text-green-600 mb-0.5 md:mb-1">
              {result.correct} <span className="text-lg md:text-2xl text-gray-400">/ {result.total}</span>
            </div>
            <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
              {lang === "bn" ? "সঠিক উত্তর" : "Correct Answers"}
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6 md:space-y-8">
          {result.results.map((item, idx: number) => (
            <div key={idx} className={`border-l-4 ${
              item.everWrong && item.isCorrect ? "border-yellow-400" :
              !item.isCorrect ? "border-red-500" :
              "border-green-500"
            } pl-4 md:pl-6 py-1 md:py-2 transition-all`}>
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <p className="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-100">
                  {idx + 1}. <Latex>{item.question}</Latex>
                </p>
                {item.everWrong && item.isCorrect && (
                  <span className="flex-none ml-2 px-2 md:px-3 py-0.5 md:py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[8px] md:text-[10px] font-black rounded-full uppercase italic">
                    {lang === "bn" ? "সংশোধিত" : "Corrected"}
                  </span>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className={`flex items-center gap-2 text-sm md:text-lg ${item.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-bold"}`}>
                  <i className={`fas ${item.isCorrect ? 'fa-check-circle' : 'fa-times-circle'} text-xs md:text-base`}></i>
                  <p>
                    {lang === "bn" ? "আপনার উত্তর:" : "Your answer:"}{" "}
                    <Latex>{`${item.userAnswer ?? ""}. ${item.userAnswer && item.options[item.userAnswer] ? item.options[item.userAnswer] : ""}`}</Latex>
                  </p>
                </div>

                {!item.isCorrect && (
                  <div className="flex items-center gap-2 text-sm md:text-lg text-green-600 font-medium bg-green-50 dark:bg-green-900/10 p-2 rounded-lg border border-dashed border-green-200">
                    <i className="fas fa-check-double text-xs md:text-base"></i>
                    <p>
                      {lang === "bn" ? "সঠিক উত্তর:" : "Correct answer:"}{" "}
                      <Latex>{`${item.correctAnswer}. ${item.options[item.correctAnswer] || ""}`}</Latex>
                    </p>
                  </div>
                )}
                
                {item.explanation && (
                  <div className="mt-2 md:mt-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs md:text-sm italic text-gray-600 dark:text-gray-400 border-l-2 border-indigo-400">
                     <Latex>{item.explanation}</Latex>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PDF Footer Info */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
           Generated by Kafa'ah Platform • {new Date().toLocaleString()}
        </div>
      </div>

      {/* Final Action */}
      <div className="mt-12 text-center pb-10">
        <button
          onClick={resetToSetup}
          className="px-12 py-4 bg-green-600 text-white font-black text-lg rounded-2xl hover:bg-green-700 transform transition hover:-translate-y-1 shadow-xl active:scale-95"
        >
          {lang === "bn" ? "আবার প্র্যাকটিস করুন" : "Practice Again"}
        </button>
      </div>

      <style>{`
  @media print {
    /* ১. পেজের মার্জিন সেট করা */
    @page {
      margin: 15mm;
    }

    /* ২. ডার্ক মোড থাকলেও প্রিন্টে সাদা ব্যাকগ্রাউন্ড নিশ্চিত করা */
    body {
      background-color: white !important;
      color: black !important;
      -webkit-print-color-adjust: exact; /* কালার এবং গ্রাফিক্স ঠিক রাখতে */
    }

    /* ৩. অপ্রয়োজনীয় বাটন, ন্যাববার বা ফুটার হাইড করা */
    .print-hidden, 
    button, 
    nav, 
    footer,
    .back-button {
      display: none !important;
    }

    /* ৪. কন্টেন্ট যাতে মাঝপথে না ভেঙে যায় (Page Break) */
    .question-box, .result-card, .group {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 20px !important;
      display: block !important;
    }

    /* ৫. লাইন বা টেক্সট যাতে গায়ে গায়ে লেগে না থাকে */
    p, span, div {
      orphans: 3; /* লাইনের শুরুতে কমপক্ষে ৩টি লাইন একসাথে রাখবে */
      widows: 3;  /* লাইনের শেষে কমপক্ষে ৩টি লাইন একসাথে রাখবে */
    }

    /* ৬. ল্যাটেক্স (Latex) সমীকরণ ফিক্স */
    .mjx-container, .katex {
      display: inline-block !important;
      vertical-align: middle !important;
      max-width: 100% !important;
    }
  }
`}</style>
    </div>
  );
};

export default PracticeCompleted;