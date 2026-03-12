"use client";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useRouter, useParams } from "next/navigation";

import { useEffect, useState } from "react";
import { getUserExamHistory } from "../services/examService";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCard from "../components/profile/ProfileCard";
import StatsSection from "../components/profile/StatsSection";
import PostsList from "../components/profile/PostsList";
import EditProfileModal from "../components/profile/EditProfileModal";
import { Loader2, MessageSquare, ShieldAlert } from "lucide-react";

const Profile = () => {
  const { user: currentUser, isLoading, updateUser } = useAuth();
  const { lang } = useLanguage();
  const { userId } = useParams();
  const navigate = useRouter();
  const isOwnProfile = !userId || userId === currentUser?.id;

  const [profileUser, setProfileUser] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [postsToShow, setPostsToShow] = useState(2);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(!isOwnProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hide_phone: false,
    study_level: "SSC" as "SSC" | "HSC",
    group: "Science" as "Science" | "Arts" | "Commerce",
    exam_year: "",
  });

  // Update visible posts when userPosts or postsToShow changes
  useEffect(() => {
    setVisiblePosts(userPosts.slice(0, postsToShow));
  }, [userPosts, postsToShow]);

  const handleShowMore = () => {
    setPostsToShow((prev) => prev + 4);
  };

  // Fetch profile data, stats, and posts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOwnProfile) {
        if (currentUser) {
          setProfileUser(currentUser);
          setIsProfileLoading(false);
        }
      } else if (userId) {
        setIsProfileLoading(true);
        try {
          const data = await forumService.getUserProfile(userId);
          setProfileUser(data || null);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setProfileUser(null);
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    const fetchStats = async () => {
      if (!isOwnProfile) {
        setIsStatsLoading(false);
        return;
      }
      try {
        const data = await getUserExamHistory();
        setStats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      const targetId = userId || currentUser?.id;
      if (!targetId) return;
      setIsPostsLoading(true);
      try {
        const data = await forumService.getUserPosts(targetId);
        setUserPosts(data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      } finally {
        setIsPostsLoading(false);
      }
    };

    fetchProfileData();
    fetchStats();
    fetchUserPosts();

    if (currentUser && isOwnProfile) {
      setFormData({
        name: currentUser.name,
        phone: currentUser.phone || "",
        hide_phone: currentUser.hide_phone || false,
        study_level: currentUser.study_level,
        group: currentUser.group,
        exam_year: currentUser.exam_year || "",
      });
    }
  }, [userId, currentUser, isOwnProfile]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
      setToast({ msg: lang === "bn" ? "প্রোফাইল আপডেট হয়েছে" : "Profile updated", type: "success" });
    } catch {
      setToast({ msg: "Update failed!", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const handleBlock = async () => {
    if (!userId) return;
    try {
      await forumService.blockUser(userId);
      setToast({ msg: lang === "bn" ? "ইউজার ব্লক করা হয়েছে" : "User blocked", type: "success" });
      setTimeout(() => navigate("/forum"), 1500);
    } catch {
      setToast({ msg: "Failed to block", type: "error" });
    }
  };

  const handleToggleReact = async (postId: string) => {
    if (!currentUser) return;
    setUserPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const is_reacted = !p.is_reacted;
          const react_count = is_reacted ? Number(p.react_count) + 1 : Number(p.react_count) - 1;
          return { ...p, is_reacted, react_count };
        }
        return p;
      })
    );
    try {
      await forumService.toggleReact(postId);
    } catch {
      // Rollback
      const targetId = userId || currentUser?.id;
      if (targetId) {
        const data = await forumService.getUserPosts(targetId);
        setUserPosts(data);
      }
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-slate-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (!currentUser && isOwnProfile) {
    if (typeof window !== 'undefined') {
      navigate.push('/login');
    }
    return null;
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-900 p-4">
        <ShieldAlert size={60} className="text-red-500 mb-4 opacity-20" />
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          {lang === "bn" ? "ইউজার পাওয়া যায়নি" : "User Not Found"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {lang === "bn" ? "এই প্রোফাইলটি বর্তমানে উপলব্ধ নেই।" : "This profile is currently unavailable."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
        >
          {lang === "bn" ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-2 pb-6 md:pt-4 md:pb-8 px-3 md:px-6 transition-colors font-sans">
      <SEO
        title={`${profileUser.name} - Kafa'ah`}
        description={lang === "bn" ? "প্রোফাইল তথ্য এবং পোস্ট দেখুন।" : "View profile information and posts."}
        image="https://study.kafaahbd.com/stufy.jpg"
        url={`/profile/${profileUser.id}`}
      />

      <ConfirmModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlock}
        title={lang === "bn" ? "ইউজার ব্লক করবেন?" : "Block User?"}
        message={
          lang === "bn"
            ? "এই ইউজারকে ব্লক করলে তার কোনো পোস্ট আপনি দেখতে পাবেন না।"
            : "If you block this user, you won't be able to see their posts."
        }
        confirmText={lang === "bn" ? "ব্লক করুন" : "Block"}
        type="danger"
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-5xl mx-auto">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          profileUser={profileUser}
          onEdit={() => setIsEditing(true)}
          onBlock={() => setIsBlockModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <ProfileCard profileUser={profileUser} isOwnProfile={isOwnProfile} />

          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <StatsSection
              isOwnProfile={isOwnProfile}
              stats={stats}
              isStatsLoading={isStatsLoading}
            />

            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3 px-2">
                <MessageSquare className="text-indigo-600" size={20} />
                {lang === "bn" ? "পোস্টসমূহ" : "Posts"}
              </h3>

              <PostsList
                userPosts={userPosts}
                visiblePosts={visiblePosts}
                isPostsLoading={isPostsLoading}
                postsToShow={postsToShow}
                onShowMore={handleShowMore}
                onToggleReact={handleToggleReact}
                profileUser={profileUser}
              />
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
};

export default Profile;