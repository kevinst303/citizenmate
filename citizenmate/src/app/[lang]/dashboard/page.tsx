"use client"; // force turbopack rebuild

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { AbsInsightsWidget } from "@/components/dashboard/abs-insights-widget";
import { LifeInAustraliaSection } from "@/components/dashboard/life-in-australia-section";
import type { TopicCategory } from "@/lib/types";
import { SubpageHero } from "@/components/shared/subpage-hero";

// ===== Topic visuals =====

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

const TOPIC_COLORS: Record<
  TopicCategory,
  { bg: string; text: string; bar: string; accent: string; hoverBg: string }
> = {
  "australia-people": {
    bg: "bg-cm-sky-light",
    text: "text-cm-sky",
    bar: "bg-cm-sky",
    accent: "#0284C7",
    hoverBg: "rgba(224, 242, 254, 0.5)",
  },
  "democratic-beliefs": {
    bg: "bg-cm-navy-50",
    text: "text-cm-navy",
    bar: "bg-cm-navy",
    accent: "#0C2340",
    hoverBg: "rgba(235, 240, 247, 0.5)",
  },
  "government-law": {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold",
    bar: "bg-cm-gold",
    accent: "#D97706",
    hoverBg: "rgba(254, 243, 199, 0.5)",
  },
  "australian-values": {
    bg: "bg-cm-red-light",
    text: "text-cm-red",
    bar: "bg-cm-red",
    accent: "#DC2626",
    hoverBg: "rgba(254, 226, 226, 0.5)",
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

// ===== Stat accent colors (CSS custom prop) =====
const STAT_ACCENTS = {
  navy: "#0C2340",
  gold: "#D97706",
  eucalyptus: "#059669",
  sky: "#0284C7",
};

// ===== AI Insight Logic =====

function getAIInsight(readiness: ReadinessData): {
  iconName: "hand" | "alert-triangle" | "party-popper" | "trending-up" | "book-open";
  message: string;
  variant: "info" | "success" | "warning";
  recommendedAction: string; // matches a quick action title
} {
  if (readiness.totalQuizzesTaken === 0) {
    return {
      iconName: "hand",
      message: "Welcome! Start with the study guide to build a strong foundation, then test yourself with a mock test.",
      variant: "info",
      recommendedAction: "Continue Studying",
    };
  }
  if (!readiness.valuesReady) {
    return {
      iconName: "alert-triangle",
      message: "Australian Values require 5/5 to pass. This is the fastest way to boost your readiness score.",
      variant: "warning",
      recommendedAction: "Review Values",
    };
  }
  if (readiness.score >= 75) {
    return {
      iconName: "party-popper",
      message: "You're looking test-ready! Take one more mock test to lock in your confidence before the real thing.",
      variant: "success",
      recommendedAction: "Take a Mock Test",
    };
  }
  if (readiness.score >= 40) {
    return {
      iconName: "trending-up",
      message: "Your scores are trending up! Keep the momentum going with consistent practice and study.",
      variant: "info",
      recommendedAction: "Smart Practice",
    };
  }
  return {
    iconName: "book-open",
    message: "Build your knowledge first — study the guide, then take practice tests to track your progress.",
    variant: "info",
    recommendedAction: "Continue Studying",
  };
}

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

// ===== Readiness ring — enhanced with double ring =====

function ReadinessRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const filled = (score / 100) * circumference;

  const outerCircumference = 2 * Math.PI * 58;
  const outerFilled = (score / 100) * outerCircumference;

  const color =
    score >= 75
      ? "stroke-cm-eucalyptus"
      : score >= 50
        ? "stroke-cm-gold"
        : score >= 25
          ? "stroke-orange-400"
          : "stroke-cm-red";

  const outerColor =
    score >= 75
      ? "stroke-cm-eucalyptus/30"
      : score >= 50
        ? "stroke-cm-gold/30"
        : score >= 25
          ? "stroke-orange-400/30"
          : "stroke-cm-red/30";

  return (
    <div className="relative inline-flex items-center justify-center w-40 h-40 animate-glow">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
        {/* Outer track (subtle) */}
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          strokeWidth="3"
          className="stroke-cm-slate-100/50"
        />
        {/* Outer progress ring (subtle accent) */}
        <motion.circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={outerColor}
          initial={{ strokeDasharray: `0 ${outerCircumference}` }}
          animate={{
            strokeDasharray: `${outerFilled} ${outerCircumference - outerFilled}`,
          }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        />
        {/* Inner track */}
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-cm-slate-100"
        />
        {/* Inner progress ring (main) */}
        <motion.circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          className={color}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{
            strokeDasharray: `${filled} ${circumference - filled}`,
          }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="text-4xl font-heading font-extrabold text-cm-slate-900"
        >
          {score}%
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-cm-slate-500 font-semibold tracking-wide uppercase"
        >
          Ready
        </motion.span>
      </div>
    </div>
  );
}

// ===== Page =====

export default function DashboardPage() {
  const { progress } = useStudy();
  const { daysUntilTest, urgencyLevel, openModal, testDate } = useTestDate();

  // Defer localStorage reads until after hydration to prevent SSR mismatch
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const readiness: ReadinessData = useMemo(() => {
    const quizHistory = hasMounted ? getQuizHistory() : [];
    return calculateReadiness(quizHistory, progress);
  }, [progress, hasMounted]);

  const aiInsight = useMemo(() => getAIInsight(readiness), [readiness]);

  const countdownGlowColor =
    urgencyLevel === "imminent"
      ? "rgba(220, 38, 38, 0.15)"
      : urgencyLevel === "crunch"
        ? "rgba(249, 115, 22, 0.15)"
        : urgencyLevel === "focused"
          ? "rgba(217, 119, 6, 0.12)"
          : "rgba(5, 150, 105, 0.12)";

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* ===== Hero ===== */}
      <SubpageHero
        title="Your Readiness Score"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
        description={readiness.message}
        bgImage="/generated/dash-welcome.webp"
        badge="Your Dashboard"
      />

      {/* ===== Main content ===== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-10 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* AI Insight Banner — Situation-Based Smart Nudge */}
          <motion.div
            variants={item}
            className="ai-insight-card rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              "--insight-accent":
                aiInsight.variant === "warning"
                  ? "#D97706"
                  : aiInsight.variant === "success"
                    ? "#059669"
                    : "#0C2340",
            } as React.CSSProperties}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                aiInsight.variant === "warning"
                  ? "bg-amber-100 text-amber-600"
                  : aiInsight.variant === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-cm-navy-50 text-cm-navy"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-cm-gold uppercase tracking-wider">
                  AI Insight
                </span>
              </div>
              <p className="text-sm text-cm-slate-700 leading-relaxed">
                {(() => {
                  const InsightIcon: Record<string, typeof Hand> = {
                    "hand": Hand,
                    "alert-triangle": AlertTriangle,
                    "party-popper": PartyPopper,
                    "trending-up": TrendingUp,
                    "book-open": BookOpen,
                  };
                  const Icon = InsightIcon[aiInsight.iconName];
                  return Icon ? <Icon className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-cm-slate-500" /> : null;
                })()}
                {aiInsight.message}
              </p>
            </div>
          </motion.div>

          {/* Row 1: Readiness + Test date */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {/* Readiness card */}
            <motion.div
              variants={item}
              className="bg-white border border-[#E9ECEF] p-6 flex flex-col items-center text-center"
              style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
            >
              <ReadinessRing score={readiness.score} />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-cm-slate-500"
              >
                {(() => {
                  const ReadinessIcon =
                    READINESS_ICONS[readiness.iconName];
                  return ReadinessIcon ? (
                    <ReadinessIcon className="w-4 h-4 inline-block mr-1 text-cm-slate-400" />
                  ) : null;
                })()}
                {readiness.message}
              </motion.p>

              {/* Stat pills */}
              <div className="flex gap-4 mt-5 w-full">
                <div className="flex-1 bg-cm-navy-50 rounded-xl p-3 transition-all duration-200 hover:bg-cm-navy-100 hover:shadow-sm cursor-default">
                  <p className="text-xs text-cm-slate-500 font-medium">
                    Quiz Score
                  </p>
                  <p className="text-lg font-heading font-bold text-cm-navy">
                    {readiness.quizComponent}%
                  </p>
                </div>
                <div className="flex-1 bg-cm-eucalyptus-light rounded-xl p-3 transition-all duration-200 hover:bg-cm-eucalyptus-light/80 hover:shadow-sm cursor-default">
                  <p className="text-xs text-cm-slate-500 font-medium">
                    Study Progress
                  </p>
                  <p className="text-lg font-heading font-bold text-cm-eucalyptus">
                    {readiness.studyComponent}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Test date card */}
            <motion.div
              variants={item}
              className="relative bg-white border border-[#E9ECEF] p-6 flex flex-col overflow-hidden"
              style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
            >
              {/* Subtle visual goal setting background */}
              <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none mix-blend-luminosity">
                <Image
                  src="/generated/dash-goal.webp"
                  alt="Calendar goal setting"
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative z-10 flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy-50 text-cm-navy">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-heading font-bold text-cm-slate-900 drop-shadow-sm">
                  Test Date
                </h2>
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col h-full w-full">
                {testDate && daysUntilTest !== null && daysUntilTest >= 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div
                    className="countdown-glow"
                    style={
                      {
                        "--countdown-glow-color": countdownGlowColor,
                      } as React.CSSProperties
                    }
                  >
                    <motion.p
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.3,
                      }}
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
                  </div>
                  <p className="text-sm text-cm-slate-500 mt-2 font-medium">
                    {daysUntilTest === 0
                      ? "Your test is today! Good luck!"
                      : daysUntilTest === 1
                        ? "day until your test"
                        : "days until your test"}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-cm-slate-50 rounded-lg text-xs text-cm-slate-500">
                    {new Date(testDate).toLocaleDateString("en-AU", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={openModal}
                    className="mt-4 text-xs text-cm-slate-400 hover:text-cm-navy transition-colors duration-200 cursor-pointer"
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
                    className="px-5 py-2.5 bg-cm-navy text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-navy-light transition-colors duration-200 cursor-pointer hover:shadow-md"
                  >
                    Set Test Date
                  </button>
                </div>
              )}
              </div>
            </motion.div>
          </div>

          {/* Values alert */}
          {!readiness.valuesReady && readiness.totalQuizzesTaken > 0 && (
            <motion.div
              variants={item}
              className="flex items-center gap-3 px-5 py-4 bg-cm-red-light/80 backdrop-blur-sm border border-cm-red/15 rounded-2xl alert-gradient"
            >
              <AlertTriangle className="w-5 h-5 text-cm-red flex-shrink-0 animate-icon-pulse" />
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
                className="flex-shrink-0 px-3 py-1.5 bg-cm-red text-white text-xs font-semibold rounded-lg hover:bg-cm-red/90 transition-colors duration-200 cursor-pointer"
              >
                Study Now
              </Link>
            </motion.div>
          )}

          {/* Topic mastery */}
          <motion.div
            variants={item}
            className="bg-white border border-[#E9ECEF] p-6"
              style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
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
                    className="topic-row group flex items-center gap-4 p-3 rounded-xl cursor-pointer"
                    style={
                      {
                        "--topic-accent-color": colors.accent,
                        "--topic-hover-bg": colors.hoverBg,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-semibold text-cm-slate-800 group-hover:text-cm-navy transition-colors duration-200">
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
                    <ArrowRight className="w-4 h-4 text-cm-slate-300 group-hover:text-cm-navy group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item} className="dashboard-section-divider">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-purple-600">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
                Quick Actions
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Brain,
                  title: "Smart Practice",
                  desc: "AI-powered weak area focus",
                  href: "/practice/smart",
                  bg: "bg-gradient-to-br from-purple-600 to-indigo-600",
                  hoverBg:
                    "hover:from-purple-700 hover:to-indigo-700",
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
              ].map((action, actionIdx) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * actionIdx, type: "spring", stiffness: 150, damping: 16 }}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={action.href}
                    className={`action-card-shine group flex items-center gap-3 p-4 ${action.bg} ${action.hoverBg} text-white rounded-2xl transition-colors duration-200 hover:shadow-xl cursor-pointer relative`}
                  >
                    {/* Recommended badge */}
                    {action.title === aiInsight.recommendedAction && (
                      <span className="absolute -top-2 -right-2 recommended-pulse inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cm-gold text-white text-[10px] font-bold shadow-md z-10">
                        <Sparkles className="w-2.5 h-2.5" />
                        Recommended
                      </span>
                    )}
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm">
                        {action.title}
                      </h3>
                      <p className="text-xs text-white/70">
                        {action.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats summary */}
          <motion.div variants={item} className="dashboard-section-divider">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-sky-light text-cm-sky">
                <Gauge className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
                Your Stats
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  label: "Tests Taken",
                  value: readiness.totalQuizzesTaken,
                  bg: "bg-cm-navy-50",
                  iconColor: "text-cm-navy",
                  accent: STAT_ACCENTS.navy,
                },
                {
                  icon: Trophy,
                  label: "Best Score",
                  value: readiness.bestQuizScore
                    ? `${readiness.bestQuizScore.score}/${readiness.bestQuizScore.total}`
                    : "—",
                  bg: "bg-cm-gold-light",
                  iconColor: "text-cm-gold",
                  accent: STAT_ACCENTS.gold,
                },
                {
                  icon: BookOpen,
                  label: "Study Progress",
                  value: `${readiness.studyComponent}%`,
                  bg: "bg-cm-eucalyptus-light",
                  iconColor: "text-cm-eucalyptus",
                  accent: STAT_ACCENTS.eucalyptus,
                },
                {
                  icon: Sparkles,
                  label: "Readiness",
                  value: `${readiness.score}%`,
                  bg: "bg-cm-sky-light",
                  iconColor: "text-cm-sky",
                  accent: STAT_ACCENTS.sky,
                },
              ].map((stat, statIdx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.08 * statIdx, type: "spring", stiffness: 150, damping: 14 }}
                  whileHover={{ y: -4, scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  className="stat-card rounded-2xl p-4 text-center cursor-default"
                  style={
                    {
                      "--stat-accent-color": stat.accent,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.bg} ${stat.iconColor} mb-2`}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-heading font-bold text-cm-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-cm-slate-500 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ABS Data Integration */}
          <motion.div variants={item} className="dashboard-section-divider">
            <AbsInsightsWidget />
          </motion.div>

          {/* Life in Australia — Multi-API Insights */}
          <motion.div variants={item} className="dashboard-section-divider">
            <LifeInAustraliaSection />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
