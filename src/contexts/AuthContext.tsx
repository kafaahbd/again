"use client";
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from "react";
import axios from "axios";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // API Instance তৈরি: যা প্রতি রিকোয়েস্টে অটোমেটিক টোকেন পাঠাবে
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
        });

        instance.interceptors.request.use((config) => {
            const currentToken = localStorage.getItem("token");
            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
            }
            return config;
        });

        // যদি টোকেন এক্সপায়ার হয় (৪০১ এরর), তবে অটো লগআউট করবে
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, []);

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
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                { identifier, password }
            );

            const { token: newToken, user: loggedInUser } = response.data;

            // টোকেন এবং ইউজার স্টেট আপডেট
            localStorage.setItem("token", newToken);
            setToken(newToken);
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
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
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
    const logout = () => {
        localStorage.removeItem("token");
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