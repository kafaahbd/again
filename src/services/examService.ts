import axios from 'axios';

// আপনার .env ফাইল থেকে API URL নেবে, না থাকলে ডিফল্ট /api ব্যবহার করবে
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * ১. পরীক্ষার রেজাল্ট ডাটাবেজে সেভ করার ফাংশন
 */
export const saveResult = async (resultData: any) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post(`${API_URL}/exam/save`, resultData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
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
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get(`${API_URL}/exam/history`, { 
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
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
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/exam/details/${examId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৪. ভুল প্রশ্নগুলো সেভ করা
 */
export const saveMistakes = async (mistakeData: any) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/exam/mistakes/save`, mistakeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৫. ভুল থাকা সাবজেক্ট লিস্ট
 */
export const getMistakeSubjects = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/exam/mistakes/subjects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৬. সাবজেক্ট অনুযায়ী ভুল প্রশ্ন
 */
export const getMistakesBySubject = async (subjectName: string) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/exam/mistakes/subject/${subjectName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ৭. ভুল প্রশ্ন ডিলিট করা
 */
export const deleteMistake = async (mistakeId: string) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${API_URL}/exam/mistakes/${mistakeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};