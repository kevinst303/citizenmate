"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Star } from "lucide-react";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export function UpgradeModal() {
  const { isOpen, closeModal } = useUpgradeModal();
  const { startCheckout } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: string) => {
    setLoadingTier(tier);
    try {
      // In a real implementation, you would pass the tier to startCheckout
      // await startCheckout(tier);
      await startCheckout();
    } finally {
      setTimeout(() => setLoadingTier(null), 3000);
    }
  };

  const tiers = [
    {
      name: "Pro",
      price: "A$14.99",
      period: "monthly",
      description: "Perfect for pacing your study over a few months.",
      features: [
        "All 15 mock tests",
        "Bilingual study mode",
        "500+ practice questions",
        "Standard support",
      ],
      icon: <Star className="w-5 h-5 text-amber-500" />,
      popular: false,
    },
    {
      name: "Premium",
      price: "A$29.99",
      period: "60 days",
      description: "Everything you need to pass in one go. No subscriptions.",
      features: [
        "All Pro features",
        "Unlimited AI tutor",
        "Readiness score & analytics",
        "Test-date study plan",
        "Ad-free experience",
      ],
      icon: <Zap className="w-5 h-5 text-white" />,
      popular: true,
      badge: "Most Popular",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Unlock Your Full Potential
              </h2>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Choose the plan that fits your study timeline.
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-200 ${
                    tier.popular
                      ? "border-cm-teal bg-cm-teal/5 dark:bg-cm-teal/10"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  {tier.popular && tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cm-teal text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      {tier.icon}
                      {tier.badge}
                    </div>
                  )}

                  <div className="mb-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {!tier.popular && tier.icon}
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {tier.name}
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">
                        {tier.price}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        / {tier.period}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-cm-teal shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleUpgrade(tier.name)}
                    disabled={loadingTier !== null}
                    className={`w-full py-6 rounded-xl font-bold text-base transition-all ${
                      tier.popular
                        ? "bg-cm-teal hover:bg-cm-teal/90 text-white shadow-lg shadow-cm-teal/20"
                        : "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black"
                    }`}
                  >
                    {loadingTier === tier.name
                      ? "Processing..."
                      : `Get ${tier.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
