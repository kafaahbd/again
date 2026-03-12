"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {lang === 'bn' ? 'লগ আউট করতে চান?' : 'Confirm Logout'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
              {lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্ট থেকে লগ আউট করতে চাচ্ছেন?' : 'Are you sure you want to log out of your account?'}
            </p>

            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                {lang === 'bn' ? 'না' : 'Cancel'}
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                {lang === 'bn' ? 'হ্যাঁ' : 'Logout'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;