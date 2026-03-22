"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

const trustBadges = [
  "500+ practice questions",
  "Bilingual study mode",
  "Real test format",
  "Free to start",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background — Australian flag-inspired blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cm-navy/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cm-red/6 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cm-sky/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        {/* Southern Cross star accents */}
        <div className="absolute top-[15%] right-[20%] w-2 h-2 bg-cm-navy/30 rounded-full animate-star" />
        <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 bg-cm-navy/25 rounded-full animate-star [animation-delay:0.5s]" />
        <div className="absolute top-[35%] right-[18%] w-2.5 h-2.5 bg-cm-navy/20 rounded-full animate-star [animation-delay:1s]" />
        <div className="absolute top-[20%] right-[15%] w-1 h-1 bg-cm-navy/35 rounded-full animate-star [animation-delay:1.5s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cm-navy/8 text-cm-navy text-sm font-medium mb-8 border border-cm-navy/10">
              <Sparkles className="size-4" />
              <span>AI-powered citizenship test prep</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]"
          >
            Pass your Australian{" "}
            <span className="text-gradient-aussie">Citizenship Test</span>{" "}
            — guaranteed.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Your mate for the journey. Study in your language. Practice with AI.
            Know when you&apos;re ready.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              className="bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold text-base px-8 h-13 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cm-red/20"
            >
              Start Free Practice
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center font-heading font-medium text-base px-8 h-13 rounded-xl cursor-pointer border border-cm-navy/20 text-cm-navy hover:bg-cm-navy-50 transition-all duration-200"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="size-4 text-cm-eucalyptus" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>

          {/* Social proof stat */}
          <motion.div
            variants={item}
            className="mt-16 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-cm-navy to-cm-navy-lighter border-2 border-white"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">1 in 3</span>{" "}
              people fail the citizenship test.{" "}
              <span className="font-semibold text-cm-eucalyptus">
                CitizenMate users don&apos;t.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
