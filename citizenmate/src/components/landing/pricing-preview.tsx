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

export function PricingPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-cm-navy-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3">
            Simple pricing
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Start free, upgrade when you&apos;re ready
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most users pass with the 60-day Sprint Pass. No long-term
            commitments needed.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * index }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-cm-red text-white border-0 px-4 py-1 font-heading text-xs">
                    <Zap className="size-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <div
                className={`h-full p-8 rounded-2xl bg-card border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-cm-red shadow-xl shadow-cm-red/8"
                    : "border-border hover:border-cm-slate-200"
                }`}
              >
                <div className="mb-6">
                  <h3 className="font-heading text-xl font-semibold">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full h-12 rounded-xl font-heading font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Button>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="size-5 text-cm-eucalyptus shrink-0 mt-0.5" />
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
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sub note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Also available: $9.99/month or $49.99/year subscription.{" "}
          <span className="text-cm-navy font-medium cursor-pointer hover:underline">
            Compare all plans
          </span>
        </p>
      </div>
    </section>
  );
}
