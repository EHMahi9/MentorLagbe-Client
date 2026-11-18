import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-teal-200 dark:bg-teal-900/50 rounded-full"></div>
        <div className="h-10 w-72 max-w-full bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-80 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-8 w-24 bg-teal-200 dark:bg-teal-900/60 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
