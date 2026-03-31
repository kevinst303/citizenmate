"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try CitizenMate and see where you stand.",
    cta: "Start Free",
    ctaStyle:
      "border-cm-slate-200 hover:bg-muted text-foreground cursor-pointer",
    features: [
      { text: "1 full mock test + results", included: true },
      { text: "Basic Australian Values content", included: true },
      { text: "3 AI tutor questions per day", included: true },
      { text: "Topic mastery overview", included: true },
      { text: "Full question bank (500+)", included: false },
      { text: "Bilingual study mode", included: false },
      { text: "Unlimited AI tutor", included: false },
      { text: "Test-date study plan", included: false },
    ],
    popular: false,
  },
  {
    name: "Exam Sprint Pass",
    price: "$29.99",
    period: "60 days",
    description: "Everything you need to pass — designed for your study window.",
    cta: "Get Sprint Pass",
    ctaStyle:
      "bg-cm-red hover:bg-cm-red-dark text-white shadow-lg shadow-cm-red/20 cursor-pointer",
    features: [
      { text: "All 500+ practice questions", included: true },
      { text: "Complete bilingual study mode", included: true },
      { text: "Unlimited AI tutor explanations", included: true },
      { text: "Readiness score & analytics", included: true },
      { text: "Spaced repetition system", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Test-date study plan", included: true },
      { text: "Topic-by-topic mastery tracking", included: true },
    ],
    popular: true,
  },
];

const featureItem = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * i,
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  }),
};

export function PricingPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-cm-navy-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Simple pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Start free, upgrade when you&apos;re ready
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Most users pass with the 60-day Sprint Pass. No long-term
            commitments needed.
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
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.2 * index,
                type: "spring",
                stiffness: 100,
                damping: 14,
              }}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="relative"
            >
              {plan.popular && (
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
                  <Badge className="bg-cm-red text-white border-0 px-4 py-1 font-heading text-xs animate-cta-glow">
                    <Zap className="size-3 mr-1" />
                    Most Popular
                  </Badge>
                </motion.div>
              )}
              <div
                className={`h-full p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "glass-pricing-popular action-card-shine shadow-xl shadow-cm-red/8"
                    : "card-glass hover:border-cm-slate-200"
                }`}
              >
                <div className="mb-6">
                  <h3 className="font-heading text-xl font-semibold">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    {/* Price spring pop */}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{
                        delay: 0.3 + 0.2 * index,
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                      }}
                      className="font-heading text-4xl font-bold"
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-muted-foreground text-sm">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full h-12 rounded-xl font-heading font-semibold transition-colors duration-200 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>

                {/* Staggered feature list */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <motion.div
                      key={feature.text}
                      custom={fIdx}
                      variants={featureItem}
                      initial="hidden"
                      animate={isInView ? "show" : "hidden"}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{
                            delay: 0.4 + 0.05 * fIdx + 0.2 * index,
                            type: "spring",
                            stiffness: 400,
                            damping: 12,
                          }}
                        >
                          <Check className="size-5 text-cm-eucalyptus shrink-0 mt-0.5" />
                        </motion.div>
                      ) : (
                        <X className="size-5 text-cm-slate-200 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground"
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

        {/* Sub note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Also available: $9.99/month or $49.99/year subscription.{" "}
          <span className="text-cm-navy font-medium cursor-pointer hover:underline">
            Compare all plans
          </span>
        </motion.p>
      </div>
    </section>
  );
}
