"use client";

import { use, useEffect } from "react";
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
  Lock,
} from "lucide-react";
import { studyTopics } from "@/data/study-content";
import { useStudy } from "@/lib/study-context";
import { StudySectionCard } from "@/components/study/study-section-card";
import { LanguageToggle } from "@/components/study/language-toggle";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import type { TopicCategory } from "@/lib/types";
import { toast } from "@/lib/toast";
import { usePremium } from "@/lib/auth-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";

const FREE_TOPIC_COUNT = 1;

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
  const { isPremium } = usePremium();
  const { openUpgradeModal } = useUpgradeModal();

  // Find topic
  const topicIndex = studyTopics.findIndex((t) => t.id === topicId);
  const topic = studyTopics[topicIndex];

  const isLocked = !isPremium && topicIndex >= FREE_TOPIC_COUNT;

  useEffect(() => {
    if (isLocked) {
      openUpgradeModal('study_limit');
      router.replace('/study');
    }
  }, [isLocked, openUpgradeModal, router]);

  // Redirect if invalid topic
  if (!topic || isLocked) {
    if (!topic) router.replace("/study");
    return null;
  }

  const Icon = TOPIC_ICONS[topic.id];
  const progress = getTopicProgress(topic.id);

  // Navigation
  const prevTopic = topicIndex > 0 ? studyTopics[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < studyTopics.length - 1 ? studyTopics[topicIndex + 1] : null;
  const isNextLocked = !isPremium && (topicIndex + 1) >= FREE_TOPIC_COUNT;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white border-b border-cm-slate-200 sticky top-16 z-30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-cm-slate-400 mb-3">
            <Link
              href="/study"
              className="hover:text-cm-teal transition-colors cursor-pointer"
            >
              Study
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cm-slate-700 font-medium">{topic.title}</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-teal text-white">
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
              colorClass="bg-cm-teal"
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
              className="flex items-center gap-2 px-4 py-3 bg-white border border-[#E9ECEF] rounded-[15px] hover:border-cm-teal/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
              style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
            >
              <ArrowLeft className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-teal transition-colors" />
              <div>
                <div className="text-xs text-cm-slate-400">Previous</div>
                <div className="text-sm font-heading font-semibold text-cm-slate-700 group-hover:text-cm-teal transition-colors">
                  {prevTopic.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextTopic ? (
            isNextLocked ? (
              <button
                onClick={() => openUpgradeModal('study_limit')}
                className="flex items-center gap-2 px-4 py-3 bg-cm-red/10 border border-cm-red/20 rounded-[15px] hover:bg-cm-red/20 transition-all duration-200 cursor-pointer group text-right ml-auto"
              >
                <div>
                  <div className="text-xs text-cm-red/70 font-semibold flex items-center justify-end gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </div>
                  <div className="text-sm font-heading font-semibold text-cm-red">
                    Unlock {nextTopic.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cm-red group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href={`/study/${nextTopic.id}`}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-[#E9ECEF] rounded-[15px] hover:border-cm-teal/40 hover:shadow-md transition-all duration-200 cursor-pointer group text-right ml-auto"
                style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
              >
                <div>
                  <div className="text-xs text-cm-slate-400">Next</div>
                  <div className="text-sm font-heading font-semibold text-cm-slate-700 group-hover:text-cm-teal transition-colors">
                    {nextTopic.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-teal transition-colors" />
              </Link>
            )
          ) : (
            <Link
              href="/study"
              className="flex items-center gap-2 px-4 py-3 bg-cm-teal text-white rounded-[15px] hover:opacity-90 transition-all duration-200 cursor-pointer font-heading font-semibold text-sm"
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
