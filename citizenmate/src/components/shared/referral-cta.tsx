"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

// ===== Referral CTA =====
// Contextual referral prompt that appears at high-emotion moments:
// - After completing a mock test
// - After a readiness score improvement
// - After first quiz completion
//
// Props:
//   trigger: The event that triggered this CTA
//   variant: Visual style variant

type TriggerType = "mock_complete" | "readiness_jump" | "first_quiz" | "study_milestone";

interface ReferralCTAProps {
  trigger: TriggerType;
  /** Score percentage (0-100), used for mock_complete and readiness_jump */
  score?: number;
  onDismiss?: () => void;
}

const TRIGGER_CONTENT: Record<
  TriggerType,
  {
    emoji: string;
    headline: string;
    subtext: string;
    cta: string;
  }
> = {
  mock_complete: {
    emoji: "🎉",
    headline: "Smashed it! Know someone else preparing?",
    subtext:
      "Share your code and they'll get 20% off their Sprint Pass — plus you earn 7 bonus days!",
    cta: "Share with a mate",
  },
  readiness_jump: {
    emoji: "📈",
    headline: "Your readiness is climbing! Help a mate start theirs.",
    subtext:
      "Refer a friend — they get 20% off, you get 7 extra premium days. Everyone wins.",
    cta: "Invite a mate",
  },
  first_quiz: {
    emoji: "✅",
    headline: "First quiz done — nice one!",
    subtext:
      "Know someone else preparing for the citizenship test? Share your code for 20% off their Sprint Pass.",
    cta: "Share your code",
  },
  study_milestone: {
    emoji: "📚",
    headline: "Great progress! Studying with a mate helps.",
    subtext:
      "Invite a friend to CitizenMate — they save 20% and you earn bonus premium days.",
    cta: "Help a mate",
  },
};

export function ReferralCTA({ trigger, score, onDismiss }: ReferralCTAProps) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // Fetch promo code
  useEffect(() => {
    if (!user) return;

    // Check if this CTA was recently dismissed (24h cooldown)
    const lastDismissed = localStorage.getItem(`referral_cta_dismissed_${trigger}`);
    if (lastDismissed) {
      const hoursSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        setDismissed(true);
        return;
      }
    }

    // Delay appearance for impact (show after the success animation)
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    // Fetch promo code
    fetch("/api/referral")
      .then((res) => res.json())
      .then((data) => {
        if (data.promoCode) setPromoCode(data.promoCode);
      })
      .catch(() => {});

    return () => clearTimeout(timer);
  }, [user, trigger]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(`referral_cta_dismissed_${trigger}`, Date.now().toString());
    setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 300);
  };

  const handleShare = async () => {
    // Generate code if needed
    if (!promoCode) {
      try {
        const res = await fetch("/api/referral", { method: "POST" });
        const data = await res.json();
        if (data.promoCode) setPromoCode(data.promoCode);
      } catch {
        // Continue without code
      }
    }

    const link = `${window.location.origin}/?ref=${user?.id}`;
    const message = promoCode
      ? `I'm using CitizenMate to study for the Australian citizenship test. Use my code ${promoCode} for 20% off! 🇦🇺 ${link}`
      : `I'm using CitizenMate to study for the Australian citizenship test. Check it out! ${link}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CitizenMate",
          text: message,
          url: link,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(message);
    }
  };

  if (!user || dismissed) return null;

  const content = TRIGGER_CONTENT[trigger];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative overflow-hidden rounded-xl border border-cm-teal/20 bg-gradient-to-r from-cm-teal/5 via-cm-ocean/5 to-cm-gold/5 p-5 shadow-sm"
        >
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4">
            {/* Emoji/Icon */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-cm-teal/10 flex items-center justify-center text-2xl">
              {content.emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <h4 className="font-heading font-bold text-foreground text-sm sm:text-base pr-6">
                {content.headline}
                {score !== undefined && score >= 80 && (
                  <span className="ml-1.5 text-cm-gold">
                    <Sparkles className="w-4 h-4 inline" />
                  </span>
                )}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.subtext}
              </p>

              {/* Promo code preview */}
              {promoCode && (
                <div className="inline-flex items-center gap-2 bg-background border border-dashed border-cm-teal/30 rounded-lg px-3 py-1.5">
                  <Gift className="w-3.5 h-3.5 text-cm-teal" />
                  <span className="font-mono text-sm font-bold text-cm-teal tracking-wider">
                    {promoCode}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleShare}
                  className="bg-cm-teal hover:bg-cm-teal/90 text-white rounded-full px-4"
                >
                  {content.cta}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
