import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    phone: string;
    hide_phone: boolean;
    study_level: "SSC" | "HSC";
    group: "Science" | "Arts" | "Commerce";
    exam_year: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      hide_phone: boolean;
      study_level: "SSC" | "HSC";
      group: "Science" | "Arts" | "Commerce";
      exam_year: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isUpdating,
}: EditProfileModalProps) => {
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative"
          >
            <h2 className="text-xl md:text-2xl font-black mb-6 text-gray-900 dark:text-white">
              {lang === "bn" ? "তথ্য আপডেট করুন" : "Update Profile"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
                  Full Name
                </label>
                <input
                  className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
                    Phone
                  </label>
                  <input
                    className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hide_phone"
                      checked={formData.hide_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, hide_phone: e.target.checked })
                      }
                      className="rounded text-green-600"
                    />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {lang === "bn" ? "ফোন নম্বর গোপন রাখুন" : "Hide phone number"}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
                    Exam Year
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="2025"
                    className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
                    value={formData.exam_year}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, exam_year: value });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
                    Level
                  </label>
                  <select
                    className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
                    value={formData.study_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        study_level: e.target.value as any,
                      })
                    }
                  >
                    <option value="SSC">SSC</option>
                    <option value="HSC">HSC</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
                    Group
                  </label>
                  <select
                    className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
                    value={formData.group}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        group: e.target.value as any,
                      })
                    }
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 md:py-4 font-black text-gray-500 uppercase text-[10px] md:text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 md:py-4 font-black bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 uppercase text-[10px] md:text-xs tracking-widest disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;