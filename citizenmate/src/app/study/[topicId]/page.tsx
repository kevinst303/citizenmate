"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Scale,
  Landmark,
  Heart,
  ChevronRight,
} from "lucide-react";
import { studyTopics } from "@/data/study-content";
import { useStudy } from "@/lib/study-context";
import { StudySectionCard } from "@/components/study/study-section-card";
import { LanguageToggle } from "@/components/study/language-toggle";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import type { TopicCategory } from "@/lib/types";
import { toast } from "@/lib/toast";

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

export default function TopicStudyPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const router = useRouter();
  const {
    language,
    setLanguage,
    toggleSection,
    isSectionComplete,
    getTopicProgress,
  } = useStudy();

  // Find topic
  const topicIndex = studyTopics.findIndex((t) => t.id === topicId);
  const topic = studyTopics[topicIndex];

  // Redirect if invalid topic
  if (!topic) {
    router.replace("/study");
    return null;
  }

  const Icon = TOPIC_ICONS[topic.id];
  const progress = getTopicProgress(topic.id);

  // Navigation
  const prevTopic = topicIndex > 0 ? studyTopics[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < studyTopics.length - 1 ? studyTopics[topicIndex + 1] : null;

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Header */}
      <section className="bg-white border-b border-cm-slate-200 sticky top-16 z-30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-cm-slate-400 mb-3">
            <Link
              href="/study"
              className="hover:text-cm-navy transition-colors cursor-pointer"
            >
              Study
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cm-slate-700 font-medium">{topic.title}</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-navy text-white">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-cm-slate-900">
                  {language === "zh" ? topic.titleZh : topic.title}
                </h1>
                <p className="text-xs text-cm-slate-500">
                  {progress.completed}/{progress.total} sections completed
                </p>
              </div>
            </div>
            <LanguageToggle value={language} onChange={setLanguage} />
          </div>

          {/* Progress */}
          <div className="mt-3">
            <StudyProgressBar
              completed={progress.completed}
              total={progress.total}
              colorClass="bg-cm-eucalyptus"
              size="sm"
            />
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {topic.id === "australian-values" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 mb-6 bg-cm-red-light border border-cm-red/20 rounded-xl"
          >
            <Heart className="w-4 h-4 text-cm-red flex-shrink-0" />
            <p className="text-sm text-cm-red-dark font-medium">
              All 5 values questions must be answered correctly to pass the citizenship test. Study this topic carefully.
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          {topic.sections.map((section, idx) => (
            <StudySectionCard
              key={section.id}
              section={section}
              language={language}
              isComplete={isSectionComplete(section.id)}
              onToggleComplete={() => {
                const wasComplete = isSectionComplete(section.id);
                toggleSection(section.id);
                if (!wasComplete) {
                  // Check if this completes the topic
                  const newCompleted = progress.completed + 1;
                  if (newCompleted >= progress.total) {
                    toast.achievement(
                      `${topic.title} complete! 🌟`,
                      "You’ve studied every section in this topic. Amazing work!"
                    );
                  } else {
                    toast.success(
                      "Section completed ✅",
                      `${language === "zh" ? section.titleZh : section.title} — ${newCompleted}/${progress.total} done`
                    );
                  }
                } else {
                  toast.info("Section unmarked", "You can revisit it anytime.");
                }
              }}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* Topic navigation */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between gap-4">
          {prevTopic ? (
            <Link
              href={`/study/${prevTopic.id}`}
              className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-cm-slate-200 rounded-xl hover:border-cm-navy hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-navy transition-colors" />
              <div>
                <div className="text-xs text-cm-slate-400">Previous</div>
                <div className="text-sm font-heading font-semibold text-cm-slate-700 group-hover:text-cm-navy transition-colors">
                  {prevTopic.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextTopic ? (
            <Link
              href={`/study/${nextTopic.id}`}
              className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-cm-slate-200 rounded-xl hover:border-cm-navy hover:shadow-md transition-all duration-200 cursor-pointer group text-right"
            >
              <div>
                <div className="text-xs text-cm-slate-400">Next</div>
                <div className="text-sm font-heading font-semibold text-cm-slate-700 group-hover:text-cm-navy transition-colors">
                  {nextTopic.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-navy transition-colors" />
            </Link>
          ) : (
            <Link
              href="/study"
              className="flex items-center gap-2 px-4 py-3 bg-cm-navy text-white rounded-xl hover:bg-cm-navy-light transition-all duration-200 cursor-pointer font-heading font-semibold text-sm"
            >
              Back to Study Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
