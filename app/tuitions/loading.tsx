import React from 'react';

export default function TuitionsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="h-11 w-full md:w-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      {/* Tuition Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Image Placeholder */}
            <div className="h-48 w-full bg-gray-200 dark:bg-gray-800"></div>

            {/* Card Content Placeholder */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>

              {/* Bottom Tutor Info & Fee */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-indigo-200 dark:bg-indigo-900/60 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
