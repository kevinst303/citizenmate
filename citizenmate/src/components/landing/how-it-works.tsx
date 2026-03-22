"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, PieChart, BookOpen, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Take a free diagnostic",
    description: "10 quick questions to see where you stand right now.",
    number: 1,
  },
  {
    icon: PieChart,
    title: "See your readiness gaps",
    description: "Know exactly which topics need more study.",
    number: 2,
  },
  {
    icon: BookOpen,
    title: "Study your personalised plan",
    description: "Focused content anchored to your test date.",
    number: 3,
  },
  {
    icon: CheckCircle2,
    title: "Pass with confidence",
    description: "Walk into the test knowing you're ready, mate.",
    number: 4,
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-cm-navy-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3">
            Simple as
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Four steps to citizenship
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From first practice to test day — CitizenMate guides you the whole
            way.
          </p>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-cm-navy via-cm-red/40 to-cm-eucalyptus opacity-25" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                className="flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div className="relative mb-6">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-card border-2 border-cm-navy/15 flex items-center justify-center shadow-sm">
                    <step.icon className="size-8 text-cm-navy" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cm-red text-white flex items-center justify-center text-xs font-heading font-bold">
                    {step.number}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
