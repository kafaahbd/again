import Link from "next/link";

import { Phone, GraduationCap, Layers, Calendar, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getProfileColor } from "../../typescriptfile/utils";

interface ProfileCardProps {
  profileUser: any;
  isOwnProfile: boolean;
}

const ProfileCard = ({ profileUser, isOwnProfile }: ProfileCardProps) => {
  const { lang } = useLanguage();

  const getGroupName = (group: string) => {
    const groups: Record<string, string> = {
      Science: lang === "bn" ? "বিজ্ঞান" : "Science",
      Arts: lang === "bn" ? "মানবিক" : "Arts",
      Commerce: lang === "bn" ? "বাণিজ্য" : "Commerce",
    };
    return groups[group] || group;
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
        <div className="relative">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr ${
              profileUser.profile_color || getProfileColor(profileUser.name)
            } rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-3 border-4 border-white dark:border-gray-700 shadow-lg`}
          >
            {profileUser.name.charAt(0)}
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            {profileUser.name}
          </h2>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">
            @{profileUser.username}
          </p>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 text-left px-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                <Phone size={12} /> Phone
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {profileUser.phone || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                <GraduationCap size={12} /> Level
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {profileUser.study_level}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                <Layers size={12} /> Group
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {getGroupName(profileUser.group)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                <Calendar size={12} /> Exam Year
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm md:text-base">
                {profileUser.exam_year || "Not Set"}
              </span>
            </div>
          </div>

          {/* Blocked Users Link */}
          {isOwnProfile && (
            <Link
              href="/blocked-users"
              className="flex items-center justify-center gap-2 w-full py-3 mt-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-100 transition-colors"
            >
              <ShieldAlert size={16} />
              {lang === "bn" ? "ব্লক লিস্ট দেখুন" : "View Blocked Users"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;