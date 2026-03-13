import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
});

// Helper to get cookie value
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

// Request interceptor for CSRF and HMAC
api.interceptors.request.use((config) => {
  // CSRF
  const csrfToken = getCookie("XSRF-TOKEN");
  if (csrfToken) {
    config.headers["x-xsrf-token"] = csrfToken;
  } else if (typeof window !== "undefined") {
    console.warn("CSRF token (XSRF-TOKEN) not found in cookies. POST requests may fail.");
  }
  
  // HMAC Signature - Only if we are in a Node environment or have a polyfill
  const hmacSecret = process.env.NEXT_PUBLIC_HMAC_SECRET;
  if (hmacSecret && typeof window !== "undefined") {
    config.headers["x-api-timestamp"] = Date.now().toString();
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
