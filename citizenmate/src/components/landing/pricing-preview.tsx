"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Zap, Loader2, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/i18n-context";

export function PricingPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { startCheckout, profile: premium } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { t } = useT();

  const plans = [
    {
      name: t("landing.pricing_free_name", "Free"),
      price: "A$0",
      period: t("landing.pricing_free_period", "forever"),
      description: t("landing.pricing_free_desc", "Try CitizenMate and see where you stand."),
      cta: t("landing.pricing_free_cta", "Start Free"),
      popular: false,
      features: [
        { text: t("landing.pricing_free_f1", "1 full mock test + results"), included: true },
        { text: t("landing.pricing_free_f2", "Basic study content (1 chapter)"), included: true },
        { text: t("landing.pricing_free_f3", "3 AI tutor questions per day"), included: true },
        { text: t("landing.pricing_free_f4", "20 practice questions"), included: true },
        { text: t("landing.pricing_free_f5", "All 15 mock tests"), included: false },
        { text: t("landing.pricing_free_f6", "Full bilingual study mode"), included: false },
        { text: t("landing.pricing_free_f7", "Unlimited AI tutor"), included: false },
        { text: t("landing.pricing_free_f8", "Readiness score & analytics"), included: false },
      ],
    },
    {
      name: t("landing.pricing_sprint_name", "Exam Sprint Pass"),
      price: "A$29.99",
      period: t("landing.pricing_sprint_period", "60 days"),
      description: t("landing.pricing_sprint_desc", "Everything you need to pass — designed for your study window."),
      cta: t("landing.pricing_sprint_cta", "Get Sprint Pass"),
      popular: true,
      badge: t("landing.pricing_most_popular", "Most Popular"),
      features: [
        { text: t("landing.pricing_sprint_f1", "All 15 mock tests + unlimited retakes"), included: true },
        { text: t("landing.pricing_sprint_f2", "Complete bilingual study mode"), included: true },
        { text: t("landing.pricing_sprint_f3", "Unlimited AI tutor explanations"), included: true },
        { text: t("landing.pricing_sprint_f4", "500+ practice questions"), included: true },
        { text: t("landing.pricing_sprint_f5", "Readiness score & analytics"), included: true },
        { text: t("landing.pricing_sprint_f6", "Spaced repetition system"), included: true },
        { text: t("landing.pricing_sprint_f7", "Test-date study plan"), included: true },
        { text: t("landing.pricing_sprint_f8", "Ad-free experience"), included: true },
      ],
    },
  ];

  const handleGetSprintPass = async () => {
    setCheckoutLoading(true);
    try {
      await startCheckout();
    } finally {
      setTimeout(() => setCheckoutLoading(false), 3000);
    }
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 section-alt-bg">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        {/* Section header — Conseil style */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <span className="badge-pill badge-pill-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
              {t("landing.pricing_badge", "Simple Pricing")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            {t("landing.pricing_title", "Start free, upgrade when you&apos;re ready")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            {t("landing.pricing_desc", "Most users pass within 60 days. One payment, no subscriptions, no surprises.")}
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 * index,
                type: "spring",
                stiffness: 100,
                damping: 16,
              }}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="relative"
            >
              {/* Popular badge */}
              {plan.popular && plan.badge && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 12,
                  }}
                >
                  <span className="badge-pill-dark text-white text-xs px-4 py-1.5 rounded-full font-semibold inline-flex items-center gap-1.5"
                    style={{ background: '#00727a' }}
                  >
                    <Zap className="size-3" />
                    {plan.badge}
                  </span>
                </motion.div>
              )}

              <div
                className={`h-full p-8 transition-all duration-300 ${
                  plan.popular
                    ? "card-conseil-popular"
                    : "card-conseil"
                }`}
              >
                <div className="mb-6">
                  <h3 className={`font-heading text-xl font-bold ${plan.popular ? 'text-white' : ''}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{
                        delay: 0.3 + 0.2 * index,
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                      }}
                      className={`font-heading text-4xl font-extrabold ${plan.popular ? 'text-white' : ''}`}
                    >
                      {plan.price}
                    </motion.span>
                    <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
                      / {plan.period}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* CTA button — fully rounded */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {plan.popular ? (
                    <Button
                      variant="default"
                      disabled={checkoutLoading || premium.isPremium}
                      onClick={handleGetSprintPass}
                      className={`w-full h-12 rounded-full font-heading font-bold transition-all duration-200 ${
                        premium.isPremium
                          ? "bg-cm-eucalyptus hover:bg-cm-eucalyptus text-white cursor-default"
                          : "bg-white text-cm-teal hover:bg-white/95 shadow-lg shadow-black/10 cursor-pointer"
                      }`}
                    >
                      {premium.isPremium ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {t("landing.pricing_already_have", "You have Sprint Pass ✓")}
                        </>
                      ) : checkoutLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("landing.pricing_redirecting", "Redirecting to checkout...")}
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      render={<a href="/practice" />}
                      variant="outline"
                      className="w-full h-12 text-sm font-bold"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </motion.div>

                {/* Feature list */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.4 + 0.05 * fIdx + 0.2 * index,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check className={`size-5 shrink-0 mt-0.5 ${plan.popular ? 'text-white/90' : 'text-cm-teal'}`} />
                      ) : (
                        <X className={`size-5 shrink-0 mt-0.5 ${plan.popular ? 'text-white/30' : 'text-cm-slate-200'}`} />
                      )}
                      <span
                        className={`text-sm ${
                          plan.popular
                            ? feature.included ? 'text-white/90' : 'text-white/40'
                            : feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="size-4 text-cm-teal" />
            <span>{t("landing.pricing_trust", "One-time payment · No recurring charges · 60 days of full access")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
