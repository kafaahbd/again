import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  activeBatch: string;
  categories: string[];
  batches: string[];
  onCategoryChange: (cat: string) => void;
  onBatchChange: (batch: string) => void;
  lang: string;
}

const FilterModal = ({
  isOpen,
  onClose,
  activeCategory,
  activeBatch,
  categories,
  batches,
  onCategoryChange,
  onBatchChange,
  lang,
}: FilterModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden" />

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {lang === "bn" ? "ফিল্টার অপশন" : "Filter Options"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
                  {lang === "bn" ? "ক্যাটাগরি" : "Category"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`px-4 py-3 rounded-2xl text-xs font-black transition-all border ${
                        activeCategory === cat
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      {cat === "All" ? (lang === "bn" ? "সব" : "All") : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
                  {lang === "bn" ? "ব্যাচ" : "Batch"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {batches.map((b) => (
                    <button
                      key={b}
                      onClick={() => onBatchChange(b)}
                      className={`px-4 py-3 rounded-2xl text-xs font-black transition-all border ${
                        activeBatch === b
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      {b === "All" ? (lang === "bn" ? "সব" : "All") : b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs mt-4"
              >
                {lang === "bn" ? "প্রয়োগ করুন" : "Apply Filters"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;