'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Power,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Save,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface TutorTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: 'Online' | 'Offline';
  location: string;
  monthlyFee: number;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
}

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<TutorTuition[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTuition, setEditingTuition] = useState<TutorTuition | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchMyTuitions = () => {
    setLoading(true);
    apiRequest<{ success: boolean; tuitions: TutorTuition[] }>('/api/tuitions/tutor/my-tuitions')
      .then((res) => {
        if (res.success && res.tuitions) {
          setTuitions(res.tuitions);
        }
      })
      .catch((err) => console.error('Fetch my tuitions error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  // Toggle Active Status
  const handleToggleActive = async (id: string) => {
    try {
      const res = await apiRequest<{ success: boolean; isActive: boolean; message: string }>(
        `/api/tuitions/${id}/toggle-active`,
        { method: 'PATCH' }
      );

      if (res.success) {
        toast.success(res.message);
        setTuitions((prev) =>
          prev.map((t) => (t._id === id ? { ...t, isActive: res.isActive } : t))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update active state.');
    }
  };

  // Delete Tuition
  const handleDeleteTuition = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tuition post? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/api/tuitions/${id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success(res.message);
        setTuitions((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete tuition.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (t: TutorTuition) => {
    setEditingTuition({ ...t });
    setEditModalOpen(true);
  };

  // Save Edit Submission
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTuition) return;

    setSavingEdit(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/api/tuitions/${editingTuition._id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: editingTuition.title,
            subject: editingTuition.subject,
            classLevel: editingTuition.classLevel,
            mode: editingTuition.mode,
            location: editingTuition.location,
            monthlyFee: editingTuition.monthlyFee,
            daysPerWeek: editingTuition.daysPerWeek,
            description: editingTuition.description,
          }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        setTuitions((prev) =>
          prev.map((t) => (t._id === editingTuition._id ? editingTuition : t))
        );
        setEditModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tuition.');
    } finally {
      setSavingEdit(false);
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Tuitions</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage your created tuition listings, toggle availability, or make updates.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Tuition</span>
        </Link>
      </div>

      {/* Tuitions Table */}
      {loading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : tuitions.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tuition</th>
                  <th className="px-6 py-4">Subject & Level</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4">Active Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {tuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.bannerImage || 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=150&q=80'}
                          alt={t.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{t.title}</p>
                          <p className="text-[11px] text-gray-400">{t.mode} • {t.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Level */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                          {t.subject}
                        </span>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Class {t.classLevel}</p>
                      </div>
                    </td>

                    {/* Fee */}
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">
                      ৳{t.monthlyFee?.toLocaleString() || 0}
                    </td>

                    {/* Approval Status */}
                    <td className="px-6 py-4">{getApprovalBadge(t.approvalStatus)}</td>

                    {/* Active Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(t._id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          t.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{t.isActive ? 'Active' : 'Closed'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/tuitions/${t._id}`}
                          aria-label="View Tuition"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          aria-label="Edit Tuition"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTuition(t._id)}
                          aria-label="Delete Tuition"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No tuitions posted yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Create your first tuition batch or 1-on-1 mentorship session now.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white shadow-md shadow-teal-600/30"
          >
            <span>Post Tuition</span>
          </Link>
        </div>
      )}

      {/* Edit Tuition Modal */}
      {editModalOpen && editingTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Tuition Listing
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Update the title, fee, or schedule of this tuition batch.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Tuition Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTuition.title}
                  onChange={(e) =>
                    setEditingTuition({ ...editingTuition, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Monthly Fee (৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingTuition.monthlyFee}
                    onChange={(e) =>
                      setEditingTuition({
                        ...editingTuition,
                        monthlyFee: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Days Per Week
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTuition.daysPerWeek}
                    onChange={(e) =>
                      setEditingTuition({
                        ...editingTuition,
                        daysPerWeek: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTuition.description}
                  onChange={(e) =>
                    setEditingTuition({
                      ...editingTuition,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
