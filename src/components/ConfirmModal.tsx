"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  type?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-[30px] p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className={`w-16 h-16 ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <AlertCircle size={32} />
            </div>
            
            <h3 className="text-xl font-black dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">{message}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;