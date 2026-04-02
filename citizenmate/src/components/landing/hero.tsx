"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const trustedLogos = [
  "500+ Practice Questions",
  "Bilingual Study Mode",
  "Real Test Format",
  "AI-Powered Learning",
];

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image with Conseil-style overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/generated/hero-study.webp"
          alt="Diverse group of people studying together for the Australian citizenship test"
          fill
          priority
          className="object-cover"
        />
        {/* Teal gradient overlay like Conseil hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004a50]/80 via-[#00727a]/70 to-[#008a93]/60" />
        {/* Bottom fade for clean transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Star rating badge — Conseil style */}
          <motion.div variants={item} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="opacity-90">Top Rated Citizenship Test Prep</span>
            </div>
          </motion.div>

          {/* Heading — large, white, Manrope */}
          <motion.h1
            variants={item}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-white leading-[1.1] tracking-tight text-balance"
          >
            Pass your Australian Citizenship Test — guaranteed.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed"
          >
            Your mate for the journey. Study in your language. Practice with
            real test format questions. Know when you&apos;re ready with AI-powered analytics.
          </motion.p>

          {/* CTA row — Conseil style: avatar group + buttons */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            {/* Primary CTA — fully rounded like Conseil */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <a
                href="/practice"
                className="btn-rounded bg-white text-cm-teal font-heading font-bold text-base px-8 py-3.5 shadow-lg shadow-black/10 hover:bg-white/95"
              >
                Start Free Practice
                <ChevronRight className="size-4 ml-1" />
              </a>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <a
                href="#how-it-works"
                className="btn-rounded bg-transparent text-white border-2 border-white/30 font-heading font-semibold text-base px-8 py-3.5 hover:bg-white/10 hover:border-white/50"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Social proof stat — avatar group + text */}
          <motion.div
            variants={item}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-2.5">
              {[
                "from-teal-400 to-teal-600",
                "from-emerald-400 to-emerald-600",
                "from-sky-400 to-sky-600",
                "from-violet-400 to-violet-600",
                "from-orange-400 to-orange-600",
              ].map((gradient, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0 + i * 0.08, type: "spring", stiffness: 300, damping: 12 }}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-[2.5px] border-white/40`}
                />
              ))}
            </div>
            <div className="text-sm text-white/80">
              <span className="font-bold text-white">1 in 3</span> people fail the citizenship test.{" "}
              <span className="font-bold text-yellow-300">CitizenMate users don&apos;t.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trusted by bar — logos/features strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-white/95 backdrop-blur-sm border-t border-cm-slate-100/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 overflow-x-auto gap-8">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                Trusted by students across Australia
              </span>
              <div className="flex items-center gap-8">
                {trustedLogos.map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-cm-teal/60" />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
