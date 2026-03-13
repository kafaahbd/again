import api from './api';

// আপনার .env ফাইল থেকে API URL নেবে
const API_URL = '/exam';

/**
 * ১. পরীক্ষার রেজাল্ট ডাটাবেজে সেভ করার ফাংশন
 */
export const saveResult = async (resultData: any) => {
  try {
    const response = await api.post(`${API_URL}/save`, resultData);
    return response.data;
  } catch (error: any) {
    console.error("Error in saveResult service:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to save exam result");
  }
};

/**
 * ২. ইউজারের সব পরীক্ষার হিস্ট্রি নিয়ে আসার ফাংশন
 * (ড্যাশবোর্ডের এরর ফিক্স করার জন্য নাম পরিবর্তন করা হয়েছে)
 */
export const getUserExamHistory = async () => {
  try {
    const response = await api.get(`${API_URL}/history`);
    return response.data; // এটি রেজাল্টের একটি Array রিটার্ন করবে
  } catch (error: any) {
    console.error("Error in getUserExamHistory service:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch user stats");
  }
};

/**
 * ৩. নির্দিষ্ট একটি পরীক্ষার বিস্তারিত তথ্য দেখার জন্য (যদি ভবিষ্যতে লাগে)
 */
export const getExamDetails = async (examId: string) => {
  try {
    const response = await api.get(`${API_URL}/details/${examId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৪. ভুল প্রশ্নগুলো সেভ করা
 */
export const saveMistakes = async (mistakeData: any) => {
  try {
    const response = await api.post(`${API_URL}/mistakes/save`, mistakeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৫. ভুল থাকা সাবজেক্ট লিস্ট
 */
export const getMistakeSubjects = async () => {
  try {
    const response = await api.get(`${API_URL}/mistakes/subjects`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৬. সাবজেক্ট অনুযায়ী ভুল প্রশ্ন
 */
export const getMistakesBySubject = async (subjectName: string) => {
  try {
    const response = await api.get(`${API_URL}/mistakes/subject/${subjectName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৭. ভুল প্রশ্ন ডিলিট করা
 */
export const deleteMistake = async (mistakeId: string) => {
  try {
    const response = await api.delete(`${API_URL}/mistakes/${mistakeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
