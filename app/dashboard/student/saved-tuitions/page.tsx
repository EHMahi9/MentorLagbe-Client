'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen, ArrowRight } from 'lucide-react';
import TuitionCard, { Tuition } from '../../../../components/TuitionCard';
import { apiRequest } from '../../../../lib/api';

export default function SavedTuitionsPage() {
  const [bookmarks, setBookmarks] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = () => {
    setLoading(true);
    apiRequest<{ success: boolean; bookmarks: Tuition[] }>('/api/users/bookmarks')
      .then((res) => {
        if (res.success && res.bookmarks) {
          setBookmarks(res.bookmarks);
        }
      })
      .catch((err) => console.error('Fetch bookmarks error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkRemoved = (id: string, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Saved Tuitions & Bookmarks
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Quickly access your saved tuition listings and apply whenever you are ready.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((tuition) => (
            <TuitionCard
              key={tuition._id}
              tuition={tuition}
              isBookmarked={true}
              onBookmarkChange={handleBookmarkRemoved}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No saved tuitions yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click the bookmark icon on any tuition card to save it here for future reference.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white shadow-md shadow-teal-600/30"
          >
            <span>Explore Tuitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
