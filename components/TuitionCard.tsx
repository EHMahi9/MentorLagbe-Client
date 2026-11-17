'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, MapPin, Calendar, User, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { apiRequest } from '../lib/api';
import toast from 'react-hot-toast';

export interface Tuition {
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
}

export default function TuitionCard({
  tuition,
  isBookmarked: initialBookmarked = false,
  onBookmarkChange,
}: {
  tuition: Tuition;
  isBookmarked?: boolean;
  onBookmarkChange?: (id: string, state: boolean) => void;
}) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarking, setBookmarking] = useState(false);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in as a Student to bookmark tuitions.');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can bookmark tuitions.');
      return;
    }

    try {
      setBookmarking(true);
      const res = await apiRequest<{ success: boolean; bookmarked: boolean; message: string }>(
        `/api/users/bookmarks/${tuition._id}`,
        { method: 'POST' }
      );

      if (res.success) {
        setBookmarked(res.bookmarked);
        toast.success(res.message);
        if (onBookmarkChange) {
          onBookmarkChange(tuition._id, res.bookmarked);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update bookmark.');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      {/* Banner Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={tuition.bannerImage || 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80'}
          alt={tuition.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
              tuition.mode === 'Online'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {tuition.mode === 'Online' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {tuition.mode}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white shadow-sm">
            {tuition.classLevel}
          </span>
        </div>

        {/* Bookmark Button */}
        {user?.role === 'student' && (
          <button
            onClick={handleToggleBookmark}
            disabled={bookmarking}
            aria-label="Bookmark tuition"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 shadow-md backdrop-blur-sm transition-transform active:scale-90"
          >
            <Bookmark
              className={`w-4 h-4 ${bookmarked ? 'fill-teal-600 text-teal-600 dark:fill-teal-400 dark:text-teal-400' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5">
        {/* Subject & Verified */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 rounded-md">
            {tuition.subject}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Verified
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {tuition.title}
        </h3>

        {/* Description Snippet */}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {tuition.description}
        </p>

        {/* Meta Info */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 truncate">
              <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate font-medium">{tuition.tutorName}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{tuition.daysPerWeek}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{tuition.location}</span>
          </div>
        </div>

        {/* Bottom Pricing & CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block">Monthly Fee</span>
            <span className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
              ৳{tuition.monthlyFee.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white text-gray-800 dark:text-gray-200 transition-all duration-200 group-hover:bg-teal-600 group-hover:text-white"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
