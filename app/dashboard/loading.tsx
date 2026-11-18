import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-4 w-80 max-w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl self-start sm:self-auto"></div>
      </div>

      {/* 4 Metric Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* Content / Table Placeholder Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="h-16 w-full bg-gray-100 dark:bg-gray-800/60 rounded-2xl flex items-center px-4 justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
