"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";

const checklist = [
  "97% first-attempt pass rate",
  "Official test format questions",
  "AI-powered study guidance",
];

export function StatsHero() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-2xl border border-cm-slate-100/60 overflow-hidden bg-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Stats & Feature */}
            <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              {/* CTA button at top */}
              <motion.a
                href="/practice"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-xl bg-cm-teal text-white font-heading font-semibold text-sm hover:bg-cm-teal-dark transition-colors mb-10"
              >
                Discover More
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </motion.a>

              {/* Divider */}
              <div className="border-t border-dashed border-cm-slate-200 mb-10" />

              {/* Big stat + feature */}
              <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12">
                {/* Stat number */}
                <div>
                  <span className="font-heading text-6xl sm:text-7xl lg:text-[5rem] font-extrabold text-foreground leading-none tracking-tight">
                    10K+
                  </span>
                  <span className="block mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Students helped since 2024
                  </span>
                </div>

                {/* Feature block */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cm-teal/8 flex items-center justify-center shrink-0">
                    <Sparkles className="size-5 text-cm-teal" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[0.95rem]">
                      Study with Confidence
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      Our AI-powered platform adapts to your learning style,
                      helping you master every topic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Image with overlay */}
            <div className="relative min-h-[300px] lg:min-h-0">
              <Image
                src="/generated/hero-study.webp"
                alt="Students studying together for the Australian citizenship test"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Teal overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#004a50]/75 via-[#006d77]/70 to-[#008a93]/65" />

              {/* Content on overlay */}
              <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col justify-center h-full">
                {/* Badge */}
                <span className="inline-flex items-center self-start px-4 py-1.5 rounded-full bg-white/12 backdrop-blur-sm text-white text-xs font-semibold mb-6">
                  Proven Results
                </span>

                {/* Checklist */}
                <ul className="space-y-4">
                  {checklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg"
                    >
                      <CheckCircle2 className="size-5 sm:size-6 text-emerald-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA Bar — "Have a question?" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 rounded-2xl border border-cm-slate-100/60 bg-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
              Have a question?
            </h3>
            <p className="mt-1 text-muted-foreground text-[0.95rem]">
              We value your time, so we strive to provide fast and helpful
              support to all aspiring citizens.
            </p>
          </div>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cm-teal text-white font-heading font-semibold text-sm hover:bg-cm-teal-dark transition-colors shrink-0"
          >
            Get in Touch
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
