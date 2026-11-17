'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../../lib/authContext';
import { apiRequest } from '../../../lib/api';

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplied: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    acceptanceRate: 0,
    plan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; stats: any }>('/api/users/stats/student')
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => console.error('Student stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your applied tuition applications, reviews, and learning journey.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Tuitions</span>
        </Link>
      </div>

      {/* Stats Cards Grid (Core Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applied */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Applied</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.totalApplied}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Total tuition posts applied for</p>
          </div>
        </div>

        {/* Accepted Applications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Accepted</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.accepted}
            </p>
            {stats.totalApplied > 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                {stats.acceptanceRate}% rate
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Approved applications by tutors</p>
        </div>

        {/* Pending Applications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.pending}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting tutor review and confirmation</p>
          </div>
        </div>

        {/* Current Plan */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Current Plan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black uppercase text-gray-900 dark:text-white">
                {user?.plan === 'pro' ? 'PRO PLAN' : 'FREE'}
              </p>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {user?.plan === 'pro' ? 'Enjoying priority booking' : 'Upgrade to Pro for priority perks'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/student/my-applications"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-teal-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">My Applications</p>
                <p className="text-[10px] text-gray-400">Track and manage submissions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/student/saved-tuitions"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Saved Tuitions</p>
                <p className="text-[10px] text-gray-400">Your bookmarked subjects</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/tuitions"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Explore Mentors</p>
                <p className="text-[10px] text-gray-400">Find experienced tutors</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      <div className="p-6 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center gap-4">
        <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200">
            Boost your tuition match rate
          </h4>
          <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
            Keep your student profile and contact details up-to-date so mentors can contact you quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
