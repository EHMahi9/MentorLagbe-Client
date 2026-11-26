'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  plan: 'free' | 'pro';
  image?: string;
  phone?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    apiRequest<{ success: boolean; users: AdminUser[] }>('/api/admin/users')
      .then((res) => {
        if (res.success && res.users) {
          setUsers(res.users);
        }
      })
      .catch((err) => console.error('Fetch users error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/api/admin/users/${userId}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            View registered platform members and modify permissions/roles.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Subscription Plan</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4 text-right">Modify Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {u.plan === 'pro' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                          <Sparkles className="w-3 h-3" /> PRO
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Current Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : u.role === 'tutor'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Modify Role Dropdown */}
                    <td className="px-6 py-4 text-right">
                      <select
                        disabled={updatingId === u._id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-2">
          <Users className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No users found</h3>
        </div>
      )}
    </div>
  );
}
