"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import { 
    Send, Layers, GraduationCap, ChevronDown, Check, ArrowLeft, Loader2, Sparkles,
    ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileColor } from "../typescriptfile/utils";

const CreatePost: React.FC = () => {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const navigate = useRouter();
    const { postId } = useParams();
    
    const isEditing = !!postId;

    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("Common");
    const [batch, setBatch] = useState<string>("SSC");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isBatchOpen, setIsBatchOpen] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const categories = ["Common", "Science", "Arts", "Commerce"];
    const postBatches = ["SSC", "HSC", "All"];

    useEffect(() => {
        if (isEditing && postId) {
            const fetchPost = async () => {
                try {
                    const post = await forumService.getPostById(postId);
                    setContent(post.content);
                    setCategory(post.category);
                    setBatch(post.batch);
                } catch {
                    setToast({ msg: lang === "bn" ? "পোস্ট লোড করা সম্ভব হয়নি" : "Failed to load post", type: "error" });
                } finally {
                    setFetching(false);
                }
            };
            fetchPost();
        }
    }, [isEditing, postId, lang]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim()) return;

        setLoading(true);
        try {
            if (isEditing && postId) {
                await forumService.updatePost(postId, content, category, batch);
                setToast({ msg: lang === "bn" ? "পোস্ট আপডেট হয়েছে!" : "Post updated!", type: "success" });
            } else {
                await forumService.createPost(content, category, batch);
                setToast({ msg: lang === "bn" ? "পোস্ট শেয়ার হয়েছে!" : "Post shared!", type: "success" });
            }
            setTimeout(() => navigate("/forum"), 1500);
        } catch {
            setToast({ msg: lang === "bn" ? "ব্যর্থ হয়েছে" : "Failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] dark:bg-gray-950">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden">
            <SEO 
                title={isEditing ? (lang === "bn" ? "পোস্ট এডিট করুন" : "Edit Post") : (lang === "bn" ? "নতুন পোস্ট" : "New Post")}
                url="/create-post"
            />

            {/* Header - Modern Glassmorphism */}
            <header className="sticky top-0 z-[100] bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 px-4 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group"
                    >
                        <ArrowLeft size={22} className="text-gray-500 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <h1 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        <Sparkles size={16} className="text-emerald-500" />
                        {isEditing ? (lang === "bn" ? "এডিট পোস্ট" : "Edit Post") : (lang === "bn" ? "নতুন পোস্ট" : "New Post")}
                    </h1>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !content.trim()}
                        className="relative group overflow-hidden bg-emerald-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                        {lang === "bn" ? (isEditing ? "আপডেট" : "শেয়ার") : (isEditing ? "Update" : "Share")}
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-4 lg:p-8">
                {/* User Info & Selectors Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${getProfileColor(user?.name || "")} flex items-center justify-center text-white font-black text-xl shadow-inner border-4 border-gray-50 dark:border-gray-800`}>
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 dark:text-white leading-none mb-1">{user?.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Public Post</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Category Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setIsCatOpen(!isCatOpen); setIsBatchOpen(false); }}
                                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[11px] font-black text-gray-700 dark:text-gray-200 hover:border-emerald-500/50 transition-all"
                            >
                                <Layers size={14} className="text-emerald-500" />
                                {category}
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isCatOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                        animate={{ opacity: 1, y: 5, scale: 1 }} 
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full z-[120] w-40 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 mt-2"
                                    >
                                        {categories.map((cat) => (
                                            <button 
                                                key={cat} 
                                                onClick={() => { setCategory(cat); setIsCatOpen(false); }}
                                                className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-bold rounded-xl transition-colors ${category === cat ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                            >
                                                {cat} {category === cat && <Check size={12} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Batch Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setIsBatchOpen(!isBatchOpen); setIsCatOpen(false); }}
                                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[11px] font-black text-gray-700 dark:text-gray-200 hover:border-blue-500/50 transition-all"
                            >
                                <GraduationCap size={14} className="text-blue-500" />
                                {batch}
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isBatchOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isBatchOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                        animate={{ opacity: 1, y: 5, scale: 1 }} 
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full z-[120] w-32 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 mt-2"
                                    >
                                        {postBatches.map((b) => (
                                            <button 
                                                key={b} 
                                                onClick={() => { setBatch(b); setIsBatchOpen(false); }}
                                                className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-bold rounded-xl transition-colors ${batch === b ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                            >
                                                {b} {batch === b && <Check size={12} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px]">
                    <textarea
                        autoFocus
                        className="w-full bg-transparent border-none text-lg md:text-2xl outline-none resize-none dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium leading-relaxed min-h-[350px]"
                        placeholder={lang === "bn" ? "আপনার মনে কি আছে? ইসলাম ও শিক্ষা বিষয়ে কিছু শেয়ার করুন..." : "What's on your mind? Share something about Islam or Education..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                
                <p className="mt-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    Keep it respectful & Educational
                </p>
            </main>

            {/* Premium Toast UI */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }} 
                        animate={{ opacity: 1, y: 0, x: "-50%" }} 
                        exit={{ opacity: 0, scale: 0.5, x: "-50%" }}
                        className={`fixed bottom-10 left-1/2 z-[150] px-8 py-4 rounded-[2rem] shadow-2xl font-black text-white text-xs tracking-tighter flex items-center gap-3 backdrop-blur-lg ${toast.type === "success" ? "bg-emerald-600/90" : "bg-red-500/90"}`}
                    >
                        {toast.type === "success" ? <Check size={16} /> : <ShieldAlert size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreatePost;