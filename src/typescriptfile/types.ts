export interface Chapter {
	name: string;
	url: string;
}

export interface Question {
	id: number;
	question: string;
	options: {
		[key: string]: string;
	};
	correct_answer: string;
	explanation: string;
}

export interface ResultItem extends Question {
	userAnswer: string | undefined;
	isCorrect: boolean;
	correctAnswer: string;
	everWrong?: boolean;
	// for practice review
}

export type ExamState =
	| "setup"
	| "running_practice"
	| "running_exam"
	| "practice_review"
	| "practice_completed"
	| "finished";

export interface ExamHookState {
	lang: "en" | "bn";
	group: string | null;
	subject: string | null;
	chaptersForSubject: Chapter[];
	selectedChapters: string[];
	setSelectedChapters: (chapters: string[]) => void;
	duration: number;
	setDuration: (duration: number) => void;
	questionCount: number;
	setQuestionCount: (count: number) => void;
	examState: ExamState;
	mode: "practice" | "exam";
	setMode: (mode: "practice" | "exam") => void;
	questions: Question[];
	currentQuestionIndex: number;
	userAnswers: { [id: number]: string };
	timeLeft: number;
	result: {
		total: number;
		correct: number;
		results: ResultItem[];
		timeSpent?: number;
	} | null;
	mistakes: number[];
	reviewIndex: number;
	practiceMessage: string;
	hasChecked: boolean;
	selectedOptionColor: { [id: number]: string };
	everWrong: { [id: number]: boolean };
	isSaved: boolean;
	subjectName: string | null;
	loadQuestions: () => Promise<void>;
	handleAnswerSelect: (questionId: number, answer: string) => void;
	handleSubmitExam: () => Promise<void>;
	handleCheckAnswer: (questionId: number, selectedAnswer: string | undefined) => void;
	handleNextOrResult: () => void;
	handleReviewCheck: (questionId: number, selectedAnswer: string | undefined) => void;
	handleReviewNextOrResult: () => void;
	resetToSetup: () => void;
	setGroupSubject: (g: string | null, s: string | null) => void;
	setHasChecked: (val: boolean) => void;
	setPracticeMessage: (val: string) => void;
	setSelectedOptionColor: (val: { [id: number]: string }) => void;
	setUserAnswers: (val: { [id: number]: string }) => void;
}
