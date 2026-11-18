'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Atom,
  Calculator,
  Code2,
  Languages,
  Check,
  Flame,
} from 'lucide-react';
import TuitionCard, { Tuition } from '../components/TuitionCard';
import { apiRequest } from '../lib/api';
import { useAuth } from '../lib/authContext';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [featuredTuitions, setFeaturedTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiRequest<{ success: boolean; tuitions: Tuition[] }>('/api/tuitions/featured')
      .then((res) => {
        if (res.success && res.tuitions) {
          setFeaturedTuitions(res.tuitions);
        }
      })
      .catch((err) => console.error('Error fetching featured tuitions:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tuitions?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/tuitions');
    }
  };

  const categories = [
    { name: 'Mathematics', count: '18+ Mentors', icon: Calculator, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { name: 'Physics', count: '14+ Mentors', icon: Atom, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { name: 'Programming', count: '22+ Mentors', icon: Code2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { name: 'IELTS Preparation', count: '10+ Mentors', icon: Languages, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Sign Up & Choose Role',
      desc: 'Register as a Student looking for mentorship, or as a verified Tutor creating academic batches.',
    },
    {
      step: '02',
      title: 'Explore & Filter Tuitions',
      desc: 'Filter by Subject, Class Level (Class 9-10, HSC, University), and Mode (Online or In-person).',
    },
    {
      step: '03',
      title: 'Apply with Flexible Schedule',
      desc: 'Students submit learning preferences and notes; mentors accept applications in real time.',
    },
    {
      step: '04',
      title: 'Upgrade & Grow with Pro',
      desc: 'Unlock unlimited batch postings, verified golden badges, and priority matching via Stripe.',
    },
  ];

  const testimonials = [
    {
      name: 'Tanvir Hossain',
      role: 'CSE Student, BUET',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      comment:
        'MentorLagbe helped me find a dedicated mentor for University Advanced Calculus. The direct application and scheduling system saved me weeks of searching.',
      rating: 5,
    },
    {
      name: 'Nusrat Jahan',
      role: 'HSC Science Candidate',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      comment:
        'The online physics batch was clear and interactive. I can track my application status right from my student workspace.',
      rating: 5,
    },
    {
      name: 'Karim Rahman',
      role: 'Senior Math Tutor (BUET Alumnus)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment:
        'As a tutor, the Pro plan has paid for itself multiple times over. Managing applicants and scheduling batches has never been this seamless.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. Hero / Banner Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 bg-gradient-to-b from-teal-50/50 via-white to-transparent dark:from-gray-900/40 dark:via-gray-950 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Next-Generation Tuition & Mentorship Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15]">
                Find Your Ideal <span className="text-teal-600 dark:text-teal-400">Tutor</span> or{' '}
                <span className="text-teal-600 dark:text-teal-400">Mentorship Batch</span> Today.
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Connect directly with certified educators and subject-matter mentors for school, HSC,
                university coursework, and technical skills. Moderated listings with verified reviews.
              </p>

              {/* Search Bar Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-2.5 px-3 w-full">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by subject (e.g., Mathematics, Python, Physics)..."
                    className="w-full py-2 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all shrink-0"
                >
                  Find Tutors
                </button>
              </form>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>100% Admin Moderated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-500" />
                  <span>BUET & DU Top Mentors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span>Direct Enrollment</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="Mentorship session"
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                        ★
                      </div>
                      <div>
                        <p className="text-sm font-bold">4.9 / 5.0 Average Rating</p>
                        <p className="text-xs text-teal-200">Across 1,200+ completed mentorship sessions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-3.5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-bounce duration-1000">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Fast Enrollment
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Response within 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Subject Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
              EXPLORE BY DISCIPLINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              Top Subject Categories
            </h2>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
          >
            <span>View all subjects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/tuitions?subject=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 hover:border-teal-500/50 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Dynamic Featured Tuitions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
            ACTIVE ENROLLMENTS
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Featured Tuition & Mentorship Batches
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hand-curated and Admin-approved tuition listings ready for student applications.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : featuredTuitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No approved tuitions available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-teal-600 dark:hover:bg-teal-400 dark:hover:text-gray-900 transition-colors shadow-md"
          >
            <span>Browse All Tuitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Extra Section 1 — How MentorLagbe Works */}
      <section id="how-it-works" className="bg-gray-100/60 dark:bg-gray-900/40 py-16 lg:py-20 border-y border-gray-200/60 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
              SIMPLE 4-STEP PROCESS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              How MentorLagbe Works
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A frictionless workflow connecting students and mentors in Bangladesh and worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-extrabold text-teal-600/20 dark:text-teal-400/20 mb-3">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing / Subscription Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
            CHOOSE YOUR PLAN
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Simple, Transparent Subscription
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affordable monthly plans for committed students and ambitious academic mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Starter Plan</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Free Forever
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Perfect for students and tutors looking to test the platform.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                <span className="text-sm text-gray-400"> / month</span>
              </div>

              <ul className="space-y-3 pt-4 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Up to 2 tuition posts (Tutor)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Up to 5 tuition bookmarks (Student)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Direct tuition applications
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Basic profile & search filters
                </li>
              </ul>
            </div>

            <div className="pt-8">
              {user?.plan === 'pro' ? (
                <span className="block w-full py-3 text-center rounded-xl text-sm font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                  Included in PRO
                </span>
              ) : user ? (
                <span className="block w-full py-3 text-center rounded-xl text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  Current Free Plan
                </span>
              ) : (
                <Link
                  href="/sign-up"
                  className="block w-full py-3 text-center rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </div>

          {/* MentorLagbe PRO */}
          <div className="relative p-8 rounded-3xl bg-white dark:bg-gray-800 border-2 border-teal-500 dark:border-teal-400 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-600 text-white tracking-wider uppercase shadow-md">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">MentorLagbe PRO</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  <Sparkles className="w-3 h-3" /> PRO Badge
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Unlimited reach, verified credential badges, and priority matching.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">$15</span>
                <span className="text-sm text-gray-400"> /mo for Tutors</span>
                <span className="text-xs text-gray-400 block mt-1">or $10/mo for Students</span>
              </div>

              <ul className="space-y-3 pt-4 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" />
                  <strong>Unlimited</strong> tuition posts & bookmarks
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Golden PRO verification badge
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Priority listing in search & category filters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500" /> Priority applicant notifications & reviews
                </li>
              </ul>
            </div>

            <div className="pt-8">
              {user?.plan === 'pro' ? (
                <button
                  disabled
                  className="block w-full py-3 text-center rounded-xl text-sm font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default"
                >
                  ✓ Current Active Plan (PRO)
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="block w-full py-3 text-center rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all"
                >
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Extra Section 2 — Platform Statistics & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Counter Stats Bar */}
        <div className="p-8 rounded-3xl bg-gray-900 text-white shadow-2xl mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">1,500+</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Active Students</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">320+</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Verified Mentors</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">98%</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Satisfaction Rate</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">50+</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Subjects Covered</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
            COMMUNITY VOICES
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Trusted by Learners and Educators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-700/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
