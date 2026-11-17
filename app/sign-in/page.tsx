'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  BookOpen,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { apiRequest } from '../../lib/api';
import toast from 'react-hot-toast';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (overrideEmail?: string, overridePassword?: string) => {
    const finalEmail = overrideEmail || email;
    const finalPassword = overridePassword || password;

    if (!finalEmail.trim() || !finalPassword) {
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: any;
        message: string;
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: finalEmail, password: finalPassword }),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome back, ${res.user.name}!`);

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'tutor') {
          router.push('/dashboard/tutor');
        } else {
          router.push('/dashboard/student');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn();
  };

  // 1-Click Demo Login Handlers
  const handleQuickDemo = (role: 'admin' | 'tutor' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@mentorlagbe.com');
      setPassword('Admin@12345');
      handleSignIn('admin@mentorlagbe.com', 'Admin@12345');
    } else if (role === 'tutor') {
      setEmail('tutor@mentorlagbe.com');
      setPassword('Tutor@12345');
      handleSignIn('tutor@mentorlagbe.com', 'Tutor@12345');
    } else {
      setEmail('student@mentorlagbe.com');
      setPassword('Student@12345');
      handleSignIn('student@mentorlagbe.com', 'Student@12345');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
        {/* Logo and Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Mentor<span className="text-teal-600 dark:text-teal-400">Lagbe</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter your credentials to access your tuition dashboard
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Social Button (Visual / Mock) */}
        <button
          type="button"
          onClick={() => toast('Google authentication available via credentials.', { icon: 'ℹ️' })}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* 1-Click Quick Demo Access (As demonstrated in the instruction video) */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Access (1-Click)
            </span>
            <span className="text-[10px] text-gray-400">Instant Test Login</span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Demo Admin Login</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">admin@mentorlagbe.com</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('tutor')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-teal-100 dark:border-teal-950/60 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Demo Tutor Login</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">tutor@mentorlagbe.com</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Demo Student Login</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">student@mentorlagbe.com</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
