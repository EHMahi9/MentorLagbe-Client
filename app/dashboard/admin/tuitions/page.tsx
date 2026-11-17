'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface AdminTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
}

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<AdminTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTuitions = () => {
    setLoading(true);
    apiRequest<{ success: boolean; tuitions: AdminTuition[] }>('/api/admin/tuitions')
      .then((res) => {
        if (res.success && res.tuitions) {
          setTuitions(res.tuitions);
        }
      })
      .catch((err) => console.error('Fetch tuitions error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitions();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/api/admin/tuitions/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        setTuitions((prev) =>
          prev.map((t) => (t._id === id ? { ...t, approvalStatus: status } : t))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tuition status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Counts for tabs
  const pendingCount = tuitions.filter((t) => t.approvalStatus === 'pending').length;
  const approvedCount = tuitions.filter((t) => t.approvalStatus === 'approved').length;
  const rejectedCount = tuitions.filter((t) => t.approvalStatus === 'rejected').length;

  const filteredTuitions = tuitions.filter((t) => {
    if (activeTab === 'pending') return t.approvalStatus === 'pending';
    if (activeTab === 'approved') return t.approvalStatus === 'approved';
    if (activeTab === 'rejected') return t.approvalStatus === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Tuition Moderation
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Review, approve, or reject tuition listings submitted by tutors before they become visible to students.
        </p>
      </div>

      {/* Filter Tabs (Exact design from video frame 20) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
          }`}
        >
          <span>Pending</span>
          <span className="w-5 h-5 rounded-full bg-white/30 text-[10px] flex items-center justify-center font-bold">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'approved'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
          }`}
        >
          <span>Approved</span>
          <span className="w-5 h-5 rounded-full bg-white/30 text-[10px] flex items-center justify-center font-bold">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
          }`}
        >
          <span>Rejected</span>
          <span className="w-5 h-5 rounded-full bg-white/30 text-[10px] flex items-center justify-center font-bold">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <span>All Tuitions</span>
          <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/20 text-[10px] flex items-center justify-center font-bold">
            {tuitions.length}
          </span>
        </button>
      </div>

      {/* Tuitions Moderation Table */}
      {loading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : filteredTuitions.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Tutor</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/tuitions/${t._id}`}
                          className="font-bold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1.5"
                        >
                          <span className="truncate max-w-xs">{t.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        </Link>
                        <p className="text-[10px] text-gray-400">{t.mode} • {t.location}</p>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                        {t.subject}
                      </span>
                    </td>

                    {/* Tutor */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{t.tutorName}</p>
                      <p className="text-[10px] text-gray-400">{t.tutorEmail}</p>
                    </td>

                    {/* Monthly Fee */}
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      ৳{t.monthlyFee?.toLocaleString() || 0}
                    </td>

                    {/* Approval Status */}
                    <td className="px-6 py-4">
                      {t.approvalStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : t.approvalStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Active */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-medium ${
                          t.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                        }`}
                      >
                        {t.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {t.approvalStatus === 'pending' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(t._id, 'approved')}
                            disabled={updatingId === t._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(t._id, 'rejected')}
                            disabled={updatingId === t._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              t._id,
                              t.approvalStatus === 'approved' ? 'rejected' : 'approved'
                            )
                          }
                          disabled={updatingId === t._id}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline"
                        >
                          {t.approvalStatus === 'approved' ? 'Revoke' : 'Re-approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-2">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No tuitions in this category
          </h3>
        </div>
      )}
    </div>
  );
}
