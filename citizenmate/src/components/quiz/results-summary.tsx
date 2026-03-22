"use client";

import { motion } from "framer-motion";
import type { QuizResult } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import type { TopicCategory } from "@/lib/types";
import {
  Trophy,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  PartyPopper,
  Flame,
  Globe,
  Scale,
  Landmark,
} from "lucide-react";

const TOPIC_ICON_COMPONENTS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

interface ResultsSummaryProps {
  result: QuizResult;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function ResultsSummary({ result }: ResultsSummaryProps) {
  const percentage = Math.round(
    (result.score / result.totalQuestions) * 100
  );
  const timeMinutes = Math.floor(result.timeUsed / 60);
  const timeSeconds = result.timeUsed % 60;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Pass/Fail Hero */}
      <motion.div
        variants={item}
        className={`
          relative text-center p-8 sm:p-12 rounded-2xl overflow-hidden
          ${
            result.passed
              ? "bg-gradient-to-br from-emerald-50 via-cm-eucalyptus-light to-emerald-50"
              : "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50"
          }
        `}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-8 left-12 w-24 h-24 rounded-full border-4 border-current" />
          <div className="absolute bottom-6 right-16 w-16 h-16 rounded-full border-4 border-current" />
          <div className="absolute top-1/3 right-8 w-8 h-8 rounded-full bg-current" />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 ${
            result.passed
              ? "bg-emerald-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {result.passed ? (
            <PartyPopper className="w-10 h-10" />
          ) : (
            <Flame className="w-10 h-10" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`text-3xl sm:text-4xl font-heading font-extrabold mb-3 ${result.passed ? "text-emerald-800" : "text-amber-800"}`}
        >
          {result.passed ? "You passed, mate!" : "Almost there, mate!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className={`text-lg sm:text-xl max-w-lg mx-auto ${result.passed ? "text-emerald-700" : "text-amber-700"}`}
        >
          {result.passed
            ? `Brilliant work! You scored ${result.score}/${result.totalQuestions} — you're well on your way to becoming an Australian citizen.`
            : `You've already mastered ${percentage}% of what you need. Focus on the areas below and you'll be ready in no time.`}
        </motion.p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Score */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-cm-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-navy-50 text-cm-navy mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            Overall Score
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-navy">
            {result.score}
            <span className="text-xl text-cm-slate-400">
              /{result.totalQuestions}
            </span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            {percentage}% · Need 75% to pass
          </div>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${result.score >= 15 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.score >= 15 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {result.score >= 15 ? "Passed" : "Need ≥15"}
          </div>
        </motion.div>

        {/* Values Score */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-cm-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            Australian Values
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-navy">
            {result.valuesScore}
            <span className="text-xl text-cm-slate-400">/5</span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            Must get all 5 correct
          </div>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${result.valuesPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.valuesPassed ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {result.valuesPassed ? "All correct" : "Must be 5/5"}
          </div>
        </motion.div>

        {/* Time Used */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-cm-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 text-cm-sky mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            Time Used
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-navy">
            {timeMinutes}
            <span className="text-xl text-cm-slate-400">m</span>{" "}
            {timeSeconds}
            <span className="text-xl text-cm-slate-400">s</span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            of 45 minutes allowed
          </div>
        </motion.div>
      </div>

      {/* Topic Breakdown */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-cm-slate-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-cm-navy" />
          <h3 className="text-lg font-heading font-bold text-cm-slate-900">
            Topic Mastery
          </h3>
        </div>
        <div className="space-y-5">
          {result.topicBreakdown.map((topic, idx) => (
            <div key={topic.topic}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cm-slate-700 flex items-center gap-2">
                  {(() => {
                    const TopicIcon = TOPIC_ICON_COMPONENTS[topic.topic];
                    return TopicIcon ? <TopicIcon className="w-4 h-4 text-cm-navy" /> : null;
                  })()}
                  {TOPIC_LABELS[topic.topic]}
                </span>
                <span className="text-sm font-bold text-cm-slate-900">
                  {topic.correct}/{topic.total}{" "}
                  <span className="text-cm-slate-400 font-normal">
                    ({topic.percentage}%)
                  </span>
                </span>
              </div>
              <div className="h-3 bg-cm-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.percentage}%` }}
                  transition={{
                    delay: 1.0 + idx * 0.15,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${
                    topic.percentage >= 80
                      ? "bg-emerald-500"
                      : topic.percentage >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
