'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Check,
  X,
  Mail,
  Phone,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface ApplicantItem {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export default function ManageApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplicants = () => {
    setLoading(true);
    apiRequest<{ success: boolean; applicants: ApplicantItem[] }>(
      '/api/applications/tutor/applicants'
    )
      .then((res) => {
        if (res.success && res.applicants) {
          setApplicants(res.applicants);
        }
      })
      .catch((err) => console.error('Fetch applicants error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = async (appId: string, status: 'accepted' | 'rejected') => {
    setUpdatingId(appId);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/api/applications/${appId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        setApplicants((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Accepted
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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Manage Applicants
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Review candidate applications submitted to your courses and approve or decline students.
        </p>
      </div>

      {loading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : applicants.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Tuition Course</th>
                  <th className="px-6 py-4">Schedule & Note</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applicants.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                          {a.studentName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{a.studentName}</p>
                          <p className="text-[10px] text-gray-400">
                            Applied {new Date(a.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{a.studentEmail}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{a.studentPhone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Tuition Course */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs">
                          {a.tuitionTitle}
                        </p>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                          {a.subject}
                        </span>
                      </div>
                    </td>

                    {/* Schedule & Note */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-xs">
                        <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{a.preferredSchedule}</span>
                        </p>
                        {a.studentNote && (
                          <p className="text-[11px] text-gray-400 italic line-clamp-2">
                            &ldquo;{a.studentNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(a.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {a.status === 'pending' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(a._id, 'accepted')}
                            disabled={updatingId === a._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(a._id, 'rejected')}
                            disabled={updatingId === a._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium italic">
                          Responded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
          <Users className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No applicants received yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              When students apply for your tuition batches, they will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
