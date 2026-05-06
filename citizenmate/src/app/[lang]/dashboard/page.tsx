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
  X,
  Lock,
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
import {
  TOPIC_ICONS,
  TOPIC_COLORS,
  READINESS_ICONS,
  STAT_ACCENTS,
  INSIGHT_ICONS,
} from "@/lib/dashboard-config";
import { getAIInsight } from "@/lib/insights";
import { ReadinessRing } from "@/components/dashboard/readiness-ring";
import { useAuth } from "@/lib/auth-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { useT } from "@/i18n/i18n-context";


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


// ===== Page =====

export default function DashboardPage() {
  const { progress } = useStudy();
  const { daysUntilTest, urgencyLevel, openModal, testDate } = useTestDate();
  const { profile } = useAuth();
  const { openModal: openUpgradeModal } = useUpgradeModal();
  const { t } = useT();

  // Defer localStorage reads until after hydration to prevent SSR mismatch
  const [hasMounted, setHasMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
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
        title={t("dashboard.hero_title")}
        breadcrumbs={[
          { label: t("dashboard.hero_breadcrumb_home"), href: "/" },
          { label: t("dashboard.hero_breadcrumb_dashboard") },
        ]}
        description={readiness.messageKey ? t(readiness.messageKey as Parameters<typeof t>[0], readiness.message) : readiness.message}
        bgImage="/generated/dash-welcome.webp"
        badge={t("dashboard.hero_badge")}
        curveColorClass="text-cm-ice"
      />

      {/* ===== Main content ===== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Upgrade Banner for Free Users */}
          {hasMounted && !profile.isPremium && showBanner && (
            <motion.div
              variants={item}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cm-slate-900 via-cm-navy-darker to-cm-slate-900 shadow-xl border border-white/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              {/* Premium shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cm-gold to-amber-500 text-white shadow-lg shadow-amber-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5 tracking-tight">{t("dashboard.unlock_premium")}</h3>
                  <p className="text-sm text-cm-slate-200">{t("dashboard.unlock_premium_desc")}</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => openUpgradeModal("dashboard_banner")}
                  className="px-5 py-2.5 bg-white text-cm-navy-darker text-sm font-bold rounded-xl hover:bg-cm-ice transition-colors shadow-lg shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cm-slate-900"
                >
                  {t("dashboard.upgrade_now")}
                </button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-2 text-cm-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cm-slate-900"
                  aria-label={t("dashboard.dismiss_banner")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

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
                  {t("dashboard.ai_insight")}
                </span>
              </div>
              <p className="text-sm text-cm-slate-700 leading-relaxed">
                {(() => {
                  const Icon = INSIGHT_ICONS[aiInsight.iconName];
                  return Icon ? <Icon className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-cm-slate-500" /> : null;
                })()}
                {aiInsight.messageKey ? t(aiInsight.messageKey as Parameters<typeof t>[0], aiInsight.message) : aiInsight.message}
              </p>
            </div>
          </motion.div>

          {/* Row 1: Readiness + Test date */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {/* Readiness card */}
            <motion.div
              variants={item}
              className="bg-white border border-cm-slate-200/60 p-6 flex flex-col items-center text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <ReadinessRing score={readiness.score} />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-cm-slate-600"
              >
                {(() => {
                  const ReadinessIcon =
                    READINESS_ICONS[readiness.iconName];
                  return ReadinessIcon ? (
                    <ReadinessIcon className="w-4 h-4 inline-block mr-1 text-cm-slate-400" />
                  ) : null;
                })()}
                {readiness.messageKey ? t(readiness.messageKey as Parameters<typeof t>[0], readiness.message) : readiness.message}
              </motion.p>

              {/* Stat pills */}
              <div className="flex gap-4 mt-5 w-full">
                <div className="flex-1 bg-cm-navy-50 rounded-xl p-3 transition-all duration-200 hover:bg-cm-navy-100 hover:shadow-sm cursor-default">
                  <p className="text-xs text-cm-slate-500 font-medium">
                    {t("dashboard.quiz_score", "Quiz Score")}
                  </p>
                  <p className="text-lg font-heading font-bold text-cm-navy">
                    {readiness.quizComponent}%
                  </p>
                </div>
                <div className="flex-1 bg-cm-eucalyptus-light rounded-xl p-3 transition-all duration-200 hover:bg-cm-eucalyptus-light/80 hover:shadow-sm cursor-default">
                  <p className="text-xs text-cm-slate-500 font-medium">
                    {t("dashboard.study_progress", "Study Progress")}
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
              className="relative bg-white border border-cm-slate-200/60 p-6 flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                  {t("dashboard.test_date", "Test Date")}
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
                  <p className="text-sm text-cm-slate-600 mt-2 font-medium">
                    {daysUntilTest === 0
                      ? t("dashboard.test_today", "Your test is today! Good luck!")
                      : daysUntilTest === 1
                        ? `1 ${t("dashboard.day_until", "day until your test")}`
                        : `${daysUntilTest} ${t("dashboard.days_until", "days until your test")}`}
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
                    className="mt-4 text-xs text-cm-slate-500 hover:text-cm-navy transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2 rounded-md px-2 py-1"
                  >
                    {t("dashboard.change_date", "Change date")}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cm-navy-50 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-cm-navy/40" />
                  </div>
                  <p className="text-sm text-cm-slate-600 mb-4">
                    {t("dashboard.set_date_prompt", "Set your test date to get a personalised countdown")}
                  </p>
                  <button
                    onClick={openModal}
                    className="px-5 py-2.5 bg-cm-navy text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-navy-light transition-colors duration-200 cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
                  >
                    {t("dashboard.set_test_date", "Set Test Date")}
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
              className="flex items-center gap-3 px-5 py-4 bg-red-50/80 border border-red-100 rounded-2xl alert-gradient"
            >
              <AlertTriangle className="w-5 h-5 text-cm-red flex-shrink-0 animate-icon-pulse" />
              <div>
                <p className="text-sm font-semibold text-cm-red-dark">
                  {t("dashboard.values_not_ready")}
                </p>
                <p className="text-xs text-cm-red-dark/80 mt-0.5">
                  {t("dashboard.values_not_ready_desc")}
                </p>
              </div>
              <Link
                href="/study/australian-values"
                className="flex-shrink-0 px-3 py-1.5 bg-cm-red text-white text-xs font-semibold rounded-lg hover:bg-cm-red/90 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-red focus-visible:ring-offset-2 shadow-sm"
              >
                {t("dashboard.study_values_now")}
              </Link>
            </motion.div>
          )}

          {/* Topic mastery */}
            <motion.div
              variants={item}
              className="bg-white border border-cm-slate-200/60 p-6 relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-gold-light text-cm-gold">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-heading font-bold text-cm-slate-900">
                {t("dashboard.topic_mastery")}
              </h2>
            </div>

            <div className="space-y-4 relative">
              {hasMounted && !profile.isPremium ? (
                // Locked View
                <div className="relative">
                  <div className="space-y-4 opacity-40 select-none pointer-events-none blur-[3px] grayscale-[0.3]">
                    {readiness.topicMastery.slice(0, 4).map((topic) => {
                      const Icon = TOPIC_ICONS[topic.topicId];
                      const colors = TOPIC_COLORS[topic.topicId];

                      return (
                        <div
                          key={topic.topicId}
                          className="flex items-center gap-4 p-3 rounded-xl"
                        >
                          <div
                            className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className="text-sm font-semibold text-cm-slate-800">
                                {t(topic.labelKey as Parameters<typeof t>[0], topic.label)}
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
                            <div className="flex gap-4 mt-1.5 text-xs text-cm-slate-500">
                              <span>{t("dashboard.quiz_label")}: {topic.quizAccuracy}%</span>
                              <span>{t("dashboard.study_label")}: {topic.studyCompletion}%</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-cm-slate-300 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                   
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white pt-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cm-gold to-amber-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-cm-slate-900 mb-2 text-center drop-shadow-sm">{t("dashboard.analytics_locked")}</h3>
                    <p className="text-sm text-cm-slate-600 font-medium mb-6 text-center max-w-[250px] drop-shadow-sm">{t("dashboard.analytics_locked_desc")}</p>
                    <button
                      onClick={() => openUpgradeModal("topic_mastery")}
                      className="px-6 py-2.5 bg-cm-navy text-white text-sm font-bold rounded-xl hover:bg-cm-navy-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
                    >
                      {t("dashboard.unlock_analytics")}
                    </button>
                  </div>
                </div>
              ) : (
                // Unlocked View
                <div className="space-y-4">
                  {readiness.topicMastery.map((topic) => {
                    const Icon = TOPIC_ICONS[topic.topicId];
                    const colors = TOPIC_COLORS[topic.topicId];

                    return (
                      <Link
                        key={topic.topicId}
                        href={`/study/${topic.topicId}`}
                        className="topic-row group flex items-center gap-4 p-3 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
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
                              {t(topic.labelKey as Parameters<typeof t>[0], topic.label)}
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
                          <div className="flex gap-4 mt-1.5 text-xs text-cm-slate-500">
                            <span>{t("dashboard.quiz_label")}: {topic.quizAccuracy}%</span>
                            <span>{t("dashboard.study_label")}: {topic.studyCompletion}%</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-cm-slate-300 group-hover:text-cm-navy group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item} className="dashboard-section-divider">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-purple-600">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
                {t("dashboard.quick_actions")}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Brain,
                  title: t("dashboard.action_smart_practice"),
                  desc: t("dashboard.action_smart_practice_desc"),
                  href: "/practice/smart",
                  color: "text-purple-600",
                  bgIcon: "bg-purple-100/80",
                  borderHover: "hover:border-purple-300 hover:shadow-purple-500/5",
                },
                {
                  icon: ClipboardCheck,
                  title: t("dashboard.action_mock_test"),
                  desc: t("dashboard.action_mock_test_desc"),
                  href: "/practice",
                  color: "text-blue-600",
                  bgIcon: "bg-blue-100/80",
                  borderHover: "hover:border-blue-300 hover:shadow-blue-500/5",
                },
                {
                  icon: BookOpen,
                  title: t("dashboard.action_continue_study"),
                  desc: t("dashboard.action_continue_study_desc"),
                  href: "/study",
                  color: "text-emerald-600",
                  bgIcon: "bg-emerald-100/80",
                  borderHover: "hover:border-emerald-300 hover:shadow-emerald-500/5",
                },
                {
                  icon: Heart,
                  title: t("dashboard.action_review_values"),
                  desc: t("dashboard.action_review_values_desc"),
                  href: "/study/australian-values",
                  color: "text-red-600",
                  bgIcon: "bg-red-100/80",
                  borderHover: "hover:border-red-300 hover:shadow-red-500/5",
                },
              ].map((action, actionIdx) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * actionIdx, type: "spring", stiffness: 150, damping: 16 }}
                >
                  <Link
                    href={action.href}
                    className={`group flex items-center gap-4 p-5 bg-white border border-cm-slate-200/60 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${action.borderHover} relative overflow-hidden`}
                  >
                    {/* Recommended badge */}
                    {action.title === aiInsight.recommendedAction && (
                      <span className="absolute top-2.5 right-2.5 recommended-pulse inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cm-gold text-white text-[10px] font-bold shadow-sm z-10">
                        <Sparkles className="w-2.5 h-2.5" />
                        {t("dashboard.recommended")}
                      </span>
                    )}
                    
                    {/* Hover subtle background highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out z-0"></div>

                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${action.bgIcon} ${action.color} transition-transform duration-300 group-hover:scale-110 z-10`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="z-10 relative">
                      <h3 className="font-heading font-semibold text-sm text-cm-slate-900 mb-0.5">
                        {action.title}
                      </h3>
                      <p className="text-xs text-cm-slate-500">
                        {action.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-cm-slate-400 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-cm-navy transition-all duration-300 z-10" />
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
                {t("dashboard.your_stats")}
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  label: t("dashboard.stat_tests_taken"),
                  value: readiness.totalQuizzesTaken,
                  bg: "bg-cm-navy-50",
                  iconColor: "text-cm-navy",
                  accent: STAT_ACCENTS.navy,
                },
                {
                  icon: Trophy,
                  label: t("dashboard.stat_best_score"),
                  value: readiness.bestQuizScore
                    ? `${readiness.bestQuizScore.score}/${readiness.bestQuizScore.total}`
                    : "—",
                  bg: "bg-cm-gold-light",
                  iconColor: "text-cm-gold",
                  accent: STAT_ACCENTS.gold,
                },
                {
                  icon: BookOpen,
                  label: t("dashboard.stat_study_progress"),
                  value: `${readiness.studyComponent}%`,
                  bg: "bg-cm-eucalyptus-light",
                  iconColor: "text-cm-eucalyptus",
                  accent: STAT_ACCENTS.eucalyptus,
                },
                {
                  icon: Sparkles,
                  label: t("dashboard.stat_readiness"),
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
                  className="rounded-2xl border border-cm-slate-200/60 bg-white p-4 text-center shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-default"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-80" style={{ backgroundColor: stat.accent }} />
                  <div
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.bg} ${stat.iconColor} mb-2`}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-heading font-bold text-cm-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-cm-slate-600 font-medium">
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
