"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe,
  Scale,
  Landmark,
  Heart,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { studyTopics } from "@/data/study-content";
import { useStudy } from "@/lib/study-context";
import { usePremium } from "@/lib/auth-context";
import { PremiumBadge } from "@/components/shared/premium-gate";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import type { TopicCategory } from "@/lib/types";
import { useT } from "@/i18n/i18n-context";

import { SubpageHero } from "@/components/shared/subpage-hero";

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

const TOPIC_COLORS: Record<TopicCategory, { bg: string; text: string; bar: string; image: string }> = {
  "australia-people": {
    bg: "bg-cm-sky-light",
    text: "text-cm-sky",
    bar: "bg-cm-sky",
    image: "topic-people.webp",
  },
  "democratic-beliefs": {
    bg: "bg-cm-navy-50",
    text: "text-cm-navy",
    bar: "bg-cm-navy",
    image: "topic-beliefs.webp",
  },
  "government-law": {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold",
    bar: "bg-cm-gold",
    image: "topic-gov.webp",
  },
  "australian-values": {
    bg: "bg-cm-red-light",
    text: "text-cm-red",
    bar: "bg-cm-red",
    image: "topic-people.webp", // fallback since we generated 3
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

// First topic is free, rest require premium
const FREE_TOPIC_COUNT = 1;

export default function StudyPage() {
  const { getTopicProgress, getOverallProgress } = useStudy();
  const { isPremium, upgrade } = usePremium();
  const overall = getOverallProgress();
  const { t } = useT();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <SubpageHero
        title={t("study.hero_title", "Study Our Common Bond")}
        breadcrumbs={[
          { label: t("study.hero_breadcrumb_home", "Home"), href: "/" },
          { label: t("study.hero_breadcrumb_guide", "Study Guide") },
        ]}
        description={t("study.hero_desc", "Browse the official study content in English and Chinese. Track your progress topic by topic, mate.")}
        bgImage="/generated/study-header.webp"
        badge={t("study.hero_badge", "Study Guide")}
      />

      {/* Overall progress card */}
      <section className="mx-auto max-w-[1140px] px-4 sm:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, type: "spring" as const, stiffness: 120, damping: 14 }}
          whileHover={{ y: -3, scale: 1.01, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
          className="bg-white border border-[#E9ECEF] rounded-[15px] p-5 sm:p-6 cursor-default"
          style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-teal/10 text-cm-teal">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-cm-slate-900">
                  {t("study.overall_progress", "Overall Progress")}
                </h2>
                <p className="text-xs text-cm-slate-500">
                  {t("study.sections_completed", "{completed} of {total} sections completed").replace("{completed}", String(overall.completed)).replace("{total}", String(overall.total))}
                </p>
              </div>
            </div>
            <span className="text-2xl font-heading font-extrabold text-cm-teal">
              {overall.percentage}%
            </span>
          </div>
          <StudyProgressBar
            completed={overall.completed}
            total={overall.total}
            colorClass="bg-cm-teal"
          />
        </motion.div>
      </section>

      {/* Topic cards */}
      <section className="mx-auto max-w-[1140px] px-4 sm:px-6 py-12 sm:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-heading font-bold text-cm-slate-900 mb-8"
        >
          {t("study.choose_topic", "Choose a Topic")}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2"
        >
          {studyTopics.map((topic, index) => {
            const Icon = TOPIC_ICONS[topic.id];
            const colors = TOPIC_COLORS[topic.id];
            const progress = getTopicProgress(topic.id);
            const isLocked = !isPremium && index >= FREE_TOPIC_COUNT;

            return (
              <motion.div key={topic.id} variants={item}
                whileHover={{ y: -6, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.99 }}
              >
                {isLocked ? (
                  <button
                    onClick={upgrade}
                    className="group flex flex-col h-full w-full text-left rounded-[15px] bg-white border border-[#E9ECEF] transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
                  >
                    {/* Topic Image Header */}
                    <div className="relative h-40 w-full bg-cm-navy-50 overflow-hidden">
                      <Image
                        src={`/generated/${colors.image}`}
                        alt={topic.title}
                        fill
                        className="object-cover opacity-50 grayscale"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 right-4 z-10">
                        <PremiumBadge />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col p-6">
                      <div className="mb-4 -mt-10 relative z-10">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-slate-100 text-cm-slate-400 shadow-md border-2 border-white`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-cm-slate-400 mb-1.5">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-cm-slate-300 leading-relaxed mb-5">
                        {topic.description}
                      </p>
                      <div className="mt-auto flex items-center justify-center gap-2 w-full py-3 font-heading font-semibold rounded-xl bg-cm-red/10 text-cm-red transition-all duration-200">
                        <Lock className="w-4 h-4" />
                        {t("study.unlock_with_sprint", "Unlock with Sprint Pass")}
                      </div>
                    </div>
                  </button>
                ) : (
                <Link
                  href={`/study/${topic.id}`}
                  className="group flex flex-col h-full rounded-[15px] bg-white border border-[#E9ECEF] hover:border-cm-teal/40 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
                >
                  {/* Topic Image Header */}
                  <div className="relative h-40 w-full bg-cm-navy-50 overflow-hidden">
                    <Image
                      src={`/generated/${colors.image}`}
                      alt={topic.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    
                    {/* Badge over image */}
                    {topic.id === "australian-values" && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cm-red/90 text-white backdrop-blur-sm text-xs font-semibold shadow-sm">
                          <Heart className="w-3 h-3" />
                          {t("study.must_pass_5of5", "Must pass 5/5")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col p-6">
                    {/* Icon */}
                    <div className="mb-4 -mt-10 relative z-10">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.text} shadow-md border-2 border-white`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-heading font-bold text-cm-slate-900 mb-1.5 group-hover:text-cm-teal transition-colors duration-200">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-cm-slate-500 leading-relaxed mb-5">
                    {topic.description}
                  </p>

                  {/* Progress */}
                  <StudyProgressBar
                    completed={progress.completed}
                    total={progress.total}
                    label={`${topic.sections.length} ${t("study.sections_label", "{count} sections").replace("{count}", String(topic.sections.length))}`}
                    colorClass={colors.bar}
                    size="sm"
                  />

                  {/* CTA */}
                  <div className="flex items-center justify-center gap-2 w-full mt-5 py-3 bg-cm-teal text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-all duration-200 group-hover:gap-3">
                    {progress.completed > 0 ? t("study.continue_studying", "Continue Studying") : t("study.start_studying", "Start Studying")}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                  </div>
                </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Study tips */}
      <section className="mx-auto max-w-[1140px] px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#E9ECEF] rounded-[15px] p-6 sm:p-8"
          style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-teal text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-heading font-bold text-cm-teal">
              {t("study.study_tips", "Study Tips")}
            </h3>
          </div>
          <ul className="space-y-3.5 text-sm text-cm-slate-600">
            {[
              {
                icon: Heart,
                titleKey: "study.tip_values_title",
                titleFallback: "Focus on Australian Values",
                descKey: "study.tip_values_desc",
                descFallback: "all 5 values questions must be correct to pass. Study this topic thoroughly.",
              },
              {
                icon: Globe,
                titleKey: "study.tip_bilingual_title",
                titleFallback: "Use bilingual mode",
                descKey: "study.tip_bilingual_desc",
                descFallback: "toggle between English and Chinese to understand concepts in both languages.",
              },
              {
                icon: BookOpen,
                titleKey: "study.tip_review_title",
                titleFallback: "Review key facts",
                descKey: "study.tip_review_desc",
                descFallback: "each section highlights the most important points you need to remember.",
              },
              {
                icon: Sparkles,
                titleKey: "study.tip_progress_title",
                titleFallback: "Track your progress",
                descKey: "study.tip_progress_desc",
                descFallback: "mark sections as complete to see your overall readiness.",
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
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-cm-teal/10 text-cm-teal mt-0.5">
                  <tip.icon className="w-3.5 h-3.5" />
                </span>
                <span>
                  <strong>{t(tip.titleKey, tip.titleFallback)}</strong> &mdash; {t(tip.descKey, tip.descFallback)}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
