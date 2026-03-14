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
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

        const getCookie = (name: string) => {
            if (typeof document === "undefined") return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
            return null;
        };

        // Request interceptor
        const requestInterceptor = axios.interceptors.request.use((config) => {
            const csrfToken = getCookie("XSRF-TOKEN");
            if (csrfToken) {
                config.headers["X-CSRF-Token"] = csrfToken;
                config.headers["x-xsrf-token"] = csrfToken;
            }
            return config;
        });

        // Response interceptor
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await axios.post(`/auth/refresh-token`, {}, { withCredentials: true });
                        return axios(originalRequest);
                    } catch (refreshError) {
                        setUser(null);
                        setToken(null);
                        return Promise.reject(refreshError);
                    }
                }
                if (error.response?.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await axios.get('/auth/csrf-token');
                        const csrfToken = getCookie('XSRF-TOKEN');
                        if (csrfToken) {
                            originalRequest.headers['X-CSRF-Token'] = csrfToken;
                            originalRequest.headers['x-xsrf-token'] = csrfToken;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            axios.defaults.withCredentials = true;
            
            // Initialize CSRF token
            try {
                await api.get('/auth/csrf-token');
            } catch (e) {
                console.error("CSRF initialization failed", e);
            }

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