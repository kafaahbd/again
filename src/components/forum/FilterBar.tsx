import { Filter, X } from "lucide-react";

interface FilterBarProps {
  activeCategory: string;
  activeBatch: string;
  onClearFilters: () => void;
  onOpenFilterModal: () => void;
  lang: string;
}

const FilterBar = ({
  activeCategory,
  activeBatch,
  onClearFilters,
  onOpenFilterModal,
  lang,
}: FilterBarProps) => {
  const hasActiveFilters = activeCategory !== "All" || activeBatch !== "All";

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 md:p-3">
        <div className="flex items-center gap-2 px-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Filter size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              {lang === "bn" ? "ফিল্টার" : "Filters"}
            </p>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-none">
              {activeCategory} • {activeBatch}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="h-10 w-10 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onOpenFilterModal}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            {lang === "bn" ? "পরিবর্তন" : "Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;