'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                console.log('Auth Init - Token:', storedToken ? 'Present' : 'Missing');
                console.log('Auth Init - User:', storedUser ? 'Present' : 'Missing');

                if (storedToken && storedUser) {
                    try {
                        // Set token first so API calls work
                        setToken(storedToken);

                        // Parse stored user
                        const parsedUser = JSON.parse(storedUser);
                        console.log('Auth Init - Parsed User:', parsedUser);
                        console.log('Auth Init - User ID from parsed:', parsedUser?.id);
                        setUser(parsedUser);

                        // Verify token with backend (optional - for security)
                        try {
                            const response = await api.get('/auth/profile');
                            const userData = response.data;

                            // Update with fresh data from server
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                            console.log('Auth Init - Token verified successfully');
                        } catch (verifyError: any) {
                            // Only clear auth if it's a 401/403 (invalid token)
                            // Don't clear on network errors
                            if (verifyError.response?.status === 401 || verifyError.response?.status === 403) {
                                console.error('Auth Init - Token invalid, clearing auth');
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                setUser(null);
                                setToken(null);
                            } else {
                                // Network error or server down - keep using cached data
                                console.warn('Auth Init - Could not verify token, using cached data', verifyError.message);
                            }
                        }
                    } catch (parseError) {
                        console.error('Auth Init - Error parsing stored user:', parseError);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        setToken(null);
                    }
                }
            } catch (error) {
                console.error('Auth Init - Unexpected error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log(email, password);
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user: userData } = response.data;

            // Store token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setToken(access_token);

            // Redirect based on role
            if (userData.role === 'agent') {
                router.push('/agent/dashboard');
            } else if (userData.role === 'admin' || userData.role === 'superadmin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string, phone: string) => {
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                fullName,
                phone,
                role: 'user' // Default role for registration
            });

            const { access_token, user: userData } = response.data;

            // Store token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setToken(access_token);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
