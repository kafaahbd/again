"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams!.get('email');
  const code = searchParams!.get('code');
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    const pass = password;
    let score = 0;
    const suggestions: string[] = [];

    if (pass.length >= 8) score++;
    else suggestions.push(lang === 'bn' ? "কমপক্ষে ৮টি অক্ষর" : "At least 8 characters");

    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "বড় ও ছোট হাতের অক্ষর" : "Upper & lower case letters");

    if (/[0-9]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "অন্তত একটি সংখ্যা" : "At least one number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "একটি বিশেষ চিহ্ন (!@#$)" : "One special character (!@#$)");

    let label = "";
    let color = "";
    switch (score) {
      case 0:
      case 1:
        label = lang === 'bn' ? "খুব দুর্বল" : "Very Weak";
        color = "bg-red-500";
        break;
      case 2:
        label = lang === 'bn' ? "দুর্বল" : "Weak";
        color = "bg-orange-500";
        break;
      case 3:
        label = lang === 'bn' ? "মাঝারি" : "Medium";
        color = "bg-yellow-500";
        break;
      case 4:
        label = lang === 'bn' ? "শক্তিশালী" : "Strong";
        color = "bg-emerald-500";
        break;
    }

    return { score, label, color, suggestions };
  }, [password, lang]);

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    
    retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    retVal += "0123456789"[Math.floor(Math.random() * 10)];
    retVal += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    for (let i = 4; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(retVal);
    setConfirmPassword(retVal);
    setShowPassword(true);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
        setError(lang === 'bn' ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
        return;
    }

    if (passwordStrength.score < 4) {
      setError(lang === 'bn' 
        ? "পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।" 
        : "Password must be at least 8 characters and include letters, numbers, and special characters.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        email, code, newPassword: password
      });
      router.push(`/login?message=${encodeURIComponent(lang === 'bn' ? "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে" : "Password reset successful")}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex flex-col items-center justify-center px-4 py-10 transition-colors relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] -ml-40 -mt-40"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-gray-800/50 p-8 lg:p-10 relative overflow-hidden text-center">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="mb-8">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-500/20">
                <i className="fas fa-key text-emerald-600 dark:text-emerald-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {lang === 'bn' ? "নতুন পাসওয়ার্ড" : "New Password"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] mt-2">
              Secure your account with a strong password
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-[10px] font-black uppercase text-left rounded-r-xl"
              >
                <i className="fas fa-exclamation-triangle mr-2"></i> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4 text-left">
              {/* Password Input */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">
                    {lang === 'bn' ? "পাসওয়ার্ড" : "Password"}
                  </label>
                  <button type="button" onClick={generateStrongPassword} className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 hover:underline">
                    {lang === 'bn' ? "শক্তিশালী পাসওয়ার্ড" : "Suggest"}
                  </button>
                </div>
                <div className="relative group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-5 pr-12 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                </div>

                {/* Strength Meter */}
                <AnimatePresence>
                    {password && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2 p-3 bg-slate-50/50 dark:bg-gray-800/20 rounded-xl border border-slate-100 dark:border-gray-800">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">{lang === 'bn' ? "শক্তি" : "Strength"}:</span>
                                <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-200 dark:bg-gray-700 rounded-full flex gap-1 overflow-hidden">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className={`h-full flex-1 transition-all duration-500 ${step <= passwordStrength.score ? passwordStrength.color : 'bg-transparent'}`} />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {passwordStrength.suggestions.map((s, i) => (
                                    <span key={i} className="text-[8px] font-bold text-slate-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-700">+ {s}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">
                  {lang === 'bn' ? "নিশ্চিত করুন" : "Confirm Password"}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (
                <>
                  {lang === 'bn' ? "পাসওয়ার্ড আপডেট করুন" : "Update Password"}
                  <i className="fas fa-check-circle text-xs"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-gray-800/50">
            <Link href="/login" className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 font-black uppercase tracking-widest text-[10px] transition-colors">
              <i className="fas fa-arrow-left mr-2"></i> {lang === 'bn' ? "লগইন এ ফিরে যান" : "Back to Login"}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;