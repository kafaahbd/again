import { subjectChapters } from "../data/subjectChapters";

export const getGroupName = (group: string | null, lang: "bn" | "en"): string => {
  if (!group) return "";
  const groupMap = {
    bn: { ssc: "এসএসসি", hsc: "এইচএসসি", admission: "এডমিশন" },
    en: { ssc: "SSC", hsc: "HSC", admission: "Admission" },
  };
  if (group === "ssc" || group === "hsc" || group === "admission") {
    return groupMap[lang][group];
  }
  return group;
};

export const getSubjectName = (subject: string | null, lang: "bn" | "en"): string => {
  if (!subject) return "";
  const subjectNames = {
    bn: {
      bangla: "বাংলা",
      english: "ইংরেজি",
      ict: "আইসিটি",
      math: "গণিত",
      islam: "ইসলাম শিক্ষা",
      physics: "পদার্থ",
      chemistry: "রসায়ন",
      biology: "জীববিজ্ঞান",
      history: "ইতিহাস",
      civics: "পৌরনীতি",
      geography: "ভূগোল",
      accounting: "হিসাববিজ্ঞান",
      business: "ব্যবসায় উদ্যোগ",
      finance: "ফাইন্যান্স",
      highermath: "উচ্চতর গণিত",
      agriculture: "কৃষি",
      health: "স্বাস্থ্য",
      management: "ব্যবস্থাপনা",
      marketing: "মার্কেটিং",
      "engineering-physics": "ইঞ্জিনিয়ারিং পদার্থ",
      "engineering-chemistry": "ইঞ্জিনিয়ারিং রসায়ন",
      "engineering-math": "ইঞ্জিনিয়ারিং গণিত",
      "engineering-highermath": "ইঞ্জিনিয়ারিং উচ্চতর গণিত",
      "medical-physics": "মেডিকেল পদার্থ",
      "medical-chemistry": "মেডিকেল রসায়ন",
      "medical-biology": "মেডিকেল জীববিজ্ঞান",
      "university-bangla": "বিশ্ববিদ্যালয় বাংলা",
      "university-english": "বিশ্ববিদ্যালয় ইংরেজি",
      "university-gk": "সাধারণ জ্ঞান",
    },
    en: {
      bangla: "Bangla",
      english: "English",
      ict: "ICT",
      math: "Math",
      islam: "Islamic Studies",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      history: "History",
      civics: "Civics",
      geography: "Geography",
      accounting: "Accounting",
      business: "Business Entrepreneurship",
      finance: "Finance",
      highermath: "Higher Math",
      agriculture: "Agriculture",
      health: "Health Science",
      management: "Management",
      marketing: "Marketing",
      "engineering-physics": "Engineering Physics",
      "engineering-chemistry": "Engineering Chemistry",
      "engineering-math": "Engineering Math",
      "engineering-highermath": "Engineering Higher Math",
      "medical-physics": "Medical Physics",
      "medical-chemistry": "Medical Chemistry",
      "medical-biology": "Medical Biology",
      "university-bangla": "University Bangla",
      "university-english": "University English",
      "university-gk": "General Knowledge",
    },
  };
  const keys = lang === "bn" ? subjectNames.bn : subjectNames.en;
  if (subject in keys) return keys[subject as keyof typeof keys];
  return subject;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const getProfileColor = (name: string): string => {
  const colors = [
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-purple-500 to-fuchsia-500",
    "from-cyan-500 to-blue-500",
    "from-red-500 to-rose-500",
    "from-lime-500 to-green-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getTimeAgo = (dateString: string, lang: "bn" | "en"): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const mins = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 3) {
    return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (mins > 0) return `${mins}m`;
  return lang === "bn" ? "এখনই" : "Just now";
};