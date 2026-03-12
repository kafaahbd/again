"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage(t('verification.invalidToken') || (lang === 'bn' ? 'ভেরিফিকেশন লিঙ্কটি সঠিক নয়' : 'Invalid verification link'));
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || t('verification.failed') || (lang === 'bn' ? 'ভেরিফিকেশন ব্যর্থ হয়েছে' : 'Verification failed'));
      }
    };

    verifyEmail();
  }, [searchParams, t, lang]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-gray-900 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
          
          {/* Status Icon/Animation */}
          <div className="mb-8 relative flex justify-center">
            {status === 'loading' && (
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 h-20 w-20 rounded-full border-t-4 border-green-500"
                ></motion.div>
                <i className="fas fa-envelope-open-text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xl animate-pulse"></i>
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-lg shadow-green-500/20"
              >
                <i className="fas fa-check text-3xl text-green-600 dark:text-green-400"></i>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-500 shadow-lg shadow-red-500/20"
              >
                <i className="fas fa-times text-3xl text-red-600 dark:text-red-400"></i>
              </motion.div>
            )}
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
            {status === 'loading' && (t('verification.verifying') || 'Verifying Email')}
            {status === 'success' && (t('verification.success') || 'Account Verified!')}
            {status === 'error' && (t('verification.failed') || 'Verification Error')}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-10">
            {message || (status === 'loading' && 'Please wait while we confirm your identity...')}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'success' && (
              <Link
                href="/login"
                className="block w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t('verification.goToLogin') || 'Start Learning Now'}
              </Link>
            )}

            {status === 'error' && (
              <Link
                href="/"
                className="block w-full py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all"
              >
                {t('common.goHome') || 'Back to Home'}
              </Link>
            )}
            
            <Link href="/signup" className="block text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-green-600 transition">
              {lang === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create New Account'}
            </Link>
          </div>

          {/* Decorative Background Element */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;