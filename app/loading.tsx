import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="h-5 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60"
          ></div>
        ))}
      </div>
    </div>
  );
}
