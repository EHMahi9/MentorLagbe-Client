'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Shield, Zap, ArrowRight, Star, HelpCircle, Award } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { apiRequest } from '../../lib/api';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const handleStripeCheckout = async (planType: 'tutor' | 'student') => {
    if (!user) {
      toast.error('Please sign in or create an account first to upgrade.');
      router.push('/sign-in?redirect=/pricing');
      return;
    }

    if (user.plan === 'pro') {
      toast.success('You already have an active MentorLagbe PRO plan!');
      router.push(user.role === 'admin' ? '/dashboard/admin' : user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student');
      return;
    }

    setUpgrading(true);
    try {
      const res = await apiRequest<{ success: boolean; url: string; sessionId: string }>(
        '/api/payments/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify({ planType: user.role === 'tutor' ? 'tutor' : 'student' }),
        }
      );

      if (res.success && res.url) {
        toast.loading('Redirecting to Stripe Checkout...');
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate Stripe Checkout.');
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300">
          <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Transparent EdTech Subscription</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Supercharge Your Tuition Reach with PRO
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Whether you are a student looking for priority mentor placement or a tutor seeking unlimited
          batch listings, we have the right plan for you.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Starter Plan */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Starter Plan</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                Free Forever
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Essential features for students and tutors to get started on MentorLagbe.
            </p>
            <div className="pt-2">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$0</span>
              <span className="text-sm text-gray-400"> / month</span>
            </div>

            <ul className="space-y-3 pt-6 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Up to 2 tuition listings (Tutors)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Up to 5 saved tuition bookmarks (Students)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Standard direct tuition applications</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Basic search and subject filters</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-gray-100 dark:border-gray-700">
            {user ? (
              <button
                disabled
                className="w-full py-3.5 text-center rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default"
              >
                {user.plan === 'pro' ? 'Included in your account' : 'Current Active Plan'}
              </button>
            ) : (
              <Link
                href="/sign-up"
                className="block w-full py-3.5 text-center rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              >
                Sign Up for Free
              </Link>
            )}
          </div>
        </div>

        {/* MentorLagbe PRO */}
        <div className="relative p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/90 border-2 border-teal-500 dark:border-teal-400 shadow-2xl flex flex-col justify-between">
          <div className="absolute -top-4 right-8 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white tracking-wider uppercase shadow-md flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> RECOMMENDED
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">MentorLagbe PRO</h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                PRO Badge
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Unlimited reach, golden verification badge, and priority algorithmic placement.
            </p>
            <div className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-teal-600 dark:text-teal-400">
                  {user?.role === 'student' ? '$10' : '$15'}
                </span>
                <span className="text-sm text-gray-400">
                  {user?.role === 'student' ? '/mo for Students' : '/mo for Tutors'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {user?.role === 'tutor'
                  ? '($10/mo for Students)'
                  : user?.role === 'student'
                  ? '($15/mo for Tutors)'
                  : '($15/mo for Tutors or $10/mo for Students)'}
              </p>
            </div>

            <ul className="space-y-3 pt-6 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>
                  <strong>Unlimited</strong> tuition posts & student bookmarks
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Golden PRO credential badge on profile and listings</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Top placement on Browse Tuitions page and search results</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Instant notifications and priority review queue</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-gray-100 dark:border-gray-700">
            {user?.plan === 'pro' ? (
              <button
                disabled
                className="w-full py-3.5 text-center rounded-xl text-sm font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default"
              >
                PRO Plan Active
              </button>
            ) : (
              <button
                onClick={() => handleStripeCheckout(user?.role === 'student' ? 'student' : 'tutor')}
                disabled={upgrading}
                className="w-full py-3.5 text-center rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 transition-all hover:shadow-xl disabled:opacity-50"
              >
                {upgrading ? 'Connecting to Stripe...' : 'Subscribe with Stripe →'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto pt-10 border-t border-gray-200 dark:border-gray-800 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-gray-300">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-2">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              Can free tutors post unlimited batches?
            </h4>
            <p>
              Free plan tutors can post up to 2 active tuition batches. To post unlimited listings, tutors can upgrade to the Pro plan for $15/month.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-2">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              How does Stripe payment work?
            </h4>
            <p>
              Payments are securely processed through Stripe Checkout. Upon transaction completion, your account is immediately upgraded with full PRO perks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
