"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { mockTests } from "@/data/tests";
import { getAttemptHistory } from "@/lib/quiz-context";
import { useEffect, useState } from "react";
import type { QuizResult } from "@/lib/types";
import {
  FileText,
  Clock,
  Target,
  Heart,
  Award,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Flag,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function PracticePage() {
  const [attempts, setAttempts] = useState<
    Array<{ testId: string; result: QuizResult; completedAt: string }>
  >([]);

  useEffect(() => {
    setAttempts(getAttemptHistory());
  }, []);

  const getTestAttempts = (testId: string) =>
    attempts.filter((a) => a.testId === testId);

  const getBestScore = (testId: string) => {
    const testAttempts = getTestAttempts(testId);
    if (testAttempts.length === 0) return null;
    return Math.max(...testAttempts.map((a) => a.result.score));
  };

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Hero */}
      <section className="relative bg-cm-navy text-white overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/generated/test-start.webp"
            alt="Concentrating before a test"
            fill
            className="object-cover opacity-35 mix-blend-screen"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cm-ice to-transparent opacity-90" />
        </div>

        {/* Decorative orbs */}

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6"
            >
              <FileText className="w-4 h-4" />
              Practice Tests
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight mb-4">
              Practice for the{" "}
              <span className="text-cm-gold">Real Test</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
              20 questions. 45 minutes. Just like the real Australian citizenship
              test. See where you stand, mate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Test format info */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass-card rounded-2xl shadow-card p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: FileText, value: "20", label: "Questions" },
              { icon: Clock, value: "45 min", label: "Time Limit" },
              { icon: Target, value: "75%", label: "Pass Mark (15/20)" },
              { icon: Heart, value: "5/5", label: "Values Required" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.08 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy-50 text-cm-navy mb-2">
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <div className="text-2xl font-heading font-extrabold text-cm-navy">
                  {stat.value}
                </div>
                <div className="text-xs text-cm-slate-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Smart Practice CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/practice/smart"
            className="group relative block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-2xl shadow-lg shadow-purple-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 animate-shimmer" />
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              className="relative p-6 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300"
            >
              <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 text-white">
                <Brain className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-heading font-bold text-white">
                    Smart Practice
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered
                  </span>
                </div>
                <p className="text-sm text-white/75">
                  Questions ordered by your weak areas — powered by spaced
                  repetition. Instant feedback, no timer.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Test Cards */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-heading font-bold text-cm-slate-900 mb-8"
        >
          Choose a Practice Test
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-3"
        >
          {mockTests.map((test, index) => {
            const bestScore = getBestScore(test.id);
            const attemptCount = getTestAttempts(test.id).length;
            const testNumber = index + 1;

            return (
              <div key={test.id} className="h-full">
                <motion.div variants={item}
                  whileHover={{ y: -6, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.99 }}
                  className="h-full"
                >
                  <Link
                    href={`/practice/${test.id}`}
                    className="group flex flex-col h-full rounded-2xl card-glass p-6 shadow-card hover:shadow-card-hover hover:border-cm-navy transition-all duration-300 cursor-pointer"
                  >
                    {/* Test number badge */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.span
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-navy text-white font-heading font-bold text-lg"
                      >
                        {testNumber}
                      </motion.span>
                      {bestScore !== null && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            bestScore >= 15
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          Best: {bestScore}/20
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading font-bold text-cm-slate-900 mb-2 group-hover:text-cm-navy transition-colors duration-200">
                      {test.title}
                    </h3>
                    <p className="text-sm text-cm-slate-500 leading-relaxed mb-5">
                      {test.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-cm-slate-400 mb-5">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {test.totalQuestions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {test.timeLimit / 60} min
                      </span>
                      {attemptCount > 0 && (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {attemptCount}{" "}
                          {attemptCount === 1 ? "attempt" : "attempts"}
                        </span>
                      )}
                    </div>

                    {/* CTA — mt-auto pins it to bottom for equal-height alignment */}
                    <div className={`mt-auto flex items-center justify-center gap-2 w-full py-3 font-heading font-semibold rounded-xl transition-all duration-200 group-hover:gap-3 ${
                      attemptCount > 0
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white group-hover:from-teal-600 group-hover:to-emerald-600 shadow-sm"
                        : "bg-cm-navy text-white group-hover:bg-cm-navy-light"
                    }`}>
                      {attemptCount > 0 ? (
                        <>
                          <RefreshCw className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
                          Try Again
                        </>
                      ) : (
                        <>
                          Start Test
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </div>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Tips section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="bg-cm-navy-50 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-navy text-white">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-heading font-bold text-cm-navy">
              Tips for the Real Test
            </h3>
          </div>
          <ul className="space-y-3.5 text-sm text-cm-slate-600">
            {[
              {
                icon: Heart,
                text: (
                  <>
                    <strong>All 5 values questions</strong> must be answered
                    correctly — even if you score well on other sections. Pay
                    special attention to questions with the Values badge.
                  </>
                ),
              },
              {
                icon: Target,
                text: (
                  <>
                    You need <strong>at least 15 out of 20</strong> correct
                    overall (75%) to pass.
                  </>
                ),
              },
              {
                icon: Clock,
                text: (
                  <>
                    You have <strong>45 minutes</strong> — that&apos;s about 2
                    minutes per question. Don&apos;t rush, but don&apos;t dwell
                    on difficult questions.
                  </>
                ),
              },
              {
                icon: Flag,
                text: (
                  <>
                    <strong>Flag questions</strong> you&apos;re unsure about and
                    come back to them.
                  </>
                ),
              },
            ].map((tip, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-3 items-start"
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-cm-navy/10 text-cm-navy mt-0.5">
                  <tip.icon className="w-3.5 h-3.5" />
                </span>
                <span>{tip.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
