"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import type { ConfirmDialog } from "./confirm-dialog";

interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  is_admin: boolean;
  tier: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  suspended: boolean | null;
  created_at: string;
}

interface UserEditModalProps {
  open: boolean;
  user: UserProfile | null;
  onSave: () => void;
  onClose: () => void;
}

const TIERS = ["free", "pro", "premium", "sprint_pass"] as const;

export function UserEditModal({ open, user, onSave, onClose }: UserEditModalProps) {
  const [form, setForm] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTyped, setDeleteTyped] = useState("");

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  useEffect(() => {
    if (!open) {
      setShowDeleteConfirm(false);
      setDeleteTyped("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || !form) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          is_admin: form.is_admin,
          tier: form.tier,
          is_premium: form.is_premium,
          premium_expires_at: form.premium_expires_at,
          suspended: form.suspended,
          display_name: form.display_name,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const setPremiumExpiryDate = (dateString: string) => {
    setForm({ ...form, premium_expires_at: dateString ? new Date(dateString).toISOString() : null });
  };

  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cm-slate-100">
          <div>
            <h3 className="text-lg font-heading font-bold text-cm-slate-900">Edit User</h3>
            <p className="text-sm text-cm-slate-500 mt-0.5 font-mono text-xs">{form.id.slice(0, 12)}...</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cm-slate-100 transition-colors">
            <X className="w-5 h-5 text-cm-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cm-slate-600 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={form.display_name || ""}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-cm-slate-600 uppercase tracking-wider">Email</label>
              <input
                type="text"
                value={form.email || ""}
                disabled
                className="w-full mt-1 px-3 py-2 text-sm border border-cm-slate-200 rounded-xl bg-cm-slate-50 text-cm-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cm-slate-600 uppercase tracking-wider">Role</label>
              <select
                value={form.is_admin ? "admin" : "user"}
                onChange={(e) => setForm({ ...form, is_admin: e.target.value === "admin" })}
                className="w-full mt-1 px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-cm-slate-600 uppercase tracking-wider">Tier</label>
              <select
                value={form.tier || "free"}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-cm-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-cm-slate-800">Premium Status</p>
              <p className="text-xs text-cm-slate-500">Grant or revoke premium access</p>
            </div>
            <button
              role="switch"
              aria-checked={form.is_premium}
              onClick={() => setForm({ ...form, is_premium: !form.is_premium })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.is_premium ? "bg-cm-teal" : "bg-cm-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  form.is_premium ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-cm-slate-600 uppercase tracking-wider">Premium Expiry</label>
            <input
              type="date"
              value={formatDateForInput(form.premium_expires_at)}
              onChange={(e) => setPremiumExpiryDate(e.target.value)}
              disabled={!form.is_premium}
              className="w-full mt-1 px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className={`flex items-center justify-between py-3 px-4 rounded-xl ${
            form.suspended ? "bg-cm-red-light" : "bg-cm-slate-50"
          }`}>
            <div>
              <p className={`text-sm font-medium ${form.suspended ? "text-cm-red" : "text-cm-slate-800"}`}>
                {form.suspended ? "User Suspended" : "Active Account"}
              </p>
              <p className="text-xs text-cm-slate-500">
                {form.suspended ? "This user cannot access the platform" : "User has full access"}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={!!form.suspended}
              onClick={() => setForm({ ...form, suspended: !form.suspended })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.suspended ? "bg-cm-red" : "bg-cm-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  form.suspended ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-cm-slate-100">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-cm-red hover:bg-cm-red-light rounded-xl transition-colors"
          >
            Delete User
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-cm-slate-600 bg-cm-slate-100 rounded-xl hover:bg-cm-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-cm-teal rounded-xl hover:bg-cm-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 pb-4">
            <p className="text-sm text-cm-red">{error}</p>
          </div>
        )}

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-cm-red-light text-cm-red flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-cm-slate-900 mb-2">Delete User</h3>
              <p className="text-sm text-cm-slate-500 mb-4">
                This will permanently delete this user and their account. This action cannot be undone.
              </p>
              <p className="text-xs text-cm-slate-500 mb-2">
                Type <strong className="text-cm-slate-700">DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteTyped}
                onChange={(e) => setDeleteTyped(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-red/20 focus:border-cm-red mb-4"
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteTyped(""); }}
                  className="px-4 py-2 text-sm font-medium text-cm-slate-600 bg-cm-slate-100 rounded-xl hover:bg-cm-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteTyped !== "DELETE" || saving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-cm-red rounded-xl hover:bg-cm-red-dark transition-colors disabled:opacity-40"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
