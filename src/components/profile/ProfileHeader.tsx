import Link from "next/link";

import { Edit3, LayoutDashboard, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

interface ProfileHeaderProps {
  isOwnProfile: boolean;
  profileUser: any; // used only for name when not own profile
  onEdit: () => void;
  onBlock: () => void;
}

const ProfileHeader = ({ isOwnProfile, profileUser, onEdit, onBlock }: ProfileHeaderProps) => {
  const { confirmLogout } = useAuth();
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-5">
      <div>
        <h1 className="text-2xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          {isOwnProfile ? "প্রোফাইল" : profileUser.name}
        </h1>
        {isOwnProfile && (
          <button
            onClick={onEdit}
            className="mt-1 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs"
          >
            <Edit3 size={12} />
            {lang === "bn" ? "তথ্য পরিবর্তন করুন" : "Edit Information"}
          </button>
        )}
      </div>

      <div className="flex gap-2 md:gap-3">
        {isOwnProfile ? (
          <>
            <Link
              href="/dashboard"
              className="flex-1 md:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={12} />
              {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </Link>
            <button
              onClick={confirmLogout}
              className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LogOut size={12} />
              {lang === "bn" ? "লগ আউট" : "Logout"}
            </button>
          </>
        ) : (
          <button
            onClick={onBlock}
            className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
          >
            <ShieldAlert size={14} />
            {lang === "bn" ? "ব্লক করুন" : "Block"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;