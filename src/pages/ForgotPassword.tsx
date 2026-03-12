"use client";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, AlertCircle, Send } from "lucide-react";

const ForgotPassword = () => {
  const { lang } = useLanguage();
  const navigate = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক ইমেইল দিন' : 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      
      // Navigate to verification page with query params
      navigate.push(`/verify-code?email=${encodeURIComponent(email)}&isPasswordReset=true&timestamp=${new Date().getTime()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'ইমেইলটি পাওয়া যায়নি বা কোনো সমস্যা হয়েছে' : 'Email not found or something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform">
            <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" alt="Kafa'ah" className="h-20 mx-auto mb-4" />
          </Link>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
            {lang === 'bn' ? 'পাসওয়ার্ড উদ্ধার' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {lang === 'bn' ? 'আপনার অ্যাকাউন্টের ইমেইলটি লিখুন' : 'Enter the email associated with your account'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-orange-100/50 dark:shadow-none p-8 md:p-10 relative overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 ml-1">
                {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-orange-500/30 rounded-2xl focus:ring-4 focus:ring-orange-500/5 dark:text-white outline-none font-bold transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-200 dark:shadow-none hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} />
                  {lang === 'bn' ? 'ভেরিফিকেশন কোড পাঠান' : 'Send Reset Code'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-800 pt-8">
            <Link 
              href="/login" 
              className="group inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              {lang === 'bn' ? 'লগইন-এ ফিরে যান' : 'Back to Login'}
            </Link>
          </div>
        </div>

        {/* Support Text */}
        <p className="text-center mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {lang === 'bn' ? 'কোনো সমস্যা হচ্ছে? আমাদের সাথে যোগাযোগ করুন' : 'Having issues? Contact support'}
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;