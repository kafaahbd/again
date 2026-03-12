"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { forumService } from '../services/forumService';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Trash2, X, Clock, CornerDownRight, Share2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import TextExpander from '../components/TextExpander';
import SEO from "../components/SEO";

import { useLanguage } from '../contexts/LanguageContext';
import { getProfileColor, getTimeAgo } from '../typescriptfile/utils';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useRouter();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [replyTo, setReplyTo] = useState<{ parentId: string; replyId: string; mentionName: string } | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const loadPostData = useCallback(async () => {
    if (!postId) return;
    try {
      const currentPost = await forumService.getPostById(postId);
      if (!currentPost) navigate('/forum');
      setPost(currentPost);
    } catch (err) { 
      console.error("Error loading post:", err);
      navigate('/forum');
    }
  }, [postId, navigate]);

  useEffect(() => { 
    loadPostData(); 
  }, [loadPostData]);

  const handlePostDeleteConfirm = async () => {
    try {
      await forumService.deletePost(postId!);
      navigate('/forum');
    } catch (err) { console.error(err); }
  };

  const handleCommentDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {
      await forumService.deleteComment(commentToDelete);
      setCommentToDelete(null);
      loadPostData();
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async () => {
    if (!user) return;
    if (!commentText.trim() || !postId) return;
    
    let finalCommentText = commentText;
    if (replyTo && !commentText.startsWith(`@${replyTo.mentionName}`)) {
      finalCommentText = `@${replyTo.mentionName} ${commentText}`;
    }

    try {
      await forumService.addComment(postId, finalCommentText, replyTo?.parentId, replyTo?.replyId);
      setCommentText('');
      setReplyTo(null);
      loadPostData();
    } catch (err) { console.error("Submit Error:", err); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (!post) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const mainComments = post.comments?.filter((c: any) => !c.parent_id) || [];
  const getReplies = (parentCommentId: string) => post.comments?.filter((c: any) => c.parent_id === parentCommentId) || [];

  const {t} = useLanguage()

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1222] transition-colors duration-500">
      <SEO title={`${post.author_name} - Forum | Kafa'ah`} description={post.content.substring(0, 160)} />

      {/* Islamic Pattern Background */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0L25 15L40 20L25 25L20 40L15 25L0 20L15 15Z" fill="currentColor"/></pattern><rect width="100%" height="100%" fill="url(#pattern)"/></svg>
      </div>

      <div className="relative z-10 max-w-4xl xl:max-w-5xl mx-auto pt-4 pb-32 px-3 md:px-6">
        
        <ConfirmModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onConfirm={handlePostDeleteConfirm} title="Delete Post?" />
        <ConfirmModal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} onConfirm={handleCommentDeleteConfirm} title="Delete Comment?" />

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-6 font-black text-[11px] tracking-widest uppercase bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/30 transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t("study.back") || "Back to Forum"}
        </button>

        {/* Post Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] p-5 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              onClick={() => navigate(`/profile/${post.user_id}`)}
              className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-tr ${post.author_profile_color || getProfileColor(post.author_name)} text-white flex items-center justify-center font-black text-xl shadow-lg cursor-pointer border-4 border-white dark:border-slate-800 transition-transform hover:scale-105`}
            >
              {post.author_name?.[0]}
            </div>
            <div className="flex-1">
              <h2 onClick={() => navigate(`/profile/${post.user_id}`)} className="font-black text-lg md:text-2xl text-slate-900 dark:text-white leading-tight cursor-pointer hover:text-emerald-600 transition-colors">
                {post.author_name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider border border-emerald-200/30">{post.category}</span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Clock size={12}/> {getTimeAgo(post.created_at, lang)}</span>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button onClick={handleShare} className="text-slate-400 hover:text-emerald-500 transition-all p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <Share2 size={18} />
              </button>
              {post.user_id === user?.id && (
                <button onClick={() => setIsPostModalOpen(true)} className="text-red-400 hover:text-red-500 transition-all p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
          <TextExpander text={post.content} limit={300} className="text-slate-700 dark:text-slate-300 text-[15px] md:text-lg leading-relaxed whitespace-pre-wrap font-medium" />
        </motion.div>

        {/* Discussions Area */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center gap-3 px-2">
            <MessageSquare size={18} className="text-emerald-500" />
            <h3 className="text-slate-500 dark:text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">Discussions ({post.comment_count})</h3>
          </div>
          
          {mainComments.length > 0 ? mainComments.map((c: any) => (
            <div key={c.id} className="group/comment space-y-4">
              <div className="flex gap-3 md:gap-5">
                <Link href={`/profile/${c.comment_author_id}`} className="shrink-0 pt-1">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${c.author_profile_color || getProfileColor(c.author_name)} flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-slate-800 shadow-md`}>
                        {c.author_name?.[0]}
                    </div>
                </Link>
                <div className="flex-1 bg-white dark:bg-slate-900/40 p-4 md:p-6 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative">
                  <div className="flex justify-between items-center mb-3">
                    <Link href={`/profile/${c.comment_author_id}`} className="font-black text-emerald-600 dark:text-emerald-400 text-sm md:text-[15px]">@{c.author_name}</Link>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-bold">{getTimeAgo(c.created_at, lang)}</span>
                      {c.comment_author_id === user?.id && (
                        <button onClick={() => setCommentToDelete(c.id)} className="text-red-400 hover:text-red-600 transition-all opacity-0 group-hover/comment:opacity-100">
                            <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                  <TextExpander text={c.comment_text} limit={100} className="text-slate-600 dark:text-slate-300 text-sm md:text-[15px] leading-relaxed" />
                  <div className="flex items-center gap-6 mt-4 border-t border-slate-50 dark:border-slate-800/50 pt-3">
                      {user && (
                        <button 
                            onClick={() => setReplyTo({ parentId: c.id, replyId: c.id, mentionName: c.author_name })} 
                            className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-widest transition-colors flex items-center gap-1.5"
                        >
                          <CornerDownRight size={12}/> Reply
                        </button>
                      )}
                      {getReplies(c.id).length > 0 && (
                          <button 
                              onClick={() => setShowReplies(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                              className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                          >
                              {showReplies[c.id] ? "Hide Replies" : `Show ${getReplies(c.id).length} Replies`}
                          </button>
                      )}
                  </div>
                </div>
              </div>

              {/* Replies Section */}
              <AnimatePresence>
              {showReplies[c.id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-12 md:ml-20 space-y-4 border-l-2 border-emerald-100 dark:border-emerald-900/30 pl-5 md:pl-8"
                  >
                    {getReplies(c.id).map((reply: any) => (
                        <div key={reply.id} className="group/reply flex gap-3">
                          <Link href={`/profile/${reply.comment_author_id}`} className="shrink-0 pt-0.5">
                              <div className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${reply.author_profile_color || getProfileColor(reply.author_name)} flex items-center justify-center text-white font-black text-[10px] border border-white dark:border-slate-800 shadow-sm`}>
                                  {reply.author_name?.[0]}
                              </div>
                          </Link>
                          <div className="flex-1 bg-slate-50/80 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1.5">
                                <Link href={`/profile/${reply.comment_author_id}`} className="font-black text-emerald-600/80 dark:text-emerald-400/80 text-xs">@{reply.author_name}</Link>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] text-slate-400 font-bold">{getTimeAgo(reply.created_at, lang)}</span>
                                  {reply.comment_author_id === user?.id && (
                                      <button onClick={() => setCommentToDelete(reply.id)} className="text-red-400 hover:text-red-500 transition-all opacity-0 group-hover/reply:opacity-100">
                                          <Trash2 size={13} />
                                      </button>
                                  )}
                                </div>
                              </div>
                              <TextExpander text={reply.comment_text} limit={80} className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed" />
                              {user && (
                                <button 
                                    onClick={() => setReplyTo({ parentId: c.id, replyId: reply.id, mentionName: reply.author_name })} 
                                    className="mt-2 text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                                >
                                    Reply
                                </button>
                              )}
                          </div>
                        </div>
                    ))}
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          )) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold italic text-sm">No discussions yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Floating Input Bar */}
        <div className="fixed bottom-6 left-0 right-0 px-4 z-[100]">
          <div className="max-w-4xl xl:max-w-5xl mx-auto">
            {!user ? (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 shadow-2xl border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] text-center">
                <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">Join the community to share your thoughts</p>
                <button onClick={() => navigate("/login")} className="mt-2 text-emerald-600 font-black uppercase text-[11px] tracking-widest hover:underline">Login Now</button>
              </div>
            ) : (
              <div className="flex flex-col">
                <AnimatePresence>
                  {replyTo && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      exit={{ y: 20, opacity: 0 }} 
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-t-[1.8rem] text-[10px] font-black flex justify-between items-center mx-4 shadow-lg"
                    >
                      <span className="flex items-center gap-2 uppercase tracking-widest">
                          <CornerDownRight size={14}/> Replying to @{replyTo.mentionName}
                      </span>
                      <X size={16} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setReplyTo(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className={`bg-white dark:bg-slate-900 p-2.5 md:p-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all ${replyTo ? 'rounded-b-[2.5rem] rounded-t-none' : 'rounded-[2.5rem]'}`}>
                  <div className="hidden sm:flex h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 items-center justify-center text-emerald-600 font-black text-xs shrink-0">
                    {user.name[0]}
                  </div>
                  <input 
                    type="text" 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    placeholder={replyTo ? `Write a reply...` : "Type your message..."} 
                    className="flex-1 bg-slate-50 dark:bg-slate-800/50 px-5 py-3 rounded-full outline-none dark:text-white font-medium text-sm border border-transparent focus:border-emerald-500/30 transition-all" 
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()} 
                  />
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={handleCommentSubmit} 
                    className="bg-emerald-600 text-white p-3.5 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/40 shrink-0"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostDetails;