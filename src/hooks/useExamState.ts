import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { subjectChapters } from "../data/subjectChapters";
import { getSubjectName } from "../typescriptfile/utils";
import {
	type Question,
	type ResultItem,
	type ExamState,
} from "../typescriptfile/types";
import * as examService from "../services/examService";

export const useExamState = () => {
	const { lang } = useLanguage();
	const { user } = useAuth();

	const [group, setGroup] = useState<string | null>(null);
	const [subject, setSubject] = useState<string | null>(null);

	const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
	const [duration, setDuration] = useState<number>(20);
	const [questionCount, setQuestionCount] = useState<number>(20);
	const [examState, setExamState] = useState<ExamState>("setup");
	const [mode, setMode] = useState<"practice" | "exam">("exam");

	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [userAnswers, setUserAnswers] = useState<{ [id: number]: string }>({});
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [result, setResult] = useState<{
		total: number;
		correct: number;
		results: ResultItem[];
		timeSpent?: number;
	} | null>(null);

	const [isSaved, setIsSaved] = useState(false);
	const isSubmitting = useRef(false);

	const subjectName = getSubjectName(subject, lang);

	const [mistakes, setMistakes] = useState<number[]>([]);
	const [reviewIndex, setReviewIndex] = useState<number>(0);
	const [practiceMessage, setPracticeMessage] = useState<string>("");
	const [hasChecked, setHasChecked] = useState<boolean>(false);
	const [selectedOptionColor, setSelectedOptionColor] = useState<{
		[id: number]: string;
	}>({});
	const [everWrong, setEverWrong] = useState<{ [id: number]: boolean }>({});

	const [questionAttempts, setQuestionAttempts] = useState<{
		[id: number]: number;
	}>({});
	const [questionCorrectAt, setQuestionCorrectAt] = useState<{
		[id: number]: number;
	}>({});

	const chaptersForSubject =
		group && subject && subjectChapters[group]?.[subject]
			? subjectChapters[group][subject]
			: [];

	// --- Helper functions ---
	const resetPracticeState = () => {
		setMistakes([]);
		setReviewIndex(0);
		setPracticeMessage("");
		setHasChecked(false);
		setSelectedOptionColor({});
		setEverWrong({});
		setUserAnswers({});
		setQuestionAttempts({});
		setQuestionCorrectAt({});
	};

	const getExplanationMessage = (question: Question, isCorrect: boolean) => {
		const correctOption = `${question.correct_answer}. ${question.options[question.correct_answer]}`;
		if (isCorrect) {
			return `✅ ${lang === "bn" ? "সঠিক উত্তর" : "Correct"}\n\n📘 ${question.explanation}`;
		} else {
			return `❌ ${lang === "bn" ? "ভুল উত্তর" : "Wrong"}\n\n${
				lang === "bn" ? "সঠিক উত্তর" : "Correct answer"
			}: ${correctOption}\n\n📘 ${question.explanation}`;
		}
	};

	// --- Load questions ---
	const loadQuestions = async () => {
		if (selectedChapters.length === 0) {
			alert(
				lang === "bn"
					? "অনুগ্রহ করে অন্তত একটি অধ্যায় নির্বাচন করুন"
					: "Please select at least one chapter",
			);
			return;
		}

		try {
			const allQuestions: Question[] = [];
			for (const chapterId of selectedChapters) {
				const chapter = chaptersForSubject.find((c) => c.name === chapterId);
				if (chapter && chapter.url && chapter.url !== "#") {
					const response = await fetch(chapter.url);
					const data = await response.json();
					allQuestions.push(...data);
				}
			}
			if (allQuestions.length === 0) {
				alert(lang === "bn" ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No questions found");
				return;
			}
			const shuffled = allQuestions.sort(() => 0.5 - Math.random());
			const selected = shuffled.slice(
				0,
				Math.min(questionCount, allQuestions.length),
			);
			setQuestions(selected);

			if (mode === "practice") {
				resetPracticeState();
				setExamState("running_practice");
			} else {
				setExamState("running_exam");
				setTimeLeft(duration * 60);
			}
		} catch (error) {
			console.error("প্রশ্ন লোড করতে সমস্যা:", error);
			alert(
				lang === "bn"
					? "প্রশ্ন লোড করা যায়নি। আবার চেষ্টা করুন।"
					: "Failed to load questions. Please try again.",
			);
		}
	};

	// --- Exam mode submit ---
	const handleSubmitExam = useCallback(async () => {
		if (isSubmitting.current) return;
		isSubmitting.current = true;

		let correct = 0;
		const results: ResultItem[] = questions.map((q) => {
			const userAns = userAnswers[q.id];
			const isCorrect = userAns === q.correct_answer;
			if (isCorrect) correct++;
			return {
				...q,
				userAnswer: userAns,
				isCorrect,
				correctAnswer: q.correct_answer,
			};
		});

		const totalQuestions = questions.length;
		const wrongAnswers = totalQuestions - correct;
		const timeTaken = duration * 60 - timeLeft;

		setResult({
			total: totalQuestions,
			correct,
			results,
			timeSpent: timeTaken,
		});
		setExamState("finished");

		if (user) {
			try {
				await examService.saveResult({
					subject_name: subjectName || "General",
					score: correct,
					total_questions: totalQuestions,
					correct_answers: correct,
					wrong_answers: wrongAnswers,
					time_taken: timeTaken,
				});

				// ভুল প্রশ্নগুলো আলাদা করে সেভ করা
				const wrongQuestions = results
					.filter((r) => !r.isCorrect)
					.map((r) => {
						const { userAnswer, isCorrect, correctAnswer, ...rest } = r;
						// Mark as used for linter
						void userAnswer;
						void isCorrect;
						void correctAnswer;
						return rest;
					});

				if (wrongQuestions.length > 0) {
					await examService.saveMistakes({
						subject_name: subjectName || "General",
						mistakes: wrongQuestions,
					});
				}

				setIsSaved(true);
				console.log("Result and mistakes saved successfully!");
			} catch (error) {
				console.error("Failed to save result or mistakes:", error);
			}
		}
	}, [questions, userAnswers, duration, timeLeft, user, subjectName]);

	// --- Answer selection ---
	const handleAnswerSelect = (questionId: number, answer: string) => {
		if (hasChecked) return;
		setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
		setSelectedOptionColor((prev) => ({ ...prev, [questionId]: "" }));
	};

	// --- Timer for exam mode ---
	useEffect(() => {
		if (examState === "running_exam" && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						handleSubmitExam();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [examState, timeLeft, handleSubmitExam]);
	// --- Practice mode: check answer ---
	const handleCheckAnswer = (
		questionId: number,
		selectedAnswer: string | undefined,
	) => {
		if (!selectedAnswer) {
			setPracticeMessage(
				lang === "bn"
					? "অনুগ্রহ করে একটি উত্তর নির্বাচন করুন"
					: "Please select an answer",
			);
			return;
		}
		if (hasChecked) return;

		const question = questions.find((q) => q.id === questionId);
		if (!question) return;

		const currentAttempt = (questionAttempts[questionId] || 0) + 1;
		setQuestionAttempts((prev) => ({ ...prev, [questionId]: currentAttempt }));

		const isCorrect = selectedAnswer === question.correct_answer;
		setSelectedOptionColor((prev) => ({
			...prev,
			[questionId]: isCorrect ? "correct" : "wrong",
		}));

		const message = getExplanationMessage(question, isCorrect);
		setPracticeMessage(message);

		if (isCorrect) {
			if (!questionCorrectAt[questionId]) {
				setQuestionCorrectAt((prev) => ({
					...prev,
					[questionId]: currentAttempt,
				}));
			}
			if (mistakes.includes(questionId)) {
				setMistakes(mistakes.filter((id) => id !== questionId));
			}
		} else {
			setEverWrong((prev) => ({ ...prev, [questionId]: true }));
			if (!mistakes.includes(questionId)) {
				setMistakes([...mistakes, questionId]);
			}
		}

		setHasChecked(true);
	};

	// --- Practice mode: next or result ---
	const handleNextOrResult = () => {
		if (!hasChecked) return;

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setHasChecked(false);
			setPracticeMessage("");
			setSelectedOptionColor({});
		} else {
			// শেষ প্রশ্ন শেষে
			if (mistakes.length > 0) {
				setExamState("practice_review");
				setReviewIndex(0);
				setHasChecked(false);
				setPracticeMessage("");
				setSelectedOptionColor({});
			} else {
				generatePracticeResult();
			}
		}
	};

	// --- Review mode: check answer (NO auto next) ---
	const handleReviewCheck = (
		questionId: number,
		selectedAnswer: string | undefined,
	) => {
		if (!selectedAnswer) {
			setPracticeMessage(
				lang === "bn"
					? "অনুগ্রহ করে একটি উত্তর নির্বাচন করুন"
					: "Please select an answer",
			);
			return;
		}
		if (hasChecked) return;

		const question = questions.find((q) => q.id === questionId);
		if (!question) return;

		const currentAttempt = (questionAttempts[questionId] || 0) + 1;
		setQuestionAttempts((prev) => ({ ...prev, [questionId]: currentAttempt }));

		const isCorrect = selectedAnswer === question.correct_answer;
		setSelectedOptionColor((prev) => ({
			...prev,
			[questionId]: isCorrect ? "correct" : "wrong",
		}));

		const message = getExplanationMessage(question, isCorrect);
		setPracticeMessage(message);

		// উত্তর সঠিক হলে শুধু ট্র্যাকিং আপডেট হবে, mistakes লিস্ট ফিল্টার হবে না
		if (isCorrect) {
			if (!questionCorrectAt[questionId]) {
				setQuestionCorrectAt((prev) => ({
					...prev,
					[questionId]: currentAttempt,
				}));
			}
		} else {
			setEverWrong((prev) => ({ ...prev, [questionId]: true }));
		}

		// Next বাটন চালু হবে
		setHasChecked(true);
	};

	// --- Review mode: next or result ---
	const handleReviewNextOrResult = () => {
		if (!hasChecked) return;

		const currentQuestionId = mistakes[reviewIndex];
		const question = questions.find((q) => q.id === currentQuestionId);

		// চেক করা যে ইউজার সঠিক উত্তর দিয়েছে কি না
		const isCorrect =
			userAnswers[currentQuestionId] === question?.correct_answer;

		let newMistakes = [...mistakes];

		if (isCorrect) {
			// যদি উত্তর সঠিক হয়, তবে mistakes লিস্ট থেকে এটি বাদ দিন
			newMistakes = mistakes.filter((id) => id !== currentQuestionId);
			setMistakes(newMistakes);

			// যেহেতু আইটেম কমে গেছে, ইনডেক্স বাড়ানোর প্রয়োজন নেই (পরের আইটেম অটো এই ইনডেক্সে আসবে)
			// তবে যদি এটিই শেষ আইটেম হয়, তবে রেজাল্ট দেখাবে
			if (newMistakes.length === 0) {
				generatePracticeResult();
				return;
			}

			// যদি একদম শেষের আইটেমটি সঠিক হয়, তবে ইনডেক্স এক কমাতে হতে পারে
			if (reviewIndex >= newMistakes.length) {
				setReviewIndex(newMistakes.length - 1);
			}
		} else {
			// যদি উত্তর ভুল হয়, তবে ইনডেক্স বাড়িয়ে পরের ভুল প্রশ্নে যাবে
			if (reviewIndex < mistakes.length - 1) {
				setReviewIndex((prev) => prev + 1);
			} else {
				// সব ভুল প্রশ্ন দেখা শেষ হলে রেজাল্ট
				generatePracticeResult();
				return;
			}
		}

		// পরবর্তী প্রশ্নের জন্য UI রিসেট
		setHasChecked(false);
		setPracticeMessage("");
		setSelectedOptionColor({});

		// পরবর্তী প্রশ্নের আইডি অনুযায়ী ইউজার অ্যানসার ফিল্ড খালি করা (ঐচ্ছিক)
		const nextMistakeId = newMistakes[reviewIndex];
		if (nextMistakeId) {
			setUserAnswers((prev) => ({ ...prev, [nextMistakeId]: "" }));
		}
	};

	// --- Generate practice result ---
	const generatePracticeResult = () => {
		const results: ResultItem[] = questions.map((q) => {
			const userAns = userAnswers[q.id];
			const isCorrect = userAns === q.correct_answer;
			return {
				...q,
				userAnswer: userAns,
				isCorrect,
				correctAnswer: q.correct_answer,
				everWrong: everWrong[q.id] || false,
			};
		});
		setResult({
			total: questions.length,
			correct: results.filter((r) => r.isCorrect).length,
			results,
		});
		setExamState("practice_completed");
	};

	// --- Reset to setup ---
	const resetToSetup = () => {
		isSubmitting.current = false;
		setIsSaved(false);
		setExamState("setup");
		setSelectedChapters([]);
		setUserAnswers({});
		setResult(null);

		// ম্যানুয়ালি ইনডেক্স এবং অন্যান্য প্র্যাকটিস স্টেট রিসেট করুন
		setReviewIndex(0); // এই লাইনটি নিশ্চিত করুন
		setCurrentQuestionIndex(0); // প্রথম থেকে শুরু করার জন্য
		setHasChecked(false);
		setPracticeMessage("");
		setSelectedOptionColor({});
		setMistakes([]); // সব ভুল মুছে নতুন করে শুরু করতে চাইলে

		// যদি resetPracticeState() এর ভেতর এই কাজগুলো না থাকে, তবে এখানে করুন
		resetPracticeState();
	};

	// --- Set group/subject ---
	const setGroupSubject = (g: string | null, s: string | null) => {
		setGroup(g);
		setSubject(s);
	};

	// --- Hide mobile nav during exam ---
	useEffect(() => {
		if (examState === "running_exam" || examState === "running_practice") {
			document.body.classList.add("hide-mobile-nav");
		} else {
			document.body.classList.remove("hide-mobile-nav");
		}
		return () => document.body.classList.remove("hide-mobile-nav");
	}, [examState]);

	return {
		lang,
		group,
		subject,
		chaptersForSubject,
		selectedChapters,
		setSelectedChapters,
		duration,
		setDuration,
		questionCount,
		setQuestionCount,
		examState,
		mode,
		setMode,
		questions,
		currentQuestionIndex,
		userAnswers,
		timeLeft,
		result,
		mistakes,
		reviewIndex,
		practiceMessage,
		hasChecked,
		selectedOptionColor,
		everWrong,
		isSaved,
		subjectName,
		loadQuestions,
		handleAnswerSelect,
		handleSubmitExam,
		handleCheckAnswer,
		handleNextOrResult,
		handleReviewCheck,
		handleReviewNextOrResult,
		resetToSetup,
		setGroupSubject,
		// setters needed for components
		setHasChecked,
		setPracticeMessage,
		setSelectedOptionColor,
		setUserAnswers,
	};
};
