"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyCode = () => {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  const isPasswordReset = searchParams.get('isPasswordReset') === 'true';

  useEffect(() => {
    const stateEmail = searchParams.get('email');
    if (!stateEmail) {
      router.push('/signup');
      return;
    }
    setEmail(stateEmail);
  }, [searchParams, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError(lang === 'bn' ? '৬ ডিজিটের কোডটি দিন' : 'Enter 6 digit code');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isPasswordReset ? '/auth/verify-reset-code' : '/auth/verify-code';
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        email,
        code: fullCode,
      });

      if (isPasswordReset) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(fullCode)}`);
      } else {
        router.push(`/login?message=${encodeURIComponent(lang === 'bn' ? 'ভেরিফিকেশন সফল! লগইন করুন।' : 'Verification success! Please login.')}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'কোডটি সঠিক নয়' : 'Invalid code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-code`, { email });
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
      // Toast notification use kora better, ekhonkar moto alert rakchi
      alert(lang === 'bn' ? 'নতুন কোড পাঠানো হয়েছে' : 'New code sent successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'কোড পাঠাতে ব্যর্থ' : 'Failed to resend code'));
    } finally {
      setResendLoading(false);
    }
  };

  // Dynamic Theme Colors
  
  const themeGradient = isPasswordReset ? 'from-orange-600 to-amber-500' : 'from-emerald-600 to-teal-500';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex flex-col items-center justify-center px-4 py-10 transition-colors relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100/50 dark:border-gray-800/50 text-center relative overflow-hidden">
          
          {/* Top Decorative Bar */}
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeGradient}`}></div>

          {/* Header Section */}
          <div className="mb-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border transition-all duration-500 ${isPasswordReset ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 shadow-lg shadow-orange-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10'}`}>
              <i className={`fas ${isPasswordReset ? 'fa-key text-orange-600 dark:text-orange-500' : 'fa-shield-alt text-emerald-600 dark:text-emerald-500'} text-2xl`}></i>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              {isPasswordReset ? (lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify Identity') : (t('verify.title') || 'Verify Account')}
            </h2>
            
            <div className="inline-block px-4 py-2 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    {lang === 'bn' ? 'কোড পাঠানো হয়েছে:' : 'Code sent to:'}
                </p>
                <p className="text-gray-900 dark:text-gray-200 font-black text-sm">{email}</p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-black bg-slate-50/50 dark:bg-gray-800/40 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-800 dark:text-white transition-all outline-none shadow-sm focus:shadow-xl ${isPasswordReset ? 'focus:border-orange-500/50 focus:shadow-orange-500/10' : 'focus:border-emerald-500/50 focus:shadow-emerald-500/10'}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <AnimatePresence>
                {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-left"
                >
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400 text-sm"></i>
                    </div>
                    <p className="text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-tight leading-tight">
                        {error}
                    </p>
                </motion.div>
                )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-xs md:text-sm bg-gradient-to-r ${themeGradient} ${isPasswordReset ? 'shadow-orange-500/20 hover:shadow-orange-500/40' : 'shadow-emerald-500/20 hover:shadow-emerald-500/40'}`}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {isPasswordReset ? (lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify & Continue') : (t('verify.verifyButton') || 'Confirm Now')}
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer & Resend */}
          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-gray-800/50">
            <div className="mb-6 flex flex-col items-center">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/5 px-4 py-2 rounded-full border border-amber-100 dark:border-amber-500/10 mb-4 animate-pulse">
                    <i className="fas fa-envelope-open-text text-[10px]"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {lang === 'bn' ? 'স্প্যাম ফোল্ডার চেক করুন' : 'Check Spam Folder'}
                    </span>
                </div>
                
                <p className="text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-1">
                  {lang === 'bn' ? 'কোড পাননি?' : "Didn't receive code?"}
                </p>
                
                <button
                    onClick={handleResend}
                    type="button"
                    disabled={resendLoading}
                    className={`font-black uppercase text-[11px] tracking-[0.15em] hover:brightness-110 disabled:opacity-50 transition-all ${isPasswordReset ? 'text-orange-600 dark:text-orange-500' : 'text-emerald-600 dark:text-emerald-500'}`}
                >
                    {resendLoading ? (
                        <span className="flex items-center gap-2">
                            <i className="fas fa-circle-notch animate-spin"></i>
                            {lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}
                        </span>
                    ) : (
                        <span className="border-b-2 border-current pb-0.5">
                            {lang === 'bn' ? 'আবার পাঠান' : 'Resend Code'}
                        </span>
                    )}
                </button>
            </div>

            <Link href="/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-black uppercase tracking-widest text-[10px] transition-colors">
              <i className="fas fa-arrow-left mr-2 text-[8px]"></i> {lang === 'bn' ? 'সাইনআপ এ ফিরে যান' : 'Back to Signup'}
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCode;