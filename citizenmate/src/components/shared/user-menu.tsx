"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard, ChevronDown, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/i18n-context";

// ===== User Menu =====
// Navbar component that shows "Sign In" when logged out, avatar+dropdown when logged in.

export function UserMenu() {
  const { user, loading, openAuthModal, signOut, startCheckout } = useAuth();
  const { t } = useT();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [imageError, setImageError] = useState(false);

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
        className="px-4 py-2 bg-cm-teal text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-teal-dark transition-colors cursor-pointer"
      >
        {t("user_menu.sign_in")}
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
    
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        {avatarUrl && !imageError ? (
          <img 
            src={avatarUrl} 
            alt={displayName} 
            className="w-9 h-9 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow border border-cm-slate-200"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cm-teal to-cm-teal-dark flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg transition-shadow">
            {initials}
          </div>
        )}
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
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[15px] border border-[#E9ECEF] overflow-hidden z-50"
            style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px', borderRadius: '15px' }}
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
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-slate-700 hover:bg-cm-slate-50 transition-colors text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-cm-slate-400" />
                {t("user_menu.dashboard")}
              </button>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await startCheckout('premium', 'month');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-teal hover:bg-cm-teal-50 transition-colors cursor-pointer text-left"
              >
                <Crown className="w-4 h-4 text-cm-teal" />
                {t("user_menu.upgrade_to_premium")}
              </button>
              <button
                onClick={() => handleNavigation("/settings")}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-slate-700 hover:bg-cm-slate-50 transition-colors text-left"
              >
                <User className="w-4 h-4 text-cm-slate-400" />
                {t("user_menu.profile_settings")}
              </button>
            </div>

            {/* Sign out */}
            <div className="border-t border-cm-slate-100 py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-cm-red hover:bg-cm-red-light transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                {t("user_menu.sign_out")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
