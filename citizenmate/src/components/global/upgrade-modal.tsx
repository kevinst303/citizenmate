"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Star, AlertTriangle } from "lucide-react";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useT } from "@/i18n/i18n-context";

export function UpgradeModal() {
  const { isOpen, closeModal } = useUpgradeModal();
  const { startCheckout } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const { t } = useT();

  if (!isOpen) return null;

  const handleUpgrade = async (tier: string) => {
    setLoadingTier(tier);
    try {
      // Pass the chosen interval to startCheckout
      await startCheckout(tier.toLowerCase(), interval);
    } finally {
      setTimeout(() => setLoadingTier(null), 3000);
    }
  };

  const tiers = [
    {
      name: t("upgrade.pro_name", "Pro"),
      price: interval === 'month' ? "A$14.99" : "A$149.90",
      period: interval === 'month' ? "monthly" : "yearly",
      description: t("upgrade.pro_desc", "Perfect for pacing your study over a few months."),
      features: [
        t("upgrade.pro_feature_1", "All 15 mock tests"),
        t("upgrade.pro_feature_2", "Bilingual study mode"),
        t("upgrade.pro_feature_3", "500+ practice questions"),
        t("upgrade.pro_feature_4", "Standard support"),
      ],
      icon: <Star className="w-5 h-5 text-amber-500" />,
      popular: false,
    },
    {
      name: t("upgrade.premium_name", "Premium"),
      price: interval === 'month' ? "A$29.99" : "A$299.90",
      period: interval === 'month' ? "monthly" : "yearly",
      description: t("upgrade.premium_desc", "Everything you need to pass. Get full access to all premium features."),
      features: [
        t("upgrade.premium_feature_1", "All Pro features"),
        t("upgrade.premium_feature_2", "Unlimited AI tutor"),
        t("upgrade.premium_feature_3", "Readiness score & analytics"),
        t("upgrade.premium_feature_4", "Test-date study plan"),
        t("upgrade.premium_feature_5", "Ad-free experience"),
      ],
      icon: <Zap className="w-5 h-5 text-white" />,
      popular: true,
      badge: t("upgrade.most_popular", "Most Popular"),
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
          className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[15px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15),0_4px_12px_-6px_rgba(0,0,0,0.06)] overflow-hidden border border-[#E9ECEF] dark:border-neutral-800 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {t("upgrade.title", "Unlock Your Full Potential")}
              </h2>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                {t("upgrade.subtitle", "Choose the plan that fits your study timeline.")}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 self-end sm:self-auto bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full transition-colors order-first sm:order-last absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="px-6 pt-6 flex justify-center">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full inline-flex">
              <button
                onClick={() => setInterval('month')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  interval === 'month'
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval('year')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  interval === 'year'
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Yearly
                <span className="text-[10px] uppercase bg-cm-teal/20 text-cm-teal px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
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
                      : "border-[#E9ECEF] dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
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
                      ? t("upgrade.processing", "Processing...")
                      : tier.name === "Pro" ? t("upgrade.get_pro", "Get Pro") : t("upgrade.get_premium", "Get Premium")}
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
