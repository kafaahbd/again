import axios from "axios";
import crypto from "crypto";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  
  // HMAC Signature
  const hmacSecret = process.env.NEXT_PUBLIC_HMAC_SECRET;
  if (hmacSecret) {
    const timestamp = Date.now().toString();
    const method = config.method?.toUpperCase() || "GET";
    const url = config.url || "";
    const body = config.data ? JSON.stringify(config.data) : "";
    
    const payload = `${method}:${url}:${timestamp}:${body}`;
    const signature = crypto
      .createHmac("sha256", hmacSecret)
      .update(payload)
      .digest("hex");
      
    config.headers["x-signature"] = signature;
    config.headers["x-timestamp"] = timestamp;
  }
  
  return config;
});

export default api;
