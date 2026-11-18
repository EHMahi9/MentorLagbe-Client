'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  plan: 'free' | 'pro';
  image?: string;
  phone?: string;
  bio?: string;
  bookmarks?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme and auth token on mount
  useEffect(() => {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem('ml_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // 2. Auth initialization (Instant 0ms Mobile Hydration via Stale-While-Revalidate)
    const storedToken = localStorage.getItem('ml_token');
    const storedUser = localStorage.getItem('ml_user');

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);
        setLoading(false); // Render UI immediately without waiting for server wake-up

        // Silently verify and refresh credentials in the background
        apiRequest<{ success: boolean; user: User }>('/api/auth/me')
          .then((res) => {
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('ml_user', JSON.stringify(res.user));
            }
          })
          .catch((err) => {
            // If token expired (401), clean credentials
            if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
              setToken(null);
              setUser(null);
              localStorage.removeItem('ml_token');
              localStorage.removeItem('ml_user');
            }
          });
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('ml_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('ml_token', newToken);
    localStorage.setItem('ml_user', JSON.stringify(newUser));
    // Set cookie for Next.js middleware / server-side support
    document.cookie = `token=${newToken}; path=/; max-age=604800; SameSite=Lax`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ml_token');
    localStorage.removeItem('ml_user');
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('ml_user', JSON.stringify(merged));
  };

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ success: boolean; user: User }>('/api/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('ml_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        theme,
        toggleTheme,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
