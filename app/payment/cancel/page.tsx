'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
        <XCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Subscription Cancelled
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The Stripe Checkout session was cancelled or closed. No charges were made to your card.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/pricing"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
