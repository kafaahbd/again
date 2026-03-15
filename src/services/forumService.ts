import api from "./api";

// .env ফাইল থেকে API URL নেওয়া (Vite প্রজেক্টের জন্য)
const API_URL = "/forum";

export const forumService = {
  /**
   * ১. সব পোস্ট ফেচ করা (ফিল্টার সাপোর্টসহ)
   * @param category - যেমন: 'Science', 'Arts', 'Common' (ঐচ্ছিক)
   * @param batch - যেমন: 'SSC', 'HSC' (ঐচ্ছিক)
   */
  getPosts: async (category?: string, batch?: string) => {
    const params = {
      category: category || "All",
      batch: batch || "All",
    };

    const response = await api.get(`${API_URL}/posts`, {
      params,
    });
    return response.data;
  },

  /**
   * ২. নতুন পোস্ট তৈরি করা
   */
  createPost: async (content: string, category: string, batch: string, image_url?: string) => {
    const response = await api.post(
      `${API_URL}/posts`,
      { content, category, batch, image_url }
    );
    return response.data;
  },

  /**
   * ৩. পোস্ট ডিলিট করা
   */
  deletePost: async (postId: string) => {
    const response = await api.delete(
      `${API_URL}/posts/${postId}`
    );
    return response.data;
  },

  /**
   * ৪. একটি নির্দিষ্ট পোস্টের ডিটেইলস এবং কমেন্ট দেখা
   */
  getPostById: async (postId: string) => {
    const response = await api.get(
      `${API_URL}/posts/${postId}`
    );
    return response.data;
  },

  /**
   * ৫. কমেন্ট অথবা রিপ্লাই যোগ করা
   * @param parentId - যদি এটি একটি রিপ্লাই হয়, তবে মেইন কমেন্টের ID দিন
   * @param replyToId - যদি এটি কোনো নির্দিষ্ট রিপ্লাইয়ের ওপর রিপ্লাই হয়, তবে সেই রিপ্লাইয়ের ID দিন
   */
  addComment: async (postId: string, commentText: string, parentId: string | null = null, replyToId: string | null = null) => {
    const response = await api.post(
      `${API_URL}/comments`,
      { 
        post_id: postId, 
        comment_text: commentText,
        parent_id: parentId,
        reply_to_id: replyToId
      }
    );
    return response.data;
  },

  /**
   * ৬. কমেন্ট ডিলিট করা
   */
  deleteComment: async (commentId: string) => {
    const response = await api.delete(
      `${API_URL}/comments/${commentId}`
    );
    return response.data;
  },

  /**
   * ৭. রিঅ্যাক্ট (Like) টগল করা
   */
  toggleReact: async (postId: string) => {
    const response = await api.post(
      `${API_URL}/react`,
      { post_id: postId }
    );
    return response.data;
  },

  /**
   * ৮. পোস্ট আপডেট করা
   */
  updatePost: async (postId: string, content: string, category: string, batch: string) => {
    const response = await api.put(
      `${API_URL}/posts/${postId}`,
      { content, category, batch }
    );
    return response.data;
  },

  /**
   * ৯. ইউজার ব্লক করা
   */
  blockUser: async (userId: string) => {
    const response = await api.post(
      `${API_URL}/block`,
      { blocked_user_id: userId }
    );
    return response.data;
  },

  /**
   * ইউজার আনব্লক করা
   */
  unblockUser: async (userId: string) => {
    const response = await api.post(
      `${API_URL}/unblock`,
      { blocked_user_id: userId }
    );
    return response.data;
  },

  /**
   * ব্লকড ইউজারদের তালিকা
   */
  getBlockedUsers: async () => {
    const response = await api.get(
      `${API_URL}/blocked-users`
    );
    return response.data;
  },

  /**
   * ১০. নির্দিষ্ট ইউজারের পোস্ট ফেচ করা
   */
  getUserPosts: async (userId: string) => {
    const response = await api.get(
      `${API_URL}/user/${userId}/posts`
    );
    return response.data;
  },

  /**
   * ১১. ইউজারের প্রোফাইল তথ্য ফেচ করা (অন্য ইউজারের জন্য)
   */
  getUserProfile: async (userId: string) => {
    const response = await api.get(
      `${API_URL}/user/${userId}/profile`
    );
    return response.data;
  }
};
