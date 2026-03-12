"use client";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";

const SignUp = () => {
  const { t, lang } = useLanguage();
  const { register, isLoading, user } = useAuth();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    hide_phone: false,
    study_level: "SSC" as "SSC" | "HSC",
    group: "Science" as "Science" | "Arts" | "Commerce",
    exam_year: "", 
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    let score = 0;
    const suggestions = [];

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
  }, [formData.password, lang]);

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
    setFormData({ ...formData, password: retVal, confirmPassword: retVal });
    setShowPassword(true);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "exam_year" || name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError(t("modal.passwordsDoNotMatch"));
      return;
    }
    if (passwordStrength.score < 4) {
      setError(lang === 'bn' 
        ? "পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।" 
        : "Password must be at least 8 characters and include letters, numbers, and special characters.");
      return;
    }
    try {
      const { ...registerData } = formData;
      await register(registerData);
      router.push(`/verify-code?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex flex-col items-center justify-center px-4 py-10 lg:py-14 transition-colors relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>

      <SEO 
        title={lang === "bn" ? "সাইন আপ - কাফআহ" : "Sign Up - Kafa'ah"} 
        image="https://study.kafaahbd.com/stufy.jpg"
        url="/signup"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100/50 dark:border-gray-800/50 p-6 lg:p-12 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {t("modal.signUp")}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                Join Kafa'ah Learning Community
              </p>
            </div>
            <Link href="/">
              <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaahlogo5.png" alt="Logo" className="h-10 lg:h-12 hidden lg:block opacity-80" />
            </Link>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl flex items-center gap-3"
              >
                <i className="fas fa-exclamation-circle text-base"></i> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Personal Info Section */}
              <div className="space-y-5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-emerald-600/20"></span>
                  {lang === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}
                </h3>
                
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.username")}</label>
                    <input
                      type="text" name="username" value={formData.username} onChange={handleChange} required
                      className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                      placeholder="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.fullName")}</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.email")}</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                    <input
                      type="text" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                      placeholder="017XXXXXXXX"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer group w-fit">
                      <div className="relative flex items-center">
                        <input type="checkbox" name="hide_phone" checked={formData.hide_phone} onChange={(e) => setFormData({...formData, hide_phone: e.target.checked})} className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-gray-700 rounded checked:bg-emerald-600 transition-all" />
                        <i className="fas fa-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 left-0.5"></i>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">{lang === 'bn' ? 'ফোন নম্বর গোপন রাখুন' : 'Hide phone number'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Academic Info Section */}
              <div className="space-y-5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-emerald-600/20"></span>
                  {lang === 'bn' ? 'শিক্ষাগত তথ্য' : 'Academic Details'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.studyLevel")}</label>
                    <select
                      name="study_level" value={formData.study_level} onChange={handleChange}
                      className="w-full px-4 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-black text-xs appearance-none cursor-pointer"
                    >
                      <option value="SSC">SSC</option>
                      <option value="HSC">HSC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.group")}</label>
                    <select
                      name="group" value={formData.group} onChange={handleChange}
                      className="w-full px-4 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-black text-xs appearance-none cursor-pointer"
                    >
                      <option value="Science">{t("modal.science")}</option>
                      <option value="Arts">{t("modal.arts")}</option>
                      <option value="Commerce">{t("modal.commerce")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{lang === 'bn' ? 'পরীক্ষার বছর' : 'Exam Year'}</label>
                  <input
                    type="text" name="exam_year" value={formData.exam_year} onChange={handleChange}
                    maxLength={4} placeholder="2025"
                    className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                  />
                </div>

                <div className="space-y-5">
                   <div className="space-y-2 relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.password")}</label>
                      <button type="button" onClick={generateStrongPassword} className="text-[9px] font-black uppercase tracking-tighter text-emerald-600 dark:text-emerald-500 hover:underline">
                        {lang === 'bn' ? "শক্তিশালী পাসওয়ার্ড" : "Suggest Strong"}
                      </button>
                    </div>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" value={formData.password} onChange={handleChange} required
                        className="w-full pl-5 pr-12 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                      </button>
                    </div>

                    <AnimatePresence>
                      {formData.password && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2 p-3 bg-slate-50/50 dark:bg-gray-800/20 rounded-xl border border-slate-100 dark:border-gray-800">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{lang === 'bn' ? "পাসওয়ার্ড শক্তি" : "Strength"}:</span>
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 ml-1 tracking-widest">{t("modal.confirmPassword")}</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                      className="w-full px-5 py-4 bg-slate-50/50 dark:bg-gray-800/40 border border-transparent focus:border-emerald-500/30 rounded-2xl dark:text-white transition-all outline-none font-semibold text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin text-lg"></i> : (
                  <>
                    {t("modal.signUp")}
                    <i className="fas fa-arrow-right text-xs"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-gray-800/50 text-center">
            <p className="text-slate-500 dark:text-gray-400 font-medium text-xs">
              {t("modal.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-emerald-600 dark:text-emerald-500 font-black hover:underline underline-offset-4 ml-1">
                {t("modal.login")}
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <i className="fas fa-arrow-left"></i> {lang === 'bn' ? "হোমে ফিরে যান" : "Back to Home"}
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;