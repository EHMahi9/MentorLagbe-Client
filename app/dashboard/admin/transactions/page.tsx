'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../../../lib/api';

interface Transaction {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; transactions: Transaction[] }>('/api/admin/transactions')
      .then((res) => {
        if (res.success && res.transactions) {
          setTransactions(res.transactions);
        }
      })
      .catch((err) => console.error('Fetch transactions error:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Stripe Transactions & Subscriptions
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time logs of all Pro subscription upgrades recorded from Stripe Checkout.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-300">
              Total Revenue
            </p>
            <p className="text-lg font-black text-indigo-900 dark:text-white">
              ${totalRevenue} USD
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Plan Purchased</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{t.userName}</p>
                        <p className="text-[10px] text-gray-400">
                          {t.userEmail} • <span className="capitalize">{t.userRole}</span>
                        </p>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                        {t.planName}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">
                      ${t.amount} {t.currency?.toUpperCase() || 'USD'}
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      {t.transactionId}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(t.paidAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-2">
          <CreditCard className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No transactions recorded yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Subscription upgrades from Stripe Checkout will be recorded here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
