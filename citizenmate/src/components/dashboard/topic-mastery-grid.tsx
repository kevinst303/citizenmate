"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, TrendingUp, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/i18n-context";
import { useParams } from "next/navigation";
import { StudyProgressBar } from "@/components/study/study-progress-bar";
import { TOPIC_ICONS, TOPIC_COLORS } from "@/lib/dashboard-config";
import type { ReadinessData } from "@/lib/readiness";

// ===== Props =====

export interface TopicMasteryGridProps {
  readiness: ReadinessData;
  isPremium: boolean;
  openUpgradeModal: (source?: string) => void;
}

// ===== Component =====

export function TopicMasteryGrid({
  readiness,
  isPremium,
  openUpgradeModal,
}: TopicMasteryGridProps) {
  const { t } = useT();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
        {!isPremium ? (
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
                          {t(
                            topic.labelKey as Parameters<typeof t>[0],
                            topic.label
                          )}
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
                        <span>
                          {t("dashboard.quiz_label")}: {topic.quizAccuracy}%
                        </span>
                        <span>
                          {t("dashboard.study_label")}: {topic.studyCompletion}%
                        </span>
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
              <h3 className="text-xl font-heading font-bold text-cm-slate-900 mb-2 text-center drop-shadow-sm">
                {t("dashboard.analytics_locked")}
              </h3>
              <p className="text-sm text-cm-slate-600 font-medium mb-6 text-center max-w-[250px] drop-shadow-sm">
                {t("dashboard.analytics_locked_desc")}
              </p>
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
                        {t(
                          topic.labelKey as Parameters<typeof t>[0],
                          topic.label
                        )}
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
                      <span>
                        {t("dashboard.quiz_label")}: {topic.quizAccuracy}%
                      </span>
                      <span>
                        {t("dashboard.study_label")}: {topic.studyCompletion}%
                      </span>
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
  );
}
