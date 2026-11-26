'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  ArrowRight,
  Shield,
  CreditCard,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalApplications: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; stats: any }>('/api/admin/stats')
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => console.error('Admin stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Platform Administration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              Admin Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time platform analytics, user role moderation, and Stripe transaction logs.
          </p>
        </div>

        <Link
          href="/dashboard/admin/tuitions"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Moderate Tuitions</span>
        </Link>
      </div>

      {/* Stats Cards Grid (Core Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.totalUsers}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {stats.totalStudents} Students • {stats.totalTutors} Mentors
            </p>
          </div>
        </div>

        {/* Approved Tuitions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Tuitions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.approvedTuitions}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Live on public listings</p>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? '...' : stats.pendingTuitions}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Requires admin decision</p>
          </div>
        </div>

        {/* Total Stripe Revenue */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Stripe Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ${loading ? '...' : stats.totalRevenue} USD
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Across {stats.totalTransactions} Pro subscription orders
            </p>
          </div>
        </div>
      </div>

      {/* Admin Shortcuts Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Management Sections</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">User Management</p>
                <p className="text-[10px] text-gray-400">Modify user roles & permissions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/admin/tuitions"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Tuition Moderation</p>
                <p className="text-[10px] text-gray-400">Approve or reject submissions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/40 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Stripe Transactions</p>
                <p className="text-[10px] text-gray-400">View payment records and revenue</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
