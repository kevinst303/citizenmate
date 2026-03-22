"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gauge,
  BookOpen,
  ClipboardCheck,
  Heart,
  Globe,
  Scale,
  Landmark,
  ArrowRight,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Sparkles,
  Hand,
  Sprout,
  Dumbbell,
  Flame,
  Zap,
  Star,
  PartyPopper,
  Brain,
} from "lucide-react";
import { useStudy } from "@/lib/study-context";
import { useTestDate } from "@/lib/test-date-context";
import {
  calculateReadiness,
  getQuizHistory,
  type ReadinessData,
} from "@/lib/readiness";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import type { TopicCategory } from "@/lib/types";

// ===== Topic visuals =====

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

const TOPIC_COLORS: Record<TopicCategory, { bg: string; text: string; bar: string }> = {
  "australia-people": {
    bg: "bg-cm-sky-light",
    text: "text-cm-sky",
    bar: "bg-cm-sky",
  },
  "democratic-beliefs": {
    bg: "bg-cm-navy-50",
    text: "text-cm-navy",
    bar: "bg-cm-navy",
  },
  "government-law": {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold",
    bar: "bg-cm-gold",
  },
  "australian-values": {
    bg: "bg-cm-red-light",
    text: "text-cm-red",
    bar: "bg-cm-red",
  },
};

// ===== Readiness Icons =====

const READINESS_ICONS: Record<string, typeof Globe> = {
  hand: Hand,
  seedling: Sprout,
  dumbbell: Dumbbell,
  flame: Flame,
  zap: Zap,
  star: Star,
  "party-popper": PartyPopper,
};

// ===== Animations =====

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ===== Readiness ring =====

function ReadinessRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const filled = (score / 100) * circumference;
  const color =
    score >= 75
      ? "stroke-cm-eucalyptus"
      : score >= 50
        ? "stroke-cm-gold"
        : score >= 25
          ? "stroke-orange-400"
          : "stroke-cm-red";

  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-cm-slate-100"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={color}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${filled} ${circumference - filled}` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-heading font-extrabold text-cm-slate-900"
        >
          {score}%
        </motion.span>
        <span className="text-xs text-cm-slate-500 font-medium">Ready</span>
      </div>
    </div>
  );
}

// ===== Page =====

