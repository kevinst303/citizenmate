"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/i18n-context";

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
    headline: "referral.cta_smashed_headline",
    subtext: "referral.cta_smashed_subtext",
    cta: "referral.cta_smashed_button",
  },
  readiness_jump: {
    emoji: "📈",
    headline: "referral.cta_climbing_headline",
    subtext: "referral.cta_climbing_subtext",
    cta: "referral.cta_climbing_button",
  },
  first_quiz: {
    emoji: "✅",
    headline: "referral.cta_first_quiz_headline",
    subtext: "referral.cta_first_quiz_subtext",
    cta: "referral.cta_first_quiz_button",
  },
  study_milestone: {
    emoji: "📚",
    headline: "referral.cta_progress_headline",
    subtext: "referral.cta_progress_subtext",
    cta: "referral.cta_progress_button",
  },
};

export function ReferralCTA({ trigger, score, onDismiss }: ReferralCTAProps) {
  const { t } = useT();
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
      ? t("referral.cta_share_template").replace("{code}", promoCode).replace("{url}", link)
      : t("referral.cta_share_template").replace("{code}", "").replace("{url}", link);

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("referral.cta_share_title"),
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
            aria-label={t("referral.cta_dismiss")}
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
                {t(content.headline)}
                {score !== undefined && score >= 80 && (
                  <span className="ml-1.5 text-cm-gold">
                    <Sparkles className="w-4 h-4 inline" />
                  </span>
                )}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(content.subtext)}
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
                  {t(content.cta)}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("referral.cta_maybe_later")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
