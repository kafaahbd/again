"use client";
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from "react";
import axios, { AxiosInstance } from "axios";
import api from "../services/api"
import LogoutModal from "../components/LogoutModal";

// ইউজার ইন্টারফেস
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
    token: string | null;
    login: (identifier: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<any>;
    updateUser: (updatedData: Partial<User>) => Promise<void>;
    logout: () => void;
    confirmLogout: () => void;
    isLoading: boolean;
    api: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Response interceptor for Token Refresh
    useEffect(() => {
        // Configure global axios
        api.defaults.withCredentials = true;
        api.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

        const getCookie = (name: string) => {
            if (typeof document === "undefined") return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
            return null;
        };

        // Request interceptor
        let csrfTokenCache: string | null = null;
        let csrfTokenPromise: Promise<string | null> | null = null;

        const fetchCsrfToken = async () => {
            if (csrfTokenPromise) return csrfTokenPromise;
            
            csrfTokenPromise = (async () => {
                try {
                    console.log("Fetching CSRF token...");
                    const response = await api.get(`/auth/csrf-token?t=${Date.now()}`, { 
                        withCredentials: true
                    });
                    console.log("CSRF token response:", response.data);
                    if (response.data.csrfToken) {
                        csrfTokenCache = response.data.csrfToken;
                        return csrfTokenCache;
                    }
                } catch (e: any) {
                    console.error("Failed to fetch CSRF token", e);
                    try {
                        await axios.post(`${api.defaults.baseURL}/log`, {
                            message: "Failed to fetch CSRF token",
                            error: e.message,
                            stack: e.stack,
                            response: e.response?.data,
                            status: e.response?.status
                        });
                    } catch (logErr) {
                        console.error("Failed to log error to backend", logErr);
                    }
                } finally {
                    csrfTokenPromise = null;
                }
                return null;
            })();
            
            return csrfTokenPromise;
        };

        const requestInterceptor = api.interceptors.request.use(async (config) => {
            console.log("Request interceptor running for:", config.url, config.method);
            if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
                if (!csrfTokenCache) {
                    console.log("No CSRF token in cache, fetching...");
                    await fetchCsrfToken();
                }
                if (csrfTokenCache) {
                    console.log("Setting CSRF token header:", csrfTokenCache);
                    config.headers = config.headers || {};
                    if (typeof config.headers.set === 'function') {
                        config.headers.set("X-CSRF-Token", csrfTokenCache);
                        config.headers.set("x-xsrf-token", csrfTokenCache);
                    }
                    config.headers["X-CSRF-Token"] = csrfTokenCache;
                    config.headers["x-xsrf-token"] = csrfTokenCache;
                    
                    // Also add to body as fallback
                    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
                        config.data._csrf = csrfTokenCache;
                    } else if (!config.data) {
                        config.data = { _csrf: csrfTokenCache };
                    }
                } else {
                    console.log("Failed to set CSRF token header, cache is still empty");
                    config.headers = config.headers || {};
                    config.headers["X-CSRF-Token"] = "MISSING_FROM_FRONTEND";
                    if (config.data && typeof config.data === 'object') {
                        config.data._csrf = "MISSING_FROM_FRONTEND";
                    }
                }
            }
            return config;
        });

        // Response interceptor
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await api.post(`/auth/refresh-token`, {}, { withCredentials: true });
                        return api(originalRequest);
                    } catch (refreshError) {
                        setUser(null);
                        setToken(null);
                        return Promise.reject(refreshError);
                    }
                }
                if (error.response?.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newCsrf = await fetchCsrfToken();
                        if (newCsrf) {
                            originalRequest.headers['X-CSRF-Token'] = newCsrf;
                            originalRequest.headers['x-xsrf-token'] = newCsrf;
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            api.defaults.withCredentials = true;

            // We no longer rely on localStorage for the token.
            setToken("cookie-based"); 
        };
        
        initAuth();
    }, [api]);

    // অ্যাপ লোড হওয়ার সময় বা টোকেন চেঞ্জ হলে প্রোফাইল ফেচ করা
    useEffect(() => {
        const loadProfile = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    const response = await api.get("/auth/profile");
                    setUser(response.data);
                } catch (error) {
                    console.error("Profile fetch failed:", error);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
            }
        };
        loadProfile();
    }, [token, api]);

    // লগইন ফাংশন
    const login = async (identifier: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post(
                "/auth/login",
                { identifier, password }
            );

            const { user: loggedInUser } = response.data;

            // টোকেন এবং ইউজার স্টেট আপডেট
            setToken("cookie-based");
            setUser(loggedInUser);
        } catch (error: any) {
            // ব্যাকএন্ড থেকে আসা এরর মেসেজ (যেমন: needsVerification: true) থ্রো করা
            if (error.response?.data) {
                throw error.response.data;
            }
            throw new Error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // রেজিস্ট্রেশন ফাংশন
    const register = async (userData: RegisterData) => {
        setIsLoading(true);
        try {
            const response = await api.post(
                "/auth/register",
                userData
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw new Error("Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    // প্রোফাইল আপডেট ফাংশন
    const updateUser = async (updatedData: Partial<User>) => {
        setIsLoading(true);
        try {
            const response = await api.put("/auth/update-profile", updatedData);
            // ডাটাবেস আপডেট সফল হলে লোকাল স্টেট আপডেট
            const updatedUser = response.data.user || { ...user, ...updatedData };
            setUser(updatedUser as User);
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw new Error("Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    // লগআউট ফাংশন
    const logout = async () => {
        try {
            await api.post("/auth/logout", {});
        } catch (error) {
            console.error("Logout error", error);
        }
        setToken(null);
        setUser(null);
        setIsLogoutModalOpen(false);
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                updateUser,
                logout,
                confirmLogout,
                isLoading,
                api,
            }}
        >
            {children}
            {/* লগআউট কনফার্মেশন মডাল */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
            />
        </AuthContext.Provider>
    );
};

// কাস্টম হুক
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};