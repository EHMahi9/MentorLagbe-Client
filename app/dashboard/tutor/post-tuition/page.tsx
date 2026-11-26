'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../../../lib/authContext';
import { apiRequest } from '../../../../lib/api';
import { uploadToImgBB } from '../../../../lib/imgbb';
import toast from 'react-hot-toast';

export default function PostTuitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [classLevel, setClassLevel] = useState('Class 9-10');
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');
  const [location, setLocation] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('3 days / week');
  const [description, setDescription] = useState('');

  // Image Upload State (Challenge 3)
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitError, setLimitError] = useState(false);

  const subjects = [
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

  const classLevels = [
    'Class 9-10',
    'HSC',
    'O-Level',
    'A-Level',
    'University',
    'Professional',
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !monthlyFee || !description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    let bannerImageUrl =
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80';

    // Upload image to ImgBB if a file was selected (Challenge 3)
    if (bannerFile) {
      setUploadingImage(true);
      try {
        toast.loading('Uploading banner image to ImgBB...');
        bannerImageUrl = await uploadToImgBB(bannerFile);
        toast.dismiss();
      } catch (err: any) {
        toast.dismiss();
        toast.error(`Image upload failed: ${err.message}. Using default banner.`);
      } finally {
        setUploadingImage(false);
      }
    }

    try {
      const res = await apiRequest<{ success: boolean; message: string; limitReached?: boolean }>(
        '/api/tuitions',
        {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            subject,
            classLevel,
            mode,
            location: location.trim() || (mode === 'Online' ? 'Online (Zoom / Meet)' : 'In-person'),
            monthlyFee: Number(monthlyFee),
            daysPerWeek,
            bannerImage: bannerImageUrl,
            description: description.trim(),
          }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        router.push('/dashboard/tutor/my-tuitions');
      }
    } catch (err: any) {
      if (err.message?.includes('Free Plan allows a maximum of 2 tuition posts')) {
        setLimitError(true);
      }
      toast.error(err.message || 'Failed to create tuition listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Post a New Tuition Batch
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Create an academic batch or 1-on-1 mentorship listing for admin review and student applications.
        </p>
      </div>

      {/* Free Plan Limit Notice */}
      {user?.plan !== 'pro' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Free Plan:</strong> You can post up to 2 active tuition batches. Upgrade to Pro for unlimited posts.
            </span>
          </div>
          <Link
            href="/pricing"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Post Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6"
      >
        {/* Tuition Title */}
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Tuition Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., University Advanced Calculus & Linear Algebra Mentorship"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Subject & Class Level Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Subject *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Class Level *
            </label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode & Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Delivery Mode *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('Online')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  mode === 'Online'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setMode('Offline')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  mode === 'Offline'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                In-Person (Offline)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Location / Platform
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={mode === 'Online' ? 'Online (Zoom / Meet)' : 'e.g., Dhanmondi, Dhaka'}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Monthly Fee & Days/Week Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Monthly Fee (৳ BDT) *
            </label>
            <input
              type="number"
              required
              min="500"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="e.g., 5500"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Days Per Week *
            </label>
            <input
              type="text"
              required
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              placeholder="e.g., 3 days / week"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Direct ImgBB Image Upload (Challenge 3) */}
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Banner Image (Direct Upload via ImgBB API)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl transition-colors">
            <div className="space-y-2 text-center">
              {bannerPreview ? (
                <div className="relative mx-auto w-48 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
              )}
              <div className="flex text-xs text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer rounded-md font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Tuition Description & Course Plan *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what students will learn, syllabus covered, prerequisite knowledge, and your teaching approach..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting for Approval...' : 'Publish Tuition Post'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
