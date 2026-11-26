'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { apiRequest } from '../../lib/api';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: any;
        message: string;
      }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(res.message || 'Account created successfully!');

        if (res.user.role === 'tutor') {
          router.push('/dashboard/tutor');
        } else {
          router.push('/dashboard/student');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
        {/* Logo and Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Mentor<span className="text-indigo-600 dark:text-indigo-400">Lagbe</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create an Account</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Join MentorLagbe as a Student or verified Academic Mentor
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
            I am joining as a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                role === 'student'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400'
              }`}
            >
              <UserCheck className={`w-5 h-5 ${role === 'student' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs font-bold">Student</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Seeking mentors</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('tutor')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                role === 'tutor'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400'
              }`}
            >
              <BookOpen className={`w-5 h-5 ${role === 'tutor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs font-bold">Tutor</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Offering batches</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Nusrat Jahan"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Password (at least 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
