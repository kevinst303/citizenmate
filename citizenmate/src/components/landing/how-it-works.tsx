"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ClipboardList, PieChart, BookOpen, CheckCircle2, ArrowRight, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Take a free diagnostic test",
    description:
      "Start with 10 quick questions to discover where you stand. No sign-up required — see your baseline readiness score instantly.",
    image: "/generated/feature-tests.webp",
    imageAlt: "Student taking a diagnostic test on their laptop",
    features: ["10 quick questions", "Instant results", "No account needed"],
    imageRight: false,
  },
  {
    number: "02",
    title: "Study with your personalised plan",
    description:
      "Get a tailored study plan based on your gaps. Study the official Our Common Bond content in English alongside your native language.",
    image: "/generated/feature-bilingual.webp",
    imageAlt: "Bilingual study interface showing content in two languages",
    features: ["Bilingual content", "15+ languages", "Official materials"],
    imageRight: true,
  },
  {
    number: "03",
    title: "Practice until you're ready",
    description:
      "Take full mock tests in the real exam format. Track your progress topic by topic and watch your readiness score climb.",
    image: "/generated/feature-progress.webp",
    imageAlt: "Dashboard showing progress tracking and readiness score",
    features: ["Real test format", "Progress tracking", "AI explanations"],
    imageRight: false,
  },
];

const zigzagVariant = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 16 },
  },
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="py-24 sm:py-32 section-alt-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — Conseil style */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <span className="badge-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
              How It Works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            Four steps to citizenship
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            From first practice to test day — CitizenMate guides you the whole
            way.
          </motion.p>
        </div>

        {/* Zig-zag steps — Conseil alternating layout */}
        <div ref={ref} className="space-y-20 lg:space-y-28">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={zigzagVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className={`flex flex-col ${
                step.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12 lg:gap-16`}
            >
              {/* Text side */}
              <div className="flex-1 max-w-lg">
                <span className="text-cm-teal font-heading font-extrabold text-6xl lg:text-7xl opacity-15 leading-none">
                  {step.number}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-[1.05rem] leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Feature pills — Conseil checklist style */}
                <div className="flex flex-wrap gap-3">
                  {step.features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cm-slate-100 text-sm font-medium text-foreground"
                    >
                      <Check className="size-3.5 text-cm-teal" />
                      {feat}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.a
                  href="/practice"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 mt-8 text-cm-teal font-heading font-semibold text-[0.95rem] hover:text-cm-teal-dark transition-colors"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </motion.a>
              </div>

              {/* Image side — Conseil rounded image with shadow */}
              <div className="flex-1 w-full max-w-lg">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat — Conseil large number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex flex-col items-center px-12 py-8 rounded-2xl bg-white border border-cm-slate-100">
            <span className="font-heading text-5xl sm:text-6xl font-extrabold text-cm-teal">
              97%
            </span>
            <span className="mt-2 text-muted-foreground font-medium text-sm">
              of our users pass their citizenship test on the first attempt
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
