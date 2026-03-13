"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";

const Login = () => {
  const { t, lang } = useLanguage();
  const { login, isLoading, user, api } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  useEffect(() => {
    const msg = searchParams!.get('message');
    if (msg) {
      setSuccessMessage(msg);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setNeedsVerification(false);
    setResendSuccess("");

    try {
      await login(identifier, password);
      router.push("/");
    } catch (err: any) {
      if (err.needsVerification || err.status === 403) {
        setNeedsVerification(true);
        setUnverifiedEmail(err.email || identifier);
        setError(lang === 'bn' ? "আপনার অ্যাকাউন্টটি ভেরিফাই করা নেই।" : "Your account is not verified.");
      } else {
        setError(err.message || (lang === 'bn' ? "লগইন ব্যর্থ হয়েছে।" : "Login failed."));
      }
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess("");
    setError("");

    try {
      await api.post(`/auth/resend-code`, {
        email: unverifiedEmail,
      });
      setResendSuccess(lang === 'bn' ? "কোড পুনরায় পাঠানো হয়েছে!" : "Verification code resent!");
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? "কোড পাঠাতে ব্যর্থ হয়েছে।" : "Failed to resend code."));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex flex-col items-center justify-center px-4 py-8 lg:py-0 transition-colors relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>
        {/* Islamic Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
      </div>

      <SEO 
        title={lang === "bn" ? "লগইন - কাফআহ" : "Login - Kafa'ah"} 
        image="https://study.kafaahbd.com/stufy.jpg"
        url="/login"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10"
      >
        {/* Left Side: Branding (PC Focused) */}
        <div className="text-center lg:text-left space-y-6 hidden lg:block">
          <Link href="/" className="inline-block group">
            <img
              src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaahlogo5.png"
              alt="Kafa'ah"
              className="h-28 lg:h-32 mx-auto lg:mx-0 transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              {lang === "bn" ? "জ্ঞানের পথে" : "On the path of"}<br/>
              <span className="text-emerald-600">{lang === "bn" ? "আপনার যাত্রা শুরু হোক" : "knowledge & excellence"}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.25em] text-xs">
              Bismillahir Rahmanir Rahim
            </p>
          </div>
          <div className="flex items-center gap-4 pt-4">
             <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-100 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-emerald-600">
               Premium Learning
             </div>
             <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-100 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-blue-600">
               Halal Tech
             </div>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full max-w-sm mx-auto lg:ml-auto">
          <div className="bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100/50 dark:border-gray-800/50 p-8 lg:p-9 relative overflow-hidden">
            
            {/* Mobile Logo Only */}
            <div className="lg:hidden text-center mb-8">
              <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaahlogo5.png" alt="Logo" className="h-14 mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Kafa'ah</p>
            </div>

            <AnimatePresence mode="wait">
              {needsVerification ? (
                <motion.div 
                  key="verification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100/50 dark:border-emerald-800/20">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-paper-plane text-emerald-600 text-xl"></i>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
                      {lang === 'bn' 
                        ? `আমরা আপনার ইমেইলে একটি ভেরিফিকেশন কোড পাঠিয়েছি।`
                        : `We've sent a verification code to your email.`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push(`/verify-code?email=${encodeURIComponent(unverifiedEmail)}`)}
                      className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 active:scale-95 text-xs"
                    >
                      {lang === 'bn' ? "কোড লিখুন" : "Enter Code"}
                    </button>
                    <button
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="w-full h-14 bg-transparent border-2 border-slate-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-gray-800 transition disabled:opacity-50 text-xs"
                    >
                      {resendLoading ? <i className="fas fa-spinner fa-spin"></i> : (lang === 'bn' ? "পুনরায় পাঠান" : "Resend Code")}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="login-form"
                  onSubmit={handleSubmit} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">
                      {t("modal.emailOrUsername")}
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <i className="fas fa-envelope text-sm"></i>
                      </span>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none text-sm font-semibold"
                        placeholder={t("modal.emailOrUsernamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">
                      {t("modal.password")}
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <i className="fas fa-lock text-sm"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none text-sm font-semibold"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="text-[9px] font-black uppercase text-slate-400 hover:text-orange-500 tracking-widest transition-colors"
                      >
                        {lang === 'bn' ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
                      </Link>
                    </div>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {(error || resendSuccess || successMessage) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-3.5 rounded-2xl flex items-center gap-3 overflow-hidden border ${
                          error ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-600' : 
                          'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-600'
                        } text-[11px] font-bold`}
                      >
                        <i className={`fas ${error ? 'fa-exclamation-circle' : 'fa-check-circle'} text-sm`}></i>
                        {error || resendSuccess || successMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 text-xs"
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin text-lg"></i>
                    ) : (
                      t("modal.login")
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-gray-800/50 text-center">
              <p className="text-slate-500 dark:text-gray-400 font-medium text-xs">
                {t("modal.noAccount")}{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 dark:text-emerald-500 font-black hover:underline underline-offset-4 ml-1"
                >
                  {t("modal.createAccount")}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[10px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> {lang === 'bn' ? "হোমে ফিরে যান" : "Back to Home"}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;