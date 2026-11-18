'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

  useEffect(() => {
    // 1. Check for token in URL hash if redirected back from Google OAuth
    if (typeof window !== 'undefined' && window.location.hash.includes('id_token=')) {
      const params = new URLSearchParams(window.location.hash.replace('#', '?'));
      const idToken = params.get('id_token');
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname);
        handleGoogleCredentialResponse({ credential: idToken });
      }
    }

    // 2. Initialize Google Identity Services SDK
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const existingScript = document.getElementById('google-gsi-client');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
          });
          const btn = document.getElementById('google-btn-rendered');
          if (btn) {
            (window as any).google.accounts.id.renderButton(btn, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with',
              shape: 'rectangular',
            });
          }
        }
      };
      document.body.appendChild(script);
    } else if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
      });
      const btn = document.getElementById('google-btn-rendered');
      if (btn) {
        (window as any).google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'rectangular',
        });
      }
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: any;
        message: string;
      }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: response.credential }),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome, ${res.user.name}!`);

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
      toast.error(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google Client ID not configured.');
      return;
    }

    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/sign-in` : 'https://mentorlagbe-five.vercel.app/sign-in';
          const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20profile%20email&nonce=${Math.random().toString(36)}`;
          window.location.href = oauthUrl;
        }
      });
    } else {
      const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/sign-in` : 'https://mentorlagbe-five.vercel.app/sign-in';
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20profile%20email&nonce=${Math.random().toString(36)}`;
      window.location.href = oauthUrl;
    }
  };

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

        {/* Google OAuth Official Button */}
        <div className="flex justify-center w-full min-h-[44px]">
          <div id="google-btn-rendered" className="w-full flex justify-center"></div>
        </div>

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
