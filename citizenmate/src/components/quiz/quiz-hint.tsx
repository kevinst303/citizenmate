"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, Lock } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

const TOPIC_HINTS: Record<string, string[]> = {
  "australia-people": [
    "Think about Australia's population distribution — most Australians live near the coast.",
    "Consider Australia's Indigenous heritage and the diversity of its modern population.",
    "Remember: Australia is one of the world's most urbanised countries.",
  ],
  "democratic-beliefs": [
    "Focus on the core principles: freedom of speech, equality before the law, and the rule of law.",
    "Think about how power is shared between the people and their elected representatives.",
    "Consider what 'parliamentary democracy' means in practice.",
  ],
  "government-law": [
    "Remember the three levels of government: federal, state/territory, and local.",
    "The Constitution divides powers between the federal government and the states.",
    "Think about how laws are made — from bill to royal assent.",
  ],
  "australian-values": [
    "Australian values centre on respect, equality, freedom, and the rule of law.",
    "Think about what 'a fair go' means in Australian society.",
    "Consider the responsibilities that come with Australian citizenship.",
  ],
};

interface QuizHintProps {
  topic: string;
  premiumHintsRemaining: number;
  isPremium: boolean;
  onShowHint: () => void;
  onDismiss: () => void;
  visible: boolean;
  hintRevealed: boolean;
  currentHint: string;
}

export function QuizHint({
  topic,
  premiumHintsRemaining,
  isPremium,
  onShowHint,
  onDismiss,
  visible,
  hintRevealed,
  currentHint,
}: QuizHintProps) {
  const { t } = useT();

  const hintsForTopic = TOPIC_HINTS[topic] || [
    "Take your time — read each option carefully before choosing.",
    "Try to eliminate the answers you know are wrong first.",
    "Trust your knowledge — you've studied the material.",
  ];

  const noHintsLeft = !isPremium && premiumHintsRemaining <= 0;

  function getHint() {
    const idx = Math.floor(Math.random() * hintsForTopic.length);
    return hintsForTopic[idx];
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -12, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="overflow-hidden"
      >
        <div className="mt-4 p-4 rounded-[12px] bg-gradient-to-r from-cm-gold-light/30 via-amber-50 to-cm-gold-light/20 border border-amber-200/60">
          {!hintRevealed ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {t("quiz.hint_prompt", "Need a clue?")}
                  </p>
                  <p className="text-xs text-amber-600/70">
                    {noHintsLeft
                      ? t("quiz.hint_premium_gate", "Unlimited hints with Sprint Pass")
                      : isPremium
                        ? t("quiz.hint_unlimited", "Unlimited hints")
                        : t("quiz.hint_remaining", "{n} hint remaining").replace(
                            "{n}",
                            String(premiumHintsRemaining)
                          )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {noHintsLeft ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onDismiss}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium bg-cm-slate-100 text-cm-slate-500 hover:bg-cm-slate-200 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    {t("quiz.dismiss", "Dismiss")}
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onShowHint();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      {t("quiz.show_hint", "Show hint")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={onDismiss}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium bg-cm-slate-100 text-cm-slate-500 hover:bg-cm-slate-200 transition-colors cursor-pointer"
                    >
                      {t("quiz.dismiss", "Dismiss")}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-amber-100 flex items-center justify-center mt-0.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-800 mb-0.5">
                    {t("quiz.hint_revealed", "Here's a clue…")}
                  </p>
                  <p className="text-sm text-amber-700/80 leading-relaxed">
                    {currentHint || getHint()}
                  </p>
                  <button
                    onClick={onDismiss}
                    className="mt-2 text-xs font-medium text-amber-600 hover:text-amber-700 cursor-pointer transition-colors"
                  >
                    {t("quiz.hint_got_it", "Got it, thanks!")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
