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
  }
  
  // HMAC Signature - Only if we are in a Node environment or have a polyfill
  // For now, we'll skip this on the client side if crypto is not available
  // or just use a placeholder if needed. The server-side routes we use
  // for login don't require this yet.
  const hmacSecret = process.env.NEXT_PUBLIC_HMAC_SECRET;
  if (hmacSecret && typeof window !== "undefined") {
    // On client side, we'd need a browser-compatible crypto library
    // For now, let's just add the timestamp which is often needed
    config.headers["x-api-timestamp"] = Date.now().toString();
  }
  
  return config;
});

export default api;
