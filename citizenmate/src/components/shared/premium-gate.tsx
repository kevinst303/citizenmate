"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { usePremium } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

// ===== Premium Gate =====
// Shows a lock overlay when the user doesn't have premium access.
// Use this to wrap any premium-only content.

interface PremiumGateProps {
  children: React.ReactNode;
  /** What feature is being gated — shown in the upgrade prompt */
  feature?: string;
  /** Visual style: 'overlay' blurs content behind, 'block' replaces content entirely */
  variant?: "overlay" | "block";
  /** If true, shows a subtle lock badge instead of a full gate (for cards/links) */
  badge?: boolean;
}

export function PremiumGate({
  children,
  feature = "this feature",
  variant = "overlay",
  badge = false,
}: PremiumGateProps) {
  const { isPremium, premiumLoading, upgrade } = usePremium();

  // While loading, show children normally (avoids flash)
  if (premiumLoading || isPremium) {
    return <>{children}</>;
  }

  // Badge mode: show children with a small lock icon overlay
  if (badge) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-cm-navy/5 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
          <motion.button
            onClick={upgrade}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cm-red text-white text-sm font-heading font-semibold rounded-full shadow-lg shadow-cm-red/20 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Unlock with Sprint Pass
          </motion.button>
        </div>
      </div>
    );
  }

  // Block mode: full replacement
  if (variant === "block") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-cm-navy-50 via-white to-cm-gold-light border border-cm-slate-200"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cm-red/10 text-cm-red mb-5">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-heading font-bold text-cm-navy mb-2">
          Unlock {feature}
        </h3>
        <p className="text-sm text-cm-slate-500 max-w-sm mb-6">
          Get the Exam Sprint Pass for 90 days of full access — unlimited tests,
          AI tutoring, bilingual study mode, and more.
        </p>
        <Button
          onClick={upgrade}
          className="bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cm-red/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Get Sprint Pass — A$29.99
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-xs text-cm-slate-400 mt-3">
          One-time payment · 90 days access · No subscription
        </p>
      </motion.div>
    );
  }

  // Overlay mode: blur content + show upgrade prompt
  return (
    <div className="relative">
      <div className="blur-sm opacity-50 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-sm mx-4"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-red/10 text-cm-red mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-bold text-cm-navy mb-2">
            Premium Feature
          </h3>
          <p className="text-sm text-cm-slate-500 mb-5">
            Upgrade to access {feature} and pass your citizenship test with
            confidence.
          </p>
          <Button
            onClick={upgrade}
            className="w-full bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold py-3 rounded-xl shadow-lg shadow-cm-red/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Sprint Pass — A$29.99
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ===== Premium Badge (for test cards, topic cards) =====
// Small inline badge indicating premium-only content

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cm-red/10 text-cm-red text-xs font-semibold">
      <Lock className="w-3 h-3" />
      Premium
    </span>
  );
}
