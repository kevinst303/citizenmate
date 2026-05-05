"use client";

import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { useT } from "@/i18n/i18n-context";

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
  const { profile } = useAuth();
  const { openModal } = useUpgradeModal();
  const { t } = useT();
  const isFreeUser = profile.tier === 'free';

  function getRecommendation(res: QuizResult) {
    if (!res.valuesPassed) {
      return {
        emoji: "🎯",
        title: t("results.rec_values_title", "Focus Area: Australian Values"),
        message: t("results.rec_values_msg", "You scored {v}/5 on Australian Values. All 5 must be correct to pass the real test. This is the fastest way to improve your result.").replace("{v}", String(res.valuesScore)),
        actionLabel: t("results.rec_values_action", "Study Australian Values"),
        actionHref: "/study/australian-values",
        urgency: "critical" as const,
      };
    }
    if (!res.passed && res.score >= 12) {
      const need = 15 - res.score;
      return {
        emoji: "💪",
        title: t("results.rec_close_title", "Almost There!"),
        message: t("results.rec_close_msg", "You need {n} more correct {p} to pass. One more focused practice session could push you over the line.").replace("{n}", String(need)).replace("{p}", need === 1 ? "answer" : "answers"),
        actionLabel: t("results.rec_close_action", "Take Another Practice Test"),
        actionHref: "/practice",
        urgency: "warning" as const,
      };
    }
    if (!res.passed) {
      const weakest = [...res.topicBreakdown].sort(
        (a, b) => a.percentage - b.percentage
      )[0];
      return {
        emoji: "📚",
        title: t("results.rec_weak_title", "Strengthen: {topic}").replace("{topic}", TOPIC_LABELS[weakest.topic]),
        message: t("results.rec_weak_msg", "You scored {c}/{t} ({p}%) in this area. Studying this topic will have the biggest impact on your overall score.").replace("{c}", String(weakest.correct)).replace("{t}", String(weakest.total)).replace("{p}", String(weakest.percentage)),
        actionLabel: t("results.rec_weak_action", "Study {topic}").replace("{topic}", TOPIC_LABELS[weakest.topic]),
        actionHref: `/study/${weakest.topic}`,
        urgency: "warning" as const,
      };
    }
    return {
      emoji: "🎉",
      title: t("results.rec_ready_title", "You're Test-Ready!"),
      message: t("results.rec_ready_msg", "Great result! You passed with {s}/{t}. Keep this up and you'll ace the real test. Consider one more practice to lock in your confidence.").replace("{s}", String(res.score)).replace("{t}", String(res.totalQuestions)),
      actionLabel: t("results.rec_ready_action", "Practice Again"),
      actionHref: "/practice",
      urgency: "positive" as const,
    };
  }

  const recommendation = getRecommendation(result);

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
          relative text-center rounded-2xl overflow-hidden shadow-card
          ${
            result.passed
              ? "bg-gradient-to-br from-emerald-50 via-cm-eucalyptus-light to-emerald-50"
              : "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50"
          }
        `}
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={result.passed ? "/generated/result-pass.webp" : "/generated/result-tryagain.webp"}
            alt={result.passed ? "Celebration for passing" : "Encouragement to try again"}
            fill
            className={`object-cover ${result.passed ? "mix-blend-overlay opacity-30" : "mix-blend-luminosity opacity-20"}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="relative z-10 p-8 sm:p-12">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
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
          {result.passed ? t("results.passed_title", "You passed, mate!") : t("results.failed_title", "Almost there, mate!")}
        </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className={`text-lg sm:text-xl max-w-lg mx-auto ${result.passed ? "text-emerald-800" : "text-amber-800"} drop-shadow-sm font-medium`}
          >
            {result.passed
              ? t("results.passed_desc", "Brilliant work! You scored {s}/{t} — you're well on your way to becoming an Australian citizen.").replace("{s}", String(result.score)).replace("{t}", String(result.totalQuestions))
              : t("results.failed_desc", "You've already mastered {p}% of what you need. Focus on the areas below and you'll be ready in no time.").replace("{p}", String(percentage))}
          </motion.p>
        </div>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Score */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
          className="bg-white border border-[#E9ECEF] p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-default"
          style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-teal/10 text-cm-teal mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            {t("results.overall_score", "Overall Score")}
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-teal">
            {result.score}
            <span className="text-xl text-cm-slate-400">
              /{result.totalQuestions}
            </span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            {t("results.need_to_pass", "{p}% · Need 75% to pass").replace("{p}", String(percentage))}
          </div>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${result.score >= 15 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.score >= 15 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {result.score >= 15 ? t("results.passed", "Passed") : t("results.need_15", "Need ≥15")}
          </div>
        </motion.div>

        {/* Values Score */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
          className="bg-white border border-[#E9ECEF] p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-default"
          style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            {t("results.australian_values", "Australian Values")}
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-teal">
            {result.valuesScore}
            <span className="text-xl text-cm-slate-400">/5</span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            {t("results.must_get_all_5", "Must get all 5 correct")}
          </div>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${result.valuesPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.valuesPassed ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {result.valuesPassed ? t("results.all_correct", "All correct") : t("results.must_be_5of5", "Must be 5/5")}
          </div>
        </motion.div>

        {/* Time Used */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
          className="bg-white border border-[#E9ECEF] p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-default"
          style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 text-cm-sky mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-cm-slate-500 mb-2">
            {t("results.time_used", "Time Used")}
          </div>
          <div className="text-4xl font-heading font-extrabold text-cm-teal">
            {timeMinutes}
            <span className="text-xl text-cm-slate-400">m</span>{" "}
            {timeSeconds}
            <span className="text-xl text-cm-slate-400">s</span>
          </div>
          <div className="text-sm text-cm-slate-500 mt-1">
            {t("results.of_45_min", "of 45 minutes allowed")}
          </div>
        </motion.div>
      </div>

      {/* Topic Breakdown */}
      <motion.div
        variants={item}
        className="bg-white border border-[#E9ECEF] p-6"
        style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-cm-teal" />
          <h3 className="text-lg font-heading font-bold text-cm-slate-900">
            {t("results.topic_mastery", "Topic Mastery")}
          </h3>
        </div>
        <div className="space-y-5">
          {result.topicBreakdown.map((topic, idx) => (
            <div key={topic.topic}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cm-slate-700 flex items-center gap-2">
                  {(() => {
                    const TopicIcon = TOPIC_ICON_COMPONENTS[topic.topic];
                    return TopicIcon ? <TopicIcon className="w-4 h-4 text-cm-teal" /> : null;
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
                    duration: 0.9,
                    type: "spring" as const,
                    stiffness: 80,
                    damping: 12,
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

      {/* Premium Upsell — Free users who haven't passed */}
      {isFreeUser && !result.passed && (
        <motion.div
          variants={item}
          className="bg-gradient-to-r from-cm-navy via-cm-navy-light to-cm-navy-lighter rounded-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cm-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-heading font-bold mb-1">
                {t("results.need_targeted_help", "Need targeted help?")}
              </h4>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {t("results.premium_upsell_desc", "Unlock CitizenMate Pro for targeted weak-area quizzes, unlimited AI tutor Q&A, and a personalised study plan matched to your test date.")}
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openModal("weak_area_results")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-semibold bg-cm-gold text-cm-navy hover:bg-cm-gold-light transition-colors cursor-pointer"
              >
                {t("results.upgrade_to_pro", "Upgrade to Pro")}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Recommendation — Smart Next Step */}
      <motion.div
        variants={item}
        className="ai-insight-card rounded-2xl p-6"
        style={{
          borderImage:
            recommendation.urgency === "critical"
              ? "linear-gradient(180deg, #DC2626, #EF4444) 1"
              : recommendation.urgency === "warning"
                ? "linear-gradient(180deg, #D97706, #F59E0B) 1"
                : "linear-gradient(180deg, #059669, #34D399) 1",
        }}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 15 }}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              recommendation.urgency === "critical"
                ? "bg-red-100 text-red-600"
                : recommendation.urgency === "warning"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <Target className="w-5 h-5" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cm-gold" />
              <span className="text-[10px] font-bold text-cm-gold uppercase tracking-wider">
                {t("results.ai_recommendation", "AI Recommendation")}
              </span>
            </div>
            <h4 className="text-base font-heading font-bold text-cm-slate-900 mb-1">
              {recommendation.emoji} {recommendation.title}
            </h4>
            <p className="text-sm text-cm-slate-600 leading-relaxed mb-4">
              {recommendation.message}
            </p>
            <motion.div
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              <Link
                href={recommendation.actionHref}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-semibold text-white transition-colors duration-200 hover:shadow-md cursor-pointer group ${
                  recommendation.urgency === "critical"
                    ? "bg-red-600 hover:bg-red-700"
                    : recommendation.urgency === "warning"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {recommendation.actionLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
