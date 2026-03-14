"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import LogoutModal from "../components/LogoutModal";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  exam_year?: string;
  profile_color?: string;
  verified: boolean;
  created_at: string;
  hide_phone: boolean;
}

interface RegisterData {
  username: string;
  name: string;
  email: string;
  phone: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  password: string;
  exam_year?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  api: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  // -------------------------
  // CSRF TOKEN FETCH
  // -------------------------

  const fetchCSRF = async () => {
    try {
      await api.get("/auth/csrf-token");
    } catch (e) {
      console.error("CSRF fetch failed");
    }
  };

  // -------------------------
  // AXIOS INTERCEPTOR
  // -------------------------

  useEffect(() => {

    const requestInterceptor = api.interceptors.request.use(
      async (config) => {

        if (["post", "put", "patch", "delete"].includes(config.method || "")) {
          const csrf = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrf-token="))
            ?.split("=")[1];

          if (csrf) {
            config.headers = config.headers || {};
            config.headers["X-CSRF-Token"] = csrf;
          }
        }

        return config;
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {

        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {

          original._retry = true;

          try {

            await api.post("/auth/refresh-token");

            return api(original);

          } catch (err) {

            setUser(null);
            return Promise.reject(err);

          }
        }

        if (error.response?.status === 403) {

          await fetchCSRF();

        }

        return Promise.reject(error);
      }
    );

    return () => {

      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);

    };

  }, []);

  // -------------------------
  // LOAD PROFILE
  // -------------------------

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const res = await api.get("/auth/profile");

        setUser(res.data);

      } catch {

        setUser(null);

      }

    };

    loadProfile();

  }, []);

  // -------------------------
  // LOGIN
  // -------------------------

  const login = async (identifier: string, password: string) => {

    setIsLoading(true);

    try {

      await fetchCSRF();

      const res = await api.post("/auth/login", {
        identifier,
        password
      });

      setUser(res.data.user);

    } catch (err: any) {

      if (err.response?.data) throw err.response.data;

      throw new Error("Login failed");

    } finally {

      setIsLoading(false);

    }

  };

  // -------------------------
  // REGISTER
  // -------------------------

  const register = async (data: RegisterData) => {

    setIsLoading(true);

    try {

      await fetchCSRF();

      const res = await api.post("/auth/register", data);

      return res.data;

    } finally {

      setIsLoading(false);

    }

  };

  // -------------------------
  // UPDATE USER
  // -------------------------

  const updateUser = async (data: Partial<User>) => {

    const res = await api.put("/auth/update-profile", data);

    setUser(res.data.user);

  };

  // -------------------------
  // LOGOUT
  // -------------------------

  const logout = async () => {

    try {

      await api.post("/auth/logout");

    } catch {}

    setUser(null);
    setLogoutModal(false);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        api
      }}
    >

      {children}

      <LogoutModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={logout}
      />

    </AuthContext.Provider>

  );

};

export const useAuth = () => {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;

};