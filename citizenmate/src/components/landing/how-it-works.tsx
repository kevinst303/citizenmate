"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Take a free diagnostic test",
    description: "Start with 10 quick questions to discover where you stand.",
  },
  {
    number: "02",
    title: "Study with your personalised plan",
    description: "Tailored study based on your gaps, in your language.",
  },
  {
    number: "03",
    title: "Practice until you're ready",
    description: "Full mock tests, progress tracking, and AI explanations.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[100px] section-alt-bg">
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
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance leading-tight"
          >
            Three steps to citizenship
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

        {/* Split-card — Conseil layout (HIOW-01) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 18 }}
          className="mx-auto max-w-[1140px]"
        >
          <div
            className="flex flex-col md:flex-row overflow-hidden border border-[#E9ECEF]"
            style={{
              borderRadius: "var(--radius-card, 24px)",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            {/* Left text panel */}
            <div
              className="flex-1 bg-[#F4F4F5] p-[40px] flex flex-col justify-center"
              style={{ borderRadius: "var(--radius-card, 24px) 0 0 var(--radius-card, 24px)" }}
            >
              <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-3">
                Everything you need to pass
              </h3>
              <p className="text-foreground/70 text-sm mb-6">
                Start with a diagnostic, study at your own pace with bilingual
                support, then take full mock tests until you're confident. No
                fluff — just the three steps that work.
              </p>
              <a href="/practice" className="btn-rounded-teal self-start">
                Start practising
              </a>
            </div>
            {/* Right image panel */}
            <div
              className="flex-1 relative min-h-[280px] md:min-h-[320px]"
              style={{ borderRadius: "0 var(--radius-card, 24px) var(--radius-card, 24px) 0" }}
            >
              <Image
                src="/images/conseil/feature-split.jpg"
                fill
                className="object-cover"
                alt="CitizenMate study interface"
              />
            </div>
          </div>
        </motion.div>

        {/* Simplified 3-step summary row */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="card-conseil"
            >
              <span className="text-cm-teal font-heading font-extrabold text-4xl opacity-20 leading-none">
                {step.number}
              </span>
              <h4 className="font-heading font-bold text-base mt-2 mb-2">
                {step.title}
              </h4>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
