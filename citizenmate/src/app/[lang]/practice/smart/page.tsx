"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSRS } from "@/lib/srs-context";
import type { TopicCategory } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import {
  Brain,
  Sparkles,
  Zap,
  BookOpen,
  Target,
  ArrowRight,
  Globe,
  Scale,
  Landmark,
  Heart,
  TrendingDown,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { usePremium } from "@/lib/auth-context";
import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";

const RATE_KEY = "citizenmate-srs-usage";
const MAX_DAILY_SESSIONS = 1;

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDailyUsage(): { date: string; count: number } {
  if (typeof window === "undefined") return { date: getTodayString(), count: 0 };
  const raw = localStorage.getItem(RATE_KEY);
  if (!raw) return { date: getTodayString(), count: 0 };
  const parsed = JSON.parse(raw);
  if (parsed.date !== getTodayString()) {
    return { date: getTodayString(), count: 0 };
  }
  return parsed;
}

function incrementUsage(): { date: string; count: number } {
  const usage = getDailyUsage();
  usage.count += 1;
  localStorage.setItem(RATE_KEY, JSON.stringify(usage));
  return usage;
}

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

const TOPIC_COLORS: Record<
  TopicCategory,
  { bg: string; text: string; border: string; accent: string }
> = {
  "australia-people": {
    bg: "bg-cm-sky-light",
    text: "text-cm-sky",
    border: "border-cm-sky/20",
    accent: "bg-cm-sky",
  },
  "democratic-beliefs": {
    bg: "bg-cm-navy-50",
    text: "text-cm-navy",
    border: "border-cm-navy/20",
    accent: "bg-cm-navy",
  },
  "government-law": {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold",
    border: "border-cm-gold/20",
    accent: "bg-cm-gold",
  },
  "australian-values": {
    bg: "bg-cm-red-light",
    text: "text-cm-red",
    border: "border-cm-red/20",
    accent: "bg-cm-red",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function SmartPracticePage() {
  const router = useRouter();
  const { getStats, getTopicWeakness, getSmartQuestions } = useSRS();
  const { isPremium, upgrade } = usePremium();
  const { t } = useT();
  const { getUrl } = useLocalizedPath();
  const [focusTopic, setFocusTopic] = useState<TopicCategory | null>(null);
  const [dailyUsage, setDailyUsage] = useState(() => ({
    date: getTodayString(),
    count: 0,
  }));

  useEffect(() => {
    setDailyUsage(getDailyUsage());
  }, []);

  const stats = useMemo(() => getStats(), [getStats]);
  const topicWeakness = useMemo(() => getTopicWeakness(), [getTopicWeakness]);

  const hasData = stats.totalQuestions - stats.newCount > 0;
  const isLimitReached = !isPremium && dailyUsage.count >= MAX_DAILY_SESSIONS;

  const handleStartSession = () => {
    if (isLimitReached) {
      upgrade();
      return;
    }

    const newUsage = incrementUsage();
    setDailyUsage(newUsage);

    // Pre-generate questions and store in sessionStorage for the session page
    const questions = getSmartQuestions(15, focusTopic ?? undefined);
    sessionStorage.setItem(
      "citizenmate-smart-session",
      JSON.stringify(questions.map((q) => q.id))
    );
    if (focusTopic) {
      sessionStorage.setItem("citizenmate-smart-focus", focusTopic);
    } else {
      sessionStorage.removeItem("citizenmate-smart-focus");
    }
    router.push("/practice/smart/session");
  };

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-12 w-32 h-32 rounded-full bg-purple-500/15 blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -12, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-28 right-16 w-20 h-20 rounded-full bg-fuchsia-400/15 blur-lg"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-8 left-1/3 w-16 h-16 rounded-full bg-indigo-400/15 blur-lg"
          />
        </div>

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
              <Brain className="w-4 h-4" />
              {t("smart_practice.badge", "AI-Powered Practice")}
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight mb-4">
              Smart{" "}
              <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Practice
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
              {t("smart_practice.hero_desc", "Questions are ordered based on your performance — weakest areas first. Learn smarter, not harder, mate.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats overview */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-cm-slate-200 p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              {
                icon: Sparkles,
                value: stats.newCount,
                label: t("smart_practice.stats_new", "New"),
                color: "text-cm-slate-400",
                bg: "bg-cm-slate-50",
              },
              {
                icon: RotateCcw,
                value: stats.learningCount,
                label: t("smart_practice.stats_learning", "Learning"),
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
              {
                icon: Target,
                value: stats.reviewingCount,
                label: t("smart_practice.stats_reviewing", "Reviewing"),
                color: "text-cm-sky",
                bg: "bg-cm-sky-light",
              },
              {
                icon: Zap,
                value: stats.masteredCount,
                label: t("smart_practice.stats_mastered", "Mastered"),
                color: "text-cm-eucalyptus",
                bg: "bg-cm-eucalyptus-light",
              },
              {
                icon: AlertCircle,
                value: stats.dueCount,
                label: t("smart_practice.stats_due_now", "Due Now"),
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.08 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.bg} ${stat.color} mb-2`}
                >
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <div className="text-2xl font-heading font-extrabold text-cm-slate-900">
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

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Topic weakness cards */}
          {hasData && (
            <motion.div variants={item}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-heading font-bold text-cm-slate-900">
                  {t("smart_practice.weak_areas", "Your Weak Areas")}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {topicWeakness.map((topic) => {
                  const Icon = TOPIC_ICONS[topic.topicId];
                  const colors = TOPIC_COLORS[topic.topicId];
                  const isSelected = focusTopic === topic.topicId;

                  return (
                    <motion.button
                      key={topic.topicId}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFocusTopic(isSelected ? null : topic.topicId)
                      }
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${colors.bg} ${colors.border} shadow-lg ring-2 ring-purple-300`
                          : "bg-white border-cm-slate-200 hover:border-cm-slate-300 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-heading font-bold text-cm-slate-900 truncate">
                            {topic.label}
                          </h3>
                          <p className="text-xs text-cm-slate-500">
                            {topic.totalAnswered > 0
                              ? `${topic.accuracy}% ${t("smart_practice.accuracy", "accuracy")}`
                              : t("smart_practice.not_practised", "Not yet practised")}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="flex-shrink-0 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {t("smart_practice.focus_tag", "Focus")}
                          </span>
                        )}
                      </div>

                      {topic.totalAnswered > 0 && (
                        <div className="space-y-1.5">
                          <div className="h-2 bg-cm-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.accuracy}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                topic.accuracy >= 80
                                  ? "bg-cm-eucalyptus"
                                  : topic.accuracy >= 60
                                    ? "bg-amber-500"
                                    : "bg-cm-red"
                              }`}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-cm-slate-400">
                            <span>
                              {topic.weakQuestionCount > 0
                                ? `${topic.weakQuestionCount} ${t("smart_practice.weak_questions", "weak questions")}`
                                : t("smart_practice.looking_good", "Looking good")}
                            </span>
                            {topic.dueCount > 0 && (
                              <span className="text-purple-500 font-medium">
                                {topic.dueCount} {t("smart_practice.due", "due")}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Start session card */}
          <motion.div variants={item}>
            <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white mb-5"
              >
                <Brain className="w-8 h-8" />
              </motion.div>

              <h2 className="text-2xl font-heading font-bold text-cm-slate-900 mb-2">
                {focusTopic
                  ? `${t("smart_practice.start_focus", "Focus:")} ${TOPIC_LABELS[focusTopic]}`
                  : t("smart_practice.start_session", "Start Smart Practice")}
              </h2>
              <p className="text-sm text-cm-slate-500 max-w-md mx-auto mb-6">
                {focusTopic
                  ? t("smart_practice.focus_desc", "Get 15 questions focused on this topic, ordered from weakest to strongest.")
                  : t("smart_practice.all_desc", "Get 15 questions across all topics, ordered so you tackle your weakest areas first. Instant feedback — no timer.")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartSession}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  {isLimitReached ? t("smart_practice.unlock_unlimited", "Unlock Unlimited Practice") : t("smart_practice.start_session", "Start Session")}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {focusTopic && (
                  <button
                    onClick={() => setFocusTopic(null)}
                    className="text-sm text-cm-slate-500 hover:text-cm-slate-700 transition-colors cursor-pointer"
                  >
                    {t("smart_practice.clear_focus", "Clear focus")}
                  </button>
                )}
              </div>

              {!isPremium && (
                <div className="mt-3">
                  <p className={`text-xs ${isLimitReached ? 'text-cm-red font-semibold' : 'text-cm-slate-400'}`}>
                    {isLimitReached 
                      ? t("smart_practice.daily_limit_reached", "Daily limit reached. Upgrade for unlimited practice.")
                      : `${MAX_DAILY_SESSIONS - dailyUsage.count} ${(MAX_DAILY_SESSIONS - dailyUsage.count) !== 1 ? t("smart_practice.free_remaining_other", "free sessions remaining today.") : t("smart_practice.free_remaining_one", "1 free session remaining today.")}`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-5 text-xs text-cm-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {t("smart_practice.questions_count", "15 questions")}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t("smart_practice.instant_feedback", "Instant feedback")}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {t("smart_practice.no_timer", "No timer")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div variants={item}>
            <div className="bg-white rounded-2xl border border-cm-slate-200 p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-heading font-bold text-cm-slate-900">
                  {t("smart_practice.how_title", "How Smart Practice Works")}
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: t("smart_practice.step_1_title", "Tracks Every Answer"),
                    desc: t("smart_practice.step_1_desc", "We remember every question you've answered — right or wrong — across all practice tests and smart sessions."),
                  },
                  {
                    step: "2",
                    title: t("smart_practice.step_2_title", "Prioritises Weak Areas"),
                    desc: t("smart_practice.step_2_desc", "Questions you've gotten wrong come back sooner. Mastered ones fade away. Your weakest topics always come first."),
                  },
                  {
                    step: "3",
                    title: t("smart_practice.step_3_title", "Spaces Reviews"),
                    desc: t("smart_practice.step_3_desc", "As you master a question, it appears less often — at 1 day, then 3, then a week. Just like how your brain actually learns."),
                  },
                ].map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-heading font-bold text-sm">
                      {step.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-cm-slate-800 mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-cm-slate-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back to practice link */}
          <motion.div variants={item} className="text-center">
            <Link
              href={getUrl("/practice")}
              className="inline-flex items-center gap-2 text-sm text-cm-slate-500 hover:text-cm-navy transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {t("smart_practice.back_to_practice", "Back to Practice Tests")}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
