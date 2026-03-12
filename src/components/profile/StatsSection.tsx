import { History } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTimeAgo } from "../../typescriptfile/utils";

interface StatsSectionProps {
  isOwnProfile: boolean;
  stats: any[];
  isStatsLoading: boolean;
}

const StatsSection = ({ isOwnProfile, stats, isStatsLoading }: StatsSectionProps) => {
  const { lang } = useLanguage();

  if (!isOwnProfile) return null;

  const totalExams = stats.length;
  const avgScore =
    totalExams > 0
      ? Math.round(
          stats.reduce(
            (acc, curr) =>
              acc + (Number(curr.correct_answers) / Number(curr.total_questions)) * 100,
            0
          ) / totalExams
        )
      : 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
          <span className="text-xl font-black block mb-0.5 text-gray-900 dark:text-white">
            {isStatsLoading ? "..." : totalExams.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">
            {lang === "bn" ? "মোট পরীক্ষা" : "Exams Taken"}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
          <span className="text-xl font-black block mb-0.5 text-gray-900 dark:text-white">
            {isStatsLoading ? "..." : `${avgScore}%`}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-purple-500">
            {lang === "bn" ? "গড় স্কোর" : "Avg Score"}
          </span>
        </div>
      </div>

      {/* Recent Exams */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-3">
          <History className="text-blue-600" size={20} />
          {lang === "bn" ? "সাম্প্রতিক পরীক্ষা" : "Recent Exams"}
        </h3>
        <div className="space-y-3 md:space-y-4">
          {isStatsLoading ? (
            <p className="text-center py-4 text-gray-400 text-sm">Loading activity...</p>
          ) : stats.length > 0 ? (
            stats.slice(0, 3).map((exam, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl md:rounded-2xl"
              >
                <div>
                  <p className="font-black text-gray-800 dark:text-gray-200 text-sm md:text-base">
                    {exam.subject_name}
                  </p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">
                    {getTimeAgo(exam.created_at, lang)} •{" "}
                    {exam.time_taken ? (
                      lang === "bn"
                        ? `${Math.floor(exam.time_taken / 60)}মি. ${exam.time_taken % 60}সে.`
                        : `${Math.floor(exam.time_taken / 60)}m ${exam.time_taken % 60}s`
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600 text-sm md:text-base">
                    {exam.correct_answers}/{exam.total_questions}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">No exams taken yet.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatsSection;