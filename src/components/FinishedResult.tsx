"use client";
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Latex from "react-latex-next";



import type { ExamHookState } from "../typescriptfile/types";

interface Props {
	state: ExamHookState;
}

const FinishedResult: React.FC<Props> = ({ state }) => {
	
	const { lang, result, subjectName, resetToSetup, isSaved } = state;
	const navigate = useRouter();
	const reportTemplateRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.body.classList.add("hide-mobile-nav");
		return () => document.body.classList.remove("hide-mobile-nav");
	}, []);

	useEffect(() => {
		if (isSaved) {
			const timer = setTimeout(() => {
				// আপনি চাইলে আরেকটি স্টেট নিয়ে এটি হাইড করতে পারেন
				// তবে আপাতত এভাবে রাখলেও কোনো সমস্যা নেই।
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [isSaved]);

	if (!result) return null;

	const handleBack = () => {
  navigate.back(); // Next.js এ ব্যাকে যাওয়ার সঠিক নিয়ম
};

const handleDownloadPdf = () => {
    // ১. প্রিন্ট হওয়ার সময় ফাইলের নাম যা হবে (টাইটেল হিসেবে সেট করা)
    const originalTitle = document.title;
    const fileName = `Result_${subjectName || 'Exam'}_${new Date().toLocaleDateString()}`;
    document.title = fileName;

    // ২. প্রিন্ট কমান্ড দেওয়া (ইউজার শুধু 'Save as PDF' এ ক্লিক করবে)
    window.print();

    // ৩. প্রিন্ট শেষ হলে টাইটেল আগের মতো করা
    document.title = originalTitle;
};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-2 lg:py-8 px-2 lg:px-4 transition-colors">
			{/* Navigation Layer */}
			<div className="max-w-4xl mx-auto flex items-center justify-between mb-4 lg:mb-8 print:hidden px-2">
				<button
					onClick={handleBack}
					className="flex items-center text-green-600 font-bold hover:underline text-xs md:text-base"
				>
					<i className="fas fa-arrow-left mr-1 md:mr-2"></i>
					{lang === "bn" ? "পেছনে" : "Back"}
				</button>

				<div className="flex gap-2 md:gap-3">
					<button
						onClick={handleDownloadPdf}
						className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-2 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition-all text-[10px] md:text-sm"
					>
						<i className="fas fa-file-download"></i>
						{lang === "bn" ? "PDF রিপোর্ট" : "PDF Report"}
					</button>
				</div>
			</div>

			{/* PDF Content Area */}
			<div
				ref={reportTemplateRef}
				className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-3 md:p-8 rounded-2xl md:rounded-3xl shadow-xl transition-colors text-gray-900 dark:text-gray-100"
			>
				{/* PDF Header */}
				<div className="text-center border-b-2 border-green-500 pb-3 md:pb-4 mb-4 md:mb-6">
					<img
						src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
						alt="Kafa'ah"
						className="h-6 md:h-10 mx-auto mb-1 md:mb-2"
					/>
					<h2 className="text-base md:text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
						{lang === "bn" ? "পরীক্ষার ফলাফল" : "Exam Performance"}
					</h2>
				</div>

				{/* User Score Summary */}
				<div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
					<div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-center border border-green-100 dark:border-green-800">
						<p className="text-[10px] md:text-xs font-bold text-green-600 uppercase mb-0.5 md:mb-1">
							{lang === "bn" ? "সঠিক" : "Correct"}
						</p>
						<p className="text-xl md:text-2xl font-black text-green-700 dark:text-green-400">
							{result.correct} / {result.total}
						</p>
					</div>
					<div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-6 rounded-xl md:rounded-2xl text-center border border-blue-100 dark:border-blue-800">
						<p className="text-[10px] md:text-sm font-bold text-blue-600 uppercase mb-0.5 md:mb-1">
							{lang === "bn" ? "স্কোর" : "Score"}
						</p>
						<p className="text-2xl md:text-4xl font-black text-blue-700 dark:text-blue-400">
							{Math.round((result.correct / result.total) * 100)}%
						</p>
					</div>
				</div>

				{/* Questions Detail */}
				<div className="space-y-6 md:space-y-12">
					{result.results.map((item, idx: number) => (
						<div key={idx} className="group">
							<div className="mb-2 md:mb-4 md:flex md:gap-4 items-start">
								<span className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md md:rounded-lg flex items-center justify-center font-bold mb-1 md:mb-0 flex-shrink-0 text-xs md:text-base">
									{idx + 1}
								</span>
								<div className="text-sm md:text-xl font-semibold leading-snug">
									<Latex>{item.question}</Latex>
								</div>
							</div>

							<div className="ml-0 space-y-2 md:space-y-3">
								{/* Result Indicator */}
								<div
									className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3 ${
										item.isCorrect
											? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
											: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
									}`}
								>
									<i className={`fas ${item.isCorrect ? "fa-check-circle" : "fa-times-circle"} text-sm md:text-base`}></i>
									<p className="font-medium text-xs md:text-base">
										<span className="font-bold">
											{lang === "bn" ? "আপনার উত্তর: " : "Your Answer: "}
										</span>
										<Latex>{`${item.userAnswer || ""}. ${
											(item.userAnswer && item.options[item.userAnswer]) || "Not Answered"
										}`}</Latex>
									</p>
								</div>

								{!item.isCorrect && (
									<div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600">
										<p className="font-medium text-xs md:text-base">
											<span className="font-bold text-green-600">
												{lang === "bn" ? "সঠিক উত্তর: " : "Correct: "}
											</span>
											<Latex>{`${item.correctAnswer}. ${item.options[item.correctAnswer] || ""}`}</Latex>
										</p>
									</div>
								)}

								{/* Explanation Section */}
								{item.explanation && (
									<div className="mt-2 md:mt-4 p-3 md:p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl md:rounded-2xl border-l-4 border-yellow-400">
										<p className="text-[9px] md:text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase mb-0.5 md:mb-1 tracking-widest">
											{lang === "bn" ? "ব্যাখ্যা / Explanation" : "Explanation"}
										</p>
										<div className="text-gray-700 dark:text-gray-300 text-xs md:text-lg italic leading-relaxed">
											<Latex>{item.explanation}</Latex>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Action Button */}
			<div className="text-center mt-12 pb-10">
				<button
					onClick={resetToSetup}
					className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
				>
					{lang === "bn" ? "আবার পরীক্ষা দিন" : "Retake Exam"}
				</button>
			</div>

			{isSaved && (
				<div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold animate-bounce">
					✓ {lang === "bn" ? "রেজাল্ট সেভ হয়েছে" : "Result Saved"}
				</div>
			)}

			{/* Light Mode PDF Hack CSS */}
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

export default FinishedResult;
