"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import * as examService from "../services/examService";
import { BookOpen, Play, Trash2, CheckCircle, AlertCircle, ArrowLeft, ChevronRight } from "lucide-react";

/**
 * SubjectCard Component
 * Separated for performance and reusability
 */
const SubjectCard = React.memo(({ subject, onClick, lang }: any) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onClick(subject.subject_name)}
    className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:shadow-md transition-all text-left"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <BookOpen size={22} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
          {subject.subject_name}
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
          {lang === "bn" ? "ভুল সংশোধন করুন" : "Fix Mistakes"}
        </p>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
      <Play size={16} fill="currentColor" />
    </div>
  </motion.button>
));

const Mistakes: React.FC = () => {
  const { lang } = useLanguage();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);

  // Practice States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.getMistakeSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectClick = async (subjectName: string) => {
    setSelectedSubject(subjectName);
    try {
      const data = await examService.getMistakesBySubject(subjectName);
      setMistakes(data);
    } catch (error) {
      console.error("Mistakes fetch error:", error);
    }
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    const currentQuestion = mistakes[currentIndex].question_data;
    setSelectedOption(option);
    setIsAnswered(true);
    setIsCorrect(option === currentQuestion.correct_answer);
  };

  const nextQuestion = async () => {
    if (isCorrect) {
      try {
        await examService.deleteMistake(mistakes[currentIndex].id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setPracticeFinished(true);
    }
  };

  const resetPractice = () => {
    setPracticeMode(false);
    setPracticeFinished(false);
    setSelectedSubject(null);
    setMistakes([]);
    fetchSubjects();
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const seoContent = useMemo(() => ({
    title: lang === "bn" ? "ভুল সংশোধন কেন্দ্র - কাফআহ" : "Mistake Lab - Kafa'ah",
    desc: lang === "bn" ? "আপনার ভুল করা প্রশ্নগুলো প্র্যাকটিস করে নিজেকে আরও দক্ষ করে তুলুন।" : "Improve by practicing your previous mistakes."
  }), [lang]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 lg:py-12">
      <SEO title={seoContent.title} description={seoContent.desc} url="/mistakes" />

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedSubject && !practiceMode && (
            <motion.section
              key="subjects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <header className="text-center mb-10">
                <h1 className="text-2xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  {lang === "bn" ? "ভুল সংশোধন কেন্দ্র" : "Mistake Lab"}
                </h1>
                <p className="text-gray-500 text-sm lg:text-base font-medium italic">
                  {lang === "bn" ? "ভুল থেকেই শেখার শুরু" : "Learning starts from mistakes"}
                </p>
              </header>

              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((s, idx) => (
                    <SubjectCard key={idx} subject={s} onClick={handleSubjectClick} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-xl font-bold dark:text-white mb-2">{lang === "bn" ? "কোনো ভুল নেই!" : "Zero Mistakes!"}</h2>
                  <p className="text-gray-400 text-sm">{lang === "bn" ? "সব পরীক্ষায় আপনি দারুণ করেছেন।" : "You've aced everything!"}</p>
                </div>
              )}
            </motion.section>
          )}

          {selectedSubject && !practiceMode && (
            <motion.section
              key="subject-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 mb-6 font-bold text-xs uppercase tracking-widest transition-colors">
                <ArrowLeft size={16} /> {lang === "bn" ? "পিছনে" : "Back"}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <BookOpen size={28} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl lg:text-2xl font-black dark:text-white leading-tight">{selectedSubject}</h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{mistakes.length} Questions Found</p>
                  </div>
                </div>
                <button onClick={() => setPracticeMode(true)} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                  {lang === "bn" ? "শুরু করুন" : "Start Now"}
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Preview</h3>
                {mistakes.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl text-sm font-medium dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                    {m.question_data.question}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {practiceMode && !practiceFinished && (
            <motion.section
              key="practice"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-10 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg font-mono">
                  {selectedSubject} • {currentIndex + 1}/{mistakes.length}
                </span>
                <button onClick={resetPractice} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>

              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
                {mistakes[currentIndex].question_data.question}
              </h2>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {Object.entries(mistakes[currentIndex].question_data.options).map(([key, value]) => (
                  <button
                    key={key}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(key)}
                    className={`p-4 rounded-xl border-2 text-left text-sm font-bold transition-all flex items-center gap-4 
                      ${!isAnswered ? 'border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/50' :
                        key === mistakes[currentIndex].question_data.correct_answer ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700' :
                        selectedOption === key ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700' : 'opacity-50 border-gray-100 dark:border-gray-800'}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${selectedOption === key ? 'bg-current text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{key}</span>
                    {value as string}
                  </button>
                ))}
              </div>

              {/* YOUR ORIGINAL EXPLANATION DESIGN */}
              {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      {isCorrect ? <CheckCircle className="text-green-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />}
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? (lang === "bn" ? "অসাধারন! সঠিক উত্তর" : "Excellent! Correct") : (lang === "bn" ? "ভুল উত্তর!" : "Incorrect Answer!")}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-white dark:border-gray-700/50">
                      {mistakes[currentIndex].question_data.explanation}
                    </p>
                  </div>
                  
                  <button onClick={nextQuestion} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    {currentIndex < mistakes.length - 1 ? (lang === "bn" ? "পরবর্তী প্রশ্ন" : "Next Question") : (lang === "bn" ? "ফলাফল দেখুন" : "View Results")}
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.section>
          )}

          {practiceFinished && (
            <motion.section
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl max-w-lg mx-auto border border-gray-100 dark:border-gray-700"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-500/30">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black dark:text-white mb-2">{lang === "bn" ? "অভিনন্দন!" : "Congratulations!"}</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium">{lang === "bn" ? "সঠিক উত্তর দেওয়া প্রশ্নগুলো আপনার লিস্ট থেকে সফলভাবে সরানো হয়েছে।" : "All corrected questions have been removed from your list."}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={resetPractice} className="flex-1 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl font-bold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-300">{lang === "bn" ? "হোম পেজ" : "Back Home"}</button>
                <button onClick={() => { setCurrentIndex(0); setPracticeFinished(false); setIsAnswered(false); }} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/20">Restart</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Mistakes;