'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../../lib/authContext';
import { apiRequest } from '../../../lib/api';

export default function TutorOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTuitions: 0,
    activeApproved: 0,
    pendingApproval: 0,
    totalApplicants: 0,
    plan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; stats: any }>('/api/users/stats/tutor')
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => console.error('Tutor stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Tutor Workspace
            </h1>
            {user?.plan === 'pro' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                <Sparkles className="w-3 h-3" /> PRO Mentor
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}! Manage your tuition batches and student enrollments.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Tuition</span>
        </Link>
      </div>

      {/* Free Plan Alert if tutor has reached 2 posts */}
      {user?.plan !== 'pro' && stats.totalTuitions >= 2 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Free Plan Limit Reached (2 / 2 Tuitions)
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                Upgrade to the Pro Plan for $15/month to unlock unlimited tuition listings and verified badges.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-sm transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Stats Cards Grid (Core Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tuitions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Tuitions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.totalTuitions}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {user?.plan === 'pro' ? 'Unlimited slots available' : 'Max 2 on Free Plan'}
            </p>
          </div>
        </div>

        {/* Active & Approved */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active & Approved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.activeApproved}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Visible on public browse page</p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.pendingApproval}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting admin moderation</p>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.totalApplicants}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Total candidate submissions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Tutor Shortcuts</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/tutor/post-tuition"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-teal-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Post Tuition</p>
                <p className="text-[10px] text-gray-400">Add a new batch or session</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">My Tuitions (CRUD)</p>
                <p className="text-[10px] text-gray-400">Edit, close or manage posts</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/tutor/applicants"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Manage Applicants</p>
                <p className="text-[10px] text-gray-400">Accept or decline students</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
