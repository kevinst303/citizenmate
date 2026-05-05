"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  Copy,
  Check,
  XCircle,
  Ticket,
  AlertTriangle,
} from "lucide-react";
import type { PromoCode } from "./referral-dashboard";

// ===== Promo Codes Tab =====
// Lists all user promo codes with usage stats, search, and deactivation.

export function ReferralCodes() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/referrals/codes");
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      }
    } catch (err) {
      console.error("Failed to fetch codes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeactivate = async (code: string) => {
    setDeactivating(code);
    try {
      const res = await fetch("/api/admin/referrals/codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action: "deactivate" }),
      });

      if (res.ok) {
        setCodes((prev) => prev.filter((c) => c.code !== code));
      }
    } catch (err) {
      console.error("Failed to deactivate:", err);
    } finally {
      setDeactivating(null);
      setConfirmDeactivate(null);
    }
  };

  const filtered = codes.filter(
    (c) =>
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400" />
          <input
            type="text"
            placeholder="Search by code, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-cm-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cm-sky/20 focus:border-cm-sky transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-cm-slate-500">
          <Ticket className="w-4 h-4" />
          <span>
            <strong className="text-cm-navy">{codes.length}</strong> active codes
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-cm-slate-400" />
          <span className="ml-2 text-cm-slate-500 text-sm">Loading codes…</span>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border border-cm-slate-200 overflow-hidden card-conseil"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-cm-slate-600">
              <thead className="bg-cm-slate-50 border-b border-cm-slate-200 text-xs uppercase font-semibold text-cm-slate-500">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Promo Code</th>
                  <th className="px-5 py-3.5">Referred</th>
                  <th className="px-5 py-3.5">Qualified</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-cm-slate-400"
                    >
                      {search
                        ? "No codes match your search"
                        : "No promo codes generated yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((code) => (
                    <tr
                      key={code.code}
                      className="hover:bg-cm-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-cm-slate-800 text-sm">
                            {code.name}
                          </p>
                          <p className="text-xs text-cm-slate-400">
                            {code.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm font-bold text-cm-teal bg-cm-teal/5 px-2 py-1 rounded-md">
                            {code.code}
                          </code>
                          <button
                            onClick={() => handleCopy(code.code)}
                            className="p-1 rounded hover:bg-cm-slate-100 transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-cm-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium">
                        {code.totalReferred}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-medium ${
                            code.qualifiedReferred > 0
                              ? "text-cm-eucalyptus"
                              : "text-cm-slate-400"
                          }`}
                        >
                          {code.qualifiedReferred}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        {new Date(code.createdAt).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {confirmDeactivate === code.code ? (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Sure?
                            </span>
                            <button
                              onClick={() => handleDeactivate(code.code)}
                              disabled={deactivating === code.code}
                              className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            >
                              {deactivating === code.code ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDeactivate(null)}
                              className="text-xs font-medium text-cm-slate-400 hover:text-cm-slate-600 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeactivate(code.code)}
                            className="flex items-center gap-1 text-xs font-medium text-cm-slate-400 hover:text-red-500 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