export default function DashboardPage() {
  const { progress } = useStudy();
  const { daysUntilTest, urgencyLevel, openModal, testDate } = useTestDate();

  const readiness: ReadinessData = useMemo(() => {
    const quizHistory = getQuizHistory();
    return calculateReadiness(quizHistory, progress);
  }, [progress]);

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cm-navy via-cm-navy-light to-cm-navy-lighter text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-20 w-28 h-28 rounded-full bg-cm-gold/10 blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute bottom-8 left-16 w-20 h-20 rounded-full bg-cm-eucalyptus/10 blur-lg"
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20 text-center">
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
              <Gauge className="w-4 h-4" />
              Your Dashboard
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight mb-4">
              Your <span className="text-cm-gold">Readiness</span> Score
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              {readiness.message}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 -mt-8 relative z-10 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Row 1: Readiness + Test date */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Readiness card */}
            <motion.div
              variants={item}
              className="bg-white rounded-2xl shadow-lg border border-cm-slate-200 p-6 flex flex-col items-center text-center"
            >
              <ReadinessRing score={readiness.score} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-cm-slate-500"
              >
                {(() => {
                  const ReadinessIcon = READINESS_ICONS[readiness.iconName];
                  return ReadinessIcon ? <ReadinessIcon className="w-4 h-4 inline-block mr-1 text-cm-slate-400" /> : null;
                })()}
                {readiness.message}
              </motion.p>

              <div className="flex gap-4 mt-5 w-full">
                <div className="flex-1 bg-cm-navy-50 rounded-xl p-3">
                  <p className="text-xs text-cm-slate-500">Quiz Score</p>
                  <p className="text-lg font-heading font-bold text-cm-navy">
                    {readiness.quizComponent}%
                  </p>
                </div>
                <div className="flex-1 bg-cm-eucalyptus-light rounded-xl p-3">
                  <p className="text-xs text-cm-slate-500">Study Progress</p>
                  <p className="text-lg font-heading font-bold text-cm-eucalyptus">
                    {readiness.studyComponent}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Test date card */}
            <motion.div
              variants={item}
              className="bg-white rounded-2xl shadow-lg border border-cm-slate-200 p-6 flex flex-col"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy-50 text-cm-navy">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-heading font-bold text-cm-slate-900">
                  Test Date
                </h2>
              </div>

              {testDate && daysUntilTest !== null && daysUntilTest >= 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`text-5xl font-heading font-extrabold ${
                      urgencyLevel === "imminent"
                        ? "text-cm-red"
                        : urgencyLevel === "crunch"
                          ? "text-orange-500"
                          : urgencyLevel === "focused"
                            ? "text-cm-gold"
                            : "text-cm-eucalyptus"
                    }`}
                  >
                    {daysUntilTest}
                  </motion.p>
                  <p className="text-sm text-cm-slate-500 mt-1">
                    {daysUntilTest === 0
                      ? "Your test is today! Good luck, mate! 🍀"
                      : daysUntilTest === 1
                        ? "day until your test"
                        : "days until your test"}
                  </p>
                  <p className="text-xs text-cm-slate-400 mt-2">
                    {new Date(testDate).toLocaleDateString("en-AU", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={openModal}
                    className="mt-4 text-xs text-cm-slate-400 hover:text-cm-navy transition-colors cursor-pointer"
                  >
                    Change date
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cm-navy-50 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-cm-navy/40" />
                  </div>
                  <p className="text-sm text-cm-slate-500 mb-4">
                    Set your test date to get a personalised countdown
                  </p>
                  <button
                    onClick={openModal}
                    className="px-5 py-2.5 bg-cm-navy text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-navy-light transition-colors cursor-pointer"
                  >
                    Set Test Date
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Values alert */}
          {!readiness.valuesReady && readiness.totalQuizzesTaken > 0 && (
            <motion.div
              variants={item}
              className="flex items-center gap-3 px-5 py-4 bg-cm-red-light border border-cm-red/20 rounded-2xl"
            >
              <AlertTriangle className="w-5 h-5 text-cm-red flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-cm-red-dark">
                  Australian Values — Not Yet Ready
                </p>
                <p className="text-xs text-cm-red-dark/80 mt-0.5">
                  All 5 values questions must be answered correctly to pass.
                  Focus on studying this section thoroughly.
                </p>
              </div>
              <Link
                href="/study/australian-values"
                className="flex-shrink-0 px-3 py-1.5 bg-cm-red text-white text-xs font-semibold rounded-lg hover:bg-cm-red/90 transition-colors"
              >
                Study Now
              </Link>
            </motion.div>
          )}

          {/* Topic mastery */}
          <motion.div
            variants={item}
            className="bg-white rounded-2xl shadow-lg border border-cm-slate-200 p-6"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-gold-light text-cm-gold">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-heading font-bold text-cm-slate-900">
                Topic Mastery
              </h2>
            </div>

            <div className="space-y-4">
              {readiness.topicMastery.map((topic) => {
                const Icon = TOPIC_ICONS[topic.topicId];
                const colors = TOPIC_COLORS[topic.topicId];

                return (
                  <Link
                    key={topic.topicId}
                    href={`/study/${topic.topicId}`}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-cm-slate-50 transition-colors cursor-pointer"
                  >
                    <div
                      className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-semibold text-cm-slate-800 group-hover:text-cm-navy transition-colors">
                          {topic.label}
                        </h3>
                        <span className="text-sm font-bold text-cm-slate-700">
                          {topic.overallMastery}%
                        </span>
                      </div>
                      <StudyProgressBar
                        completed={topic.overallMastery}
                        total={100}
                        colorClass={colors.bar}
                        size="sm"
                      />
                      <div className="flex gap-4 mt-1.5 text-xs text-cm-slate-400">
                        <span>Quiz: {topic.quizAccuracy}%</span>
                        <span>Study: {topic.studyCompletion}%</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cm-slate-300 group-hover:text-cm-navy group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item}>
            <h2 className="font-heading font-bold text-cm-slate-900 mb-4 text-lg">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Brain,
                  title: "Smart Practice",
                  desc: "AI-powered weak area focus",
                  href: "/practice/smart",
                  bg: "bg-gradient-to-r from-purple-600 to-indigo-600",
                  hoverBg: "hover:from-purple-700 hover:to-indigo-700",
                },
                {
                  icon: ClipboardCheck,
                  title: "Take a Mock Test",
                  desc: "20 questions, 45 minutes",
                  href: "/practice",
                  bg: "bg-cm-navy",
                  hoverBg: "hover:bg-cm-navy-light",
                },
                {
                  icon: BookOpen,
                  title: "Continue Studying",
                  desc: "Pick up where you left off",
                  href: "/study",
                  bg: "bg-cm-eucalyptus",
                  hoverBg: "hover:bg-cm-eucalyptus/90",
                },
                {
                  icon: Heart,
                  title: "Review Values",
                  desc: "Must pass 5/5 to succeed",
                  href: "/study/australian-values",
                  bg: "bg-cm-red",
                  hoverBg: "hover:bg-cm-red/90",
                },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group flex items-center gap-3 p-4 ${action.bg} ${action.hoverBg} text-white rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm">
                      {action.title}
                    </h3>
                    <p className="text-xs text-white/70">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stats summary */}
          <motion.div variants={item}>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  label: "Tests Taken",
                  value: readiness.totalQuizzesTaken,
                  bg: "bg-cm-navy-50",
                  iconColor: "text-cm-navy",
                },
                {
                  icon: Trophy,
                  label: "Best Score",
                  value: readiness.bestQuizScore
                    ? `${readiness.bestQuizScore.score}/${readiness.bestQuizScore.total}`
                    : "—",
                  bg: "bg-cm-gold-light",
                  iconColor: "text-cm-gold",
                },
                {
                  icon: BookOpen,
                  label: "Study Progress",
                  value: `${readiness.studyComponent}%`,
                  bg: "bg-cm-eucalyptus-light",
                  iconColor: "text-cm-eucalyptus",
                },
                {
                  icon: Sparkles,
                  label: "Readiness",
                  value: `${readiness.score}%`,
                  bg: "bg-cm-sky-light",
                  iconColor: "text-cm-sky",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-cm-slate-200 p-4 text-center"
                >
                  <div
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.bg} ${stat.iconColor} mb-2`}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-heading font-bold text-cm-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-cm-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
