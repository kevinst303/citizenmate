"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  requireTypedConfirm?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  requireTypedConfirm,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const canConfirm = requireTypedConfirm ? typed === requireTypedConfirm : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cm-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-cm-slate-400" />
        </button>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDanger ? "bg-cm-red-light text-cm-red" : "bg-amber-50 text-amber-600"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-heading font-bold text-cm-slate-900">{title}</h3>
            <p className="text-sm text-cm-slate-500 mt-1">{description}</p>
            {requireTypedConfirm && (
              <div className="mt-4">
                <p className="text-xs text-cm-slate-500 mb-1">
                  Type <strong className="text-cm-slate-700">{requireTypedConfirm}</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder={requireTypedConfirm}
                  className="w-full px-3 py-2 text-sm border border-cm-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cm-red/20 focus:border-cm-red"
                />
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-cm-slate-600 bg-cm-slate-100 rounded-xl hover:bg-cm-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!canConfirm}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDanger
                    ? "bg-cm-red hover:bg-cm-red-dark"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
