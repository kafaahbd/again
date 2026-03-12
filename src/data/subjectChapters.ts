export interface Chapter {
	name: string;
	url: string;
}

export interface SubjectChapters {
	[group: string]: {
		[subject: string]: Chapter[];
	};
}

export const subjectChapters: SubjectChapters = {
	// ========== SSC ==========
	ssc: {
		// Common Subjects
		bangla: [
			// TODO: বাংলার JSON URL যোগ করুন
			{
				name: "বাংলা ১ম পত্র নাটক : বহিপীর",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/ssc_bohipir.json",
			},
			{ name: "বাংলা ১ম পত্র অধ্যায় ২", url: "#" },
		],
		english: [
			{ name: "English 1st Paper Chapter 1", url: "#" },
			{
				name: "English 2nd Paper : Changing Sentence",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_changing.json",
			},
			{
				name: "English 2nd Paper : Right Form Of Verb",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_rightformofverb.json",
			},
			{
				name: "English 2nd Paper : Word Meaning",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_wordmeaning.json",
			},
			{
				name: "English 2nd Paper Chapter : Completing Sentence",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/Completing.json",
			},
		],
		ict: [{ name: "ICT অধ্যায় ১", url: "#" }],
		math: [
			{
				name: "সাধারণ গণিত অধ্যায় ২",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Ssc_math_2.json",
			},
			{
				name: "সাধারণ গণিত অধ্যায় ৩",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Math_3_ssc.json",
			},
		],
		islam: [{ name: "ইসলাম শিক্ষা অধ্যায় ১", url: "#" }],
		// Science
		physics: [
			{
				name: "পদার্থ ১ম পত্র অধ্যায় ২",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Physics_2_ssc.json",
			},
			{ name: "পদার্থ ১ম পত্র অধ্যায় ৪", url: "#" },
		],
		chemistry: [{ name: "রসায়ন ১ম পত্র অধ্যায় ১", url: "#" }],
		biology: [{ name: "জীববিজ্ঞান অধ্যায় ১", url: "#" }],
		// Arts
		history: [{ name: "ইতিহাস অধ্যায় ১", url: "#" }],
		civics: [{ name: "পৌরনীতি অধ্যায় ৪", url: "#" }],
		geography: [{ name: "ভূগোল অধ্যায় ১", url: "#" }],
		// Commerce
		accounting: [{ name: "হিসাববিজ্ঞান অধ্যায় ১", url: "#" }],
		business: [{ name: "ব্যবসায় উদ্যোগ অধ্যায় ১", url: "#" }],
		finance: [{ name: "ফাইন্যান্স অধ্যায় ১", url: "#" }],
		// Optional
		highermath: [{ name: "উচ্চতর গণিত অধ্যায় ১", url: "#" }],
		agriculture: [{ name: "কৃষি শিক্ষা অধ্যায় ১", url: "#" }],
		health: [{ name: "স্বাস্থ্য বিজ্ঞান অধ্যায় ১", url: "#" }],
	},

	// ========== HSC ==========
	hsc: {
		// Common
		bangla: [
			{
				name: "বাংলা ১ম পত্র গদ্য : অপরিচিতা",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_bangla_1st_paper_oporichita.json",
			},
			{
				name: "বাংলা ১ম পত্র গদ্য : বিলাসী",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_bangla_1st_paper_bilasy.json",
			},
			{
				name: "বাংলা ১ম পত্র পদ্য : ঋতু বর্ণন",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_bangla_1st_paper_ritubornon.json",
			},
			{ name: "বাংলা ২য় পত্র অধ্যায় ১", url: "#" },
		],
		english: [
			{
				name: "English 2nd Paper : Changing Sentence",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_changing.json",
			},
			{
				name: "English 2nd Paper : Right Form Of Verb",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_rightformofverb.json",
			},
			{
				name: "English 2nd Paper : Synonym & Antonym",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_synanty.json",
			},
			{
				name: "English 2nd Paper : Word Meaning",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_english_2nd_paper_wordmeaning.json",
			},
			{
				name: "English 2nd Paper : Modifier",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Eng_modifuer.json",
			},
			{
				name: "English 2nd Paper : Words and Phrases",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Phrases.json",
			},
			{
				name: "English 2nd Paper : Preposition",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Prepositions.json",
			},
			{
				name: "English 2nd Paper Chapter : Completing Sentence",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/Completing.json",
			},
			{ name: "English 2nd Paper Chapter 1", url: "#" },
		],
		ict: [
			{
				name: "ICT অধ্যায় ১",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Ict_1_hsc.json",
			},
			{
				name: "ICT অধ্যায় ৫",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/ict_hsc_5.json",
			},
		],
		// Science
		physics: [
			{
				name: "পদার্থ ১ম পত্র অধ্যায় ৩ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_physcis_chapter_3_1st_paper.json",
			},
			{
				name: "পদার্থ ১ম পত্র অধ্যায় ৪ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_physcis_chapter_4_1st_paper.json",
			},
			{
				name: "পদার্থ ১ম পত্র অধ্যায়  ৬",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Physics_6_hsc_1st",
			},
			// অন্যান্য অধ্যায়
		],
		chemistry: [
			{ name: "রসায়ন ১ম পত্র অধ্যায় ১", url: "#" },
			{
				name: "রসায়ন ১ম পত্র অধ্যায় ২ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_chemistry_chapter_2_1st_paper.json",
			},
		],
		biology: [
			{
				name: "জীববিজ্ঞান ১ম পত্র অধ্যায় ১ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_biology_chapter_1_1st_paper.json",
			},
			{
				name: "জীববিজ্ঞান ১ম পত্র অধ্যায় ২ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_biology_1st_paper_chapter_2.json",
			},
			{
				name: "জীববিজ্ঞান ১ম পত্র অধ্যায় ৩ ",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Botany-3.json",
			},
			{
				name: "জীববিজ্ঞান ২য় পত্র অধ্যায় ১ ",
				url: "https://raw.githubusercontent.com/kafaahbd/nothing/refs/heads/main/hsc_biology_2nd_paper_chapter_1.json",
			},
		],
		highermath: [
			{
				name: "উচ্চতর গণিত ১ম পত্র অধ্যায় ৭",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/trigonometry_hsc_7.json",
			},
		],
		// Arts
		history: [{ name: "ইতিহাস অধ্যায় ১", url: "#" }],
		logic: [
			{
				name: "যুক্তিবিদ্যা ১ম পত্র অধ্যায় ২",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Logic_1_2chp",
			},
		],
		islamic: [{ name: "ইসলামের ইতিহাস অধ্যায় ১", url: "#" }],
		civics: [
			{
				name: "পৌরনীতি 2য় পত্র অধ্যায় 4",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/Civic_2nd_4",
			},
		],
		economics: [{ name: "অর্থনীতি অধ্যায় ১", url: "#" }],
		geography: [{ name: "ভূগোল অধ্যায় ১", url: "#" }],
		// Commerce
		accounting: [
			{ name: "হিসাববিজ্ঞান ১ম পত্র অধ্যায় ১", url: "#" },
			{ name: "হিসাববিজ্ঞান ২য় পত্র অধ্যায় ১", url: "#" },
		],
		management: [{ name: "ব্যবস্থাপনা অধ্যায় ১", url: "#" }],
		finance: [{ name: "ফাইন্যান্স অধ্যায় ১", url: "#" }],
		business: [{ name: "ব্যবসায় সংগঠন অধ্যায় ১", url: "#" }],
		marketing: [{ name: "মার্কেটিং অধ্যায় ১", url: "#" }],
	},

	// ========== Admission ==========
	admission: {
		"engineering-physics": [
			{ name: "পদার্থ (ইঞ্জিনিয়ারিং) অধ্যায় ১", url: "#" },
		],
		"engineering-chemistry": [
			{ name: "রসায়ন (ইঞ্জিনিয়ারিং) অধ্যায় ১", url: "#" },
		],
		"engineering-math": [{ name: "গণিত (ইঞ্জিনিয়ারিং) অধ্যায় ১", url: "#" }],
		"engineering-highermath": [
			{
				name: "উচ্চতর গণিত (ইঞ্জিনিয়ারিং) অধ্যায় ৭",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/engineering_hm_7.json",
			},
		],
		"medical-physics": [{ name: "পদার্থ (মেডিকেল) অধ্যায় ১", url: "#" }],
		"medical-chemistry": [{ name: "রসায়ন (মেডিকেল) অধ্যায় ১", url: "#" }],
		"medical-biology": [{ name: "জীববিজ্ঞান (মেডিকেল) অধ্যায় ১", url: "#" }],
		"university-bangla": [{ name: "বাংলা (বিশ্ববিদ্যালয়) অধ্যায় ১", url: "#" }],
		"university-english": [
			{ name: "ইংরেজি (বিশ্ববিদ্যালয়) অধ্যায় ১", url: "#" },
		],
		"university-gk": [
			{
				name: "সাধারণ জ্ঞান বাংলাদেশ বিষয়ক",
				url: "https://raw.githubusercontent.com/kafaahbd/Question/refs/heads/main/University_gk_bd.json",
			},
		],
	},
};
