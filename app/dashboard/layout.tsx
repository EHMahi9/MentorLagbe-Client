'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  CheckSquare,
  CreditCard,
  User as UserIcon,
  LogOut,
  Zap,
  Menu,
  X,
  SunMedium,
  Moon,
  ChevronRight,
  Shield,
  Bookmark,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, theme, toggleTheme } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route protection
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/sign-in?redirect=${pathname}`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Student Navigation Items
  const studentNav = [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Applications', href: '/dashboard/student/my-applications', icon: CheckSquare },
    { name: 'Saved Tuitions', href: '/dashboard/student/saved-tuitions', icon: Bookmark },
  ];

  // Tutor Navigation Items
  const tutorNav = [
    { name: 'Overview', href: '/dashboard/tutor', icon: LayoutDashboard },
    { name: 'Post Tuition', href: '/dashboard/tutor/post-tuition', icon: PlusCircle },
    { name: 'My Tuitions', href: '/dashboard/tutor/my-tuitions', icon: BookOpen },
    { name: 'Applicants', href: '/dashboard/tutor/applicants', icon: Users },
  ];

  // Admin Navigation Items
  const adminNav = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Tuitions', href: '/dashboard/admin/tuitions', icon: BookOpen },
    { name: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
  ];

  let currentNav = studentNav;
  let workspaceTitle = 'Student Workspace';

  if (user.role === 'tutor') {
    currentNav = tutorNav;
    workspaceTitle = 'Tutor Workspace';
  } else if (user.role === 'admin') {
    currentNav = adminNav;
    workspaceTitle = 'Platform Admin';
  }

  return (
    <div className="min-h-screen flex bg-gray-50/60 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Mentor<span className="text-indigo-600 dark:text-indigo-400">Lagbe</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center gap-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-indigo-500/20 shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                {user.plan === 'pro' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 shrink-0">
                    PRO
                  </span>
                )}
              </div>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              MAIN MENU
            </span>
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Preferences Navigation */}
          <div className="space-y-1 pt-2">
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              PREFERENCES
            </span>
            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span>Update Profile</span>
            </Link>

            {user.plan !== 'pro' && (
              <Link
                href="/pricing"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade to PRO</span>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Sign Out Area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {workspaceTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-amber-400 hover:scale-105 transition-all shadow-sm flex items-center justify-center"
            >
              {theme === 'dark' ? <SunMedium className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">
                {user.name}
              </span>
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
