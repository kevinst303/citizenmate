"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe,
  Scale,
  Landmark,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { studyTopics } from "@/data/study-content";
import { useStudy } from "@/lib/study-context";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import type { TopicCategory } from "@/lib/types";

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

export default function StudyPage() {
  const { getTopicProgress, getOverallProgress } = useStudy();
  const overall = getOverallProgress();

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cm-navy via-cm-navy-light to-cm-navy-lighter text-white overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-12 w-32 h-32 rounded-full bg-cm-gold/10 blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -12, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-28 right-16 w-20 h-20 rounded-full bg-cm-sky/10 blur-lg"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-8 left-1/3 w-16 h-16 rounded-full bg-cm-eucalyptus/10 blur-lg"
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
              <BookOpen className="w-4 h-4" />
              Study Guide
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight mb-4">
              Study{" "}
              <span className="text-cm-gold">Our Common Bond</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
              Browse the official study content in English and Chinese.
              Track your progress topic by topic, mate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overall progress card */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-cm-slate-200 p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-eucalyptus-light text-cm-eucalyptus">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-cm-slate-900">
                  Overall Progress
                </h2>
                <p className="text-xs text-cm-slate-500">
                  {overall.completed} of {overall.total} sections completed
                </p>
              </div>
            </div>
            <span className="text-2xl font-heading font-extrabold text-cm-eucalyptus">
              {overall.percentage}%
            </span>
          </div>
          <StudyProgressBar
            completed={overall.completed}
            total={overall.total}
            colorClass="bg-cm-eucalyptus"
          />
        </motion.div>
      </section>

      {/* Topic cards */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-heading font-bold text-cm-slate-900 mb-8"
        >
          Choose a Topic
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2"
        >
          {studyTopics.map((topic) => {
            const Icon = TOPIC_ICONS[topic.id];
            const colors = TOPIC_COLORS[topic.id];
            const progress = getTopicProgress(topic.id);

            return (
              <motion.div key={topic.id} variants={item}>
                <Link
                  href={`/study/${topic.id}`}
                  className="group block bg-white rounded-2xl border-2 border-cm-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-cm-navy transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  {/* Icon + badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {topic.id === "australian-values" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cm-red-light text-cm-red text-xs font-semibold">
                        <Heart className="w-3 h-3" />
                        Must pass 5/5
                      </span>
                    )}
                  </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-heading font-bold text-cm-slate-900 mb-1.5 group-hover:text-cm-navy transition-colors duration-200">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-cm-slate-500 leading-relaxed mb-5">
                    {topic.description}
                  </p>

                  {/* Progress */}
                  <StudyProgressBar
                    completed={progress.completed}
                    total={progress.total}
                    label={`${topic.sections.length} sections`}
                    colorClass={colors.bar}
                    size="sm"
                  />

                  {/* CTA */}
                  <div className="flex items-center justify-center gap-2 w-full mt-5 py-3 bg-cm-navy text-white font-heading font-semibold rounded-xl group-hover:bg-cm-navy-light transition-all duration-200 group-hover:gap-3">
                    {progress.completed > 0 ? "Continue Studying" : "Start Studying"}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Study tips */}
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
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-heading font-bold text-cm-navy">
              Study Tips
            </h3>
          </div>
          <ul className="space-y-3.5 text-sm text-cm-slate-600">
            {[
              {
                icon: Heart,
                text: (
                  <>
                    <strong>Focus on Australian Values</strong> — all 5 values
                    questions must be correct to pass. Study this topic
                    thoroughly.
                  </>
                ),
              },
              {
                icon: Globe,
                text: (
                  <>
                    <strong>Use bilingual mode</strong> — toggle between English
                    and Chinese to understand concepts in both languages.
                  </>
                ),
              },
              {
                icon: BookOpen,
                text: (
                  <>
                    <strong>Review key facts</strong> — each section highlights
                    the most important points you need to remember.
                  </>
                ),
              },
              {
                icon: Sparkles,
                text: (
                  <>
                    <strong>Track your progress</strong> — mark sections as
                    complete to see your overall readiness.
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
