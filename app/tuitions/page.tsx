'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import TuitionCard, { Tuition } from '../../components/TuitionCard';
import { apiRequest } from '../../lib/api';

function BrowseTuitionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  // State from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'All');
  const [classLevel, setClassLevel] = useState(searchParams.get('classLevel') || 'All');
  const [mode, setMode] = useState(searchParams.get('mode') || 'All');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const subjectsList = [
    'All',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Data Science',
    'Web Development',
    'Programming',
    'IELTS Preparation',
    'English',
    'Business Studies',
  ];

  const classLevelsList = [
    'All',
    'Class 9-10',
    'HSC',
    'O-Level',
    'A-Level',
    'University',
    'Professional',
  ];

  const modesList = ['All', 'Online', 'Offline'];

  // Fetch Tuitions when filters/page change (Server-Side search, filter, pagination)
  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (subject !== 'All') params.set('subject', subject);
      if (classLevel !== 'All') params.set('classLevel', classLevel);
      if (mode !== 'All') params.set('mode', mode);
      params.set('page', page.toString());
      params.set('limit', '9');

      const data = await apiRequest<{
        success: boolean;
        tuitions: Tuition[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      }>(`/api/tuitions?${params.toString()}`);

      if (data.success) {
        setTuitions(data.tuitions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching tuitions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions();
  }, [page, subject, classLevel, mode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTuitions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSubject('All');
    setClassLevel('All');
    setMode('All');
    setPage(1);
    router.push('/tuitions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
          EXPLORE OPPORTUNITIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Browse Approved Tuitions & Batches
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Search verified tutors by subject, target class level, and learning mode (Online / Offline).
        </p>
      </div>

      {/* Filter and Search Controls (Challenge 1) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tuition title, subject or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Subject Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Class Level Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Class Level
            </label>
            <select
              value={classLevel}
              onChange={(e) => {
                setClassLevel(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classLevelsList.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {modesList.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Delivery Modes' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <p>
          Showing <span className="font-semibold text-gray-900 dark:text-white">{tuitions.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> tuitions
        </p>
        <span className="italic">Page {pagination.page} of {pagination.totalPages}</span>
      </div>

      {/* Tuitions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : tuitions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No matching tuitions found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or reset your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Server-Side Pagination Controls (Optional 1) */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {[...Array(pagination.totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === pagination.page;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseTuitionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading tuitions...</div>}>
      <BrowseTuitionsContent />
    </Suspense>
  );
}
