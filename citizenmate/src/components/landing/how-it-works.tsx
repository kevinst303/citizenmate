"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
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

const stepVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.2 * i,
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  }),
};

const numberPop = {
  hidden: { scale: 0, rotate: -45 },
  show: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.2 * i + 0.15,
      type: "spring" as const,
      stiffness: 300,
      damping: 12,
    },
  }),
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden bg-cm-navy-50/50">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 mix-blend-overlay opacity-30">
        <Image
          src="/generated/how-it-works-bg.webp"
          alt="Abstract serene Australian landscape background"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Simple as
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Four steps to citizenship
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            From first practice to test day — CitizenMate guides you the whole
            way.
          </motion.p>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Animated connecting line (desktop) */}
          <motion.div
            className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-cm-navy via-cm-red/40 to-cm-eucalyptus origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 0.25 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                custom={index}
                variants={stepVariant}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                className="flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-[72px] h-[72px] rounded-2xl bg-card border-2 border-cm-navy/15 flex items-center justify-center shadow-card cursor-default"
                  >
                    <step.icon className="size-8 text-cm-navy" />
                  </motion.div>
                  <motion.div
                    custom={index}
                    variants={numberPop}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cm-red text-white flex items-center justify-center text-xs font-heading font-bold"
                  >
                    {step.number}
                  </motion.div>
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
