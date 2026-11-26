'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Globe,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Send,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../../../lib/authContext';
import { apiRequest } from '../../../lib/api';
import toast from 'react-hot-toast';

interface TuitionDetail {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: 'Online' | 'Offline';
  location: string;
  monthlyFee: number;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: string;
  isActive: boolean;
  createdAt: string;
  tutorProfile?: {
    name: string;
    email: string;
    image?: string;
    bio?: string;
    phone?: string;
    plan?: string;
  };
}

export default function TuitionDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { user } = useAuth();

  const [tuition, setTuition] = useState<TuitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application State
  const [isApplied, setIsApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [studentPhone, setStudentPhone] = useState(user?.phone || '');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [studentNote, setStudentNote] = useState('');

  // Bookmark State
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    apiRequest<{ success: boolean; tuition: TuitionDetail }>(`/api/tuitions/${params.id}`)
      .then((res) => {
        if (res.success && res.tuition) {
          setTuition(res.tuition);
        } else {
          setError('Tuition not found.');
        }
      })
      .catch((err) => setError(err.message || 'Failed to load tuition.'))
      .finally(() => setLoading(false));

    // If student is logged in, check if already applied or bookmarked
    if (user && user.role === 'student') {
      apiRequest<{ success: boolean; applications: any[] }>(
        '/api/applications/student/my-applications'
      )
        .then((res) => {
          if (res.success && res.applications) {
            const hasApplied = res.applications.some((a) => a.tuitionId === params.id);
            setIsApplied(hasApplied);
          }
        })
        .catch(() => {});

      apiRequest<{ success: boolean; bookmarks: any[] }>('/api/users/bookmarks')
        .then((res) => {
          if (res.success && res.bookmarks) {
            const hasBookmarked = res.bookmarks.some((b) => b._id === params.id);
            setBookmarked(hasBookmarked);
          }
        })
        .catch(() => {});
    }
  }, [params.id, user]);

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in as a student to bookmark tuitions.');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can bookmark tuitions.');
      return;
    }

    try {
      const res = await apiRequest<{ success: boolean; bookmarked: boolean; message: string }>(
        `/api/users/bookmarks/${params.id}`,
        { method: 'POST' }
      );
      if (res.success) {
        setBookmarked(res.bookmarked);
        toast.success(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update bookmark.');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tuition link copied to clipboard!');
    }
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      toast.error('Please sign in to apply for this tuition.');
      router.push(`/sign-in?redirect=/tuitions/${params.id}`);
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can apply for tuitions.');
      return;
    }

    if (isApplied) {
      toast('You have already applied for this tuition.', { icon: 'ℹ️' });
      return;
    }

    setApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentPhone.trim() || !preferredSchedule.trim()) {
      toast.error('Please provide your phone number and preferred schedule.');
      return;
    }

    setSubmittingApp(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          tuitionId: params.id,
          studentPhone,
          preferredSchedule,
          studentNote,
        }),
      });

      if (res.success) {
        toast.success(res.message);
        setIsApplied(true);
        setApplyModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="h-80 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tuition Listing Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error || 'This tuition does not exist.'}</p>
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Tuitions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* Navigation Breadcrumb */}
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Tuitions
      </Link>

      {/* Main Grid: Details Left, Action Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Banner Image Container */}
          <div className="relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
            <img
              src={tuition.bannerImage || 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80'}
              alt={tuition.title}
              className="w-full h-full object-cover"
            />
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white shadow">
                {tuition.mode === 'Online' ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {tuition.mode} Session
              </span>
            </div>

            {/* Top Right Share & Bookmark */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                aria-label="Share"
                className="p-2.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-md backdrop-blur-sm transition-transform active:scale-95"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {user?.role === 'student' && (
                <button
                  onClick={handleToggleBookmark}
                  aria-label="Bookmark"
                  className="p-2.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-md backdrop-blur-sm transition-transform active:scale-95"
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarked ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Title & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {tuition.subject}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Class {tuition.classLevel}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Tuition
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {tuition.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-500 dark:text-gray-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span>Mentor:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tuition.tutorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Schedule: <strong>{tuition.daysPerWeek}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Posted: {new Date(tuition.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">About This Tuition</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {tuition.description}
            </div>
          </div>

          {/* Tutor Profile Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Meet the Instructor</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={tuition.tutorProfile?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={tuition.tutorName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {tuition.tutorName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                    Verified Mentor
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tuition.tutorProfile?.bio || 'Certified Academic Mentor specializing in personalized teaching methodologies.'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {tuition.tutorEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Card (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block">
                MONTHLY TUITION FEE
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ৳{tuition.monthlyFee.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
            </div>

            {/* Quick Details Table */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subject</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tuition.subject}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Class Level</span>
                <span className="font-semibold text-gray-900 dark:text-white">Class {tuition.classLevel}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Delivery Mode</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tuition.mode}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Location</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tuition.location}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Weekly Classes</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tuition.daysPerWeek}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                  Approved
                </span>
              </div>
            </div>

            {/* Tutor Information */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                TUITION MENTOR
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {tuition.tutorName.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {tuition.tutorName}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{tuition.tutorEmail}</p>
                </div>
              </div>
            </div>

            {/* Application Flow & Role Restrictions */}
            <div className="pt-2">
              {user?.role === 'tutor' || user?.role === 'admin' ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Logged in as {user.role === 'admin' ? 'Admin' : 'Tutor'}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Only students can apply for tuitions.
                  </p>
                </div>
              ) : isApplied ? (
                <div className="space-y-2 text-center">
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl text-sm font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Already Applied (pending)
                  </button>
                  <Link
                    href="/dashboard/student/my-applications"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline block"
                  >
                    Check application status on your Dashboard
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="w-full py-3.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-xl"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 space-y-5">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                BOOKING FORM
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                Apply for {tuition.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Share your schedule preference and learning goals with {tuition.tutorName}.
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="e.g., +880-1700-123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Preferred Schedule / Timing *
                </label>
                <input
                  type="text"
                  required
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  placeholder="e.g., Evenings (Mon, Wed, Fri 7:00 PM) or Weekends"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Learning Goals or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Tell the tutor about your syllabus, weak points, or specific topics you want to prioritize..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {submittingApp ? 'Submitting...' : 'Confirm Application'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
