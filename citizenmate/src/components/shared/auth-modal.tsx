"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/lib/toast";

// ===== Auth Modal =====
// Sign in / Sign up modal with email+password and Google OAuth.

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, signInWithGoogle } =
    useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams?.get("redirect");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const switchMode = () => {
    setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "sign-in") {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          setError(authError.message);
          toast.error("Sign-in failed", authError.message);
        } else {
          toast.success("Welcome back, mate! 🇦🇺", "Your progress is synced.");
          if (redirectPath) {
            router.push(redirectPath);
          }
        }
      } else {
        const { error: authError } = await signUp(email, password);
        if (authError) {
          setError(authError.message);
          toast.error("Sign-up failed", authError.message);
        } else {
          setSuccessMessage(
            "Check your email to confirm your account, mate! 📧"
          );
          toast.info("Check your email! 📧", "Confirm your account to get started.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong", "Please try again, mate.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await signInWithGoogle(redirectPath || undefined);
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
      // Don't set loading false — Google redirects away
    } catch {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md bg-white rounded-[15px] overflow-hidden border border-[#E9ECEF]"
              style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-cm-teal px-6 pt-8 pb-6 text-white text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 className="text-2xl font-heading font-bold">
                  {mode === "sign-in" ? "Welcome back, mate!" : "Join CitizenMate"}
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  {mode === "sign-in"
                    ? "Sign in to sync your progress across devices"
                    : "Create an account to save your progress"}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Google button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-cm-slate-200 rounded-xl font-semibold text-sm text-cm-slate-700 hover:bg-cm-slate-50 hover:border-cm-slate-300 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cm-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-cm-slate-500">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400" />
                    <input
                      type="email"
                      aria-label="Email address"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-cm-slate-200 rounded-xl text-sm text-cm-slate-800 placeholder:text-cm-slate-400 focus:outline-none focus:border-cm-teal focus:ring-1 focus:ring-cm-teal/30 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400" />
                    <input
                      type="password"
                      aria-label="Password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 border-2 border-cm-slate-200 rounded-xl text-sm text-cm-slate-800 placeholder:text-cm-slate-400 focus:outline-none focus:border-cm-teal focus:ring-1 focus:ring-cm-teal/30 transition-colors"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-3 py-2 bg-cm-red-light rounded-lg text-sm text-cm-red"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* Success */}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-2 bg-cm-eucalyptus-light rounded-lg text-sm text-cm-eucalyptus"
                    >
                      {successMessage}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cm-teal text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-teal-light disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mode === "sign-in" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                {/* Switch mode */}
                <p className="text-center text-sm text-cm-slate-500 mt-4">
                  {mode === "sign-in"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={switchMode}
                    className="text-cm-teal font-semibold hover:underline cursor-pointer"
                  >
                    {mode === "sign-in" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
