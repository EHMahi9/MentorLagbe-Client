'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface Application {
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

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchApplications = () => {
    setLoading(true);
    apiRequest<{ success: boolean; applications: Application[] }>(
      '/api/applications/student/my-applications'
    )
      .then((res) => {
        if (res.success && res.applications) {
          setApplications(res.applications);
        }
      })
      .catch((err) => console.error('Fetch applications error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancelApplication = async (appId: string) => {
    if (!confirm('Are you sure you want to cancel this tuition application?')) {
      return;
    }

    setCancellingId(appId);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/api/applications/${appId}`,
        { method: 'DELETE' }
      );

      if (res.success) {
        toast.success(res.message);
        setApplications((prev) => prev.filter((a) => a._id !== appId));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel application.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          My Tuition Applications
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Review all tuitions you applied for, monitor instructor decisions, or cancel pending requests.
        </p>
      </div>

      {/* Applications Table / Content */}
      {loading ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tuition Title & Subject</th>
                  <th className="px-6 py-4">Tutor Contact</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Link
                          href={`/tuitions/${app.tuitionId}`}
                          className="font-bold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1.5"
                        >
                          <span className="truncate max-w-xs">{app.tuitionTitle}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        </Link>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                          {app.subject}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <p className="font-semibold text-gray-900 dark:text-white">{app.tutorEmail}</p>
                      <p className="text-[11px] text-gray-400">Preferred: {app.preferredSchedule}</p>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-teal-700 dark:text-teal-400 text-sm">
                      ৳{app.monthlyFee?.toLocaleString() || 0}
                    </td>

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>

                    <td className="px-6 py-4 text-right">
                      {app.status === 'pending' ? (
                        <button
                          onClick={() => handleCancelApplication(app._id)}
                          disabled={cancellingId === app._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{cancellingId === app._id ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No action needed</span>
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
          <FileText className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No applications yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Explore available batches and apply for a tuition that fits your learning needs.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white shadow-md shadow-teal-600/30"
          >
            <span>Browse Tuitions</span>
          </Link>
        </div>
      )}
    </div>
  );
}
