"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// ===== User Menu =====
// Navbar component that shows "Sign In" when logged out, avatar+dropdown when logged in.

export function UserMenu() {
  const { user, loading, openAuthModal, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-cm-slate-200 animate-pulse" />
    );
  }

  // Signed out — show Sign In button
  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="px-4 py-2 bg-cm-navy text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-navy-light transition-colors cursor-pointer"
      >
        Sign In
      </button>
    );
  }

  // Signed in — show avatar + dropdown
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cm-navy to-cm-navy-light flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg transition-shadow">
          {initials}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-cm-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-cm-slate-200 overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-cm-slate-100">
              <p className="text-sm font-semibold text-cm-slate-800 truncate">
                {displayName}
              </p>
              <p className="text-xs text-cm-slate-400 truncate">
                {user.email}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-cm-slate-700 hover:bg-cm-slate-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-cm-slate-400" />
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ userId: user?.id, email: user?.email }) });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-blue hover:bg-cm-blue-50 transition-colors cursor-pointer text-left"
              >
                Upgrade to Premium
              </button>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-cm-slate-700 hover:bg-cm-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-cm-slate-400" />
                Profile
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-cm-slate-100 py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-red hover:bg-cm-red-light transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
