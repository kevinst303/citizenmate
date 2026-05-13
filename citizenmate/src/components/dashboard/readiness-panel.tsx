"use client";

import { motion } from "framer-motion";
import { ReadinessRing } from "@/components/dashboard/readiness-ring";
import { READINESS_ICONS } from "@/lib/dashboard-config";
import type { ReadinessData } from "@/lib/readiness";
import { useT } from "@/i18n/i18n-context";

// ===== Props =====

export interface ReadinessPanelProps {
  readiness: ReadinessData;
}

// ===== Component =====

export function ReadinessPanel({ readiness }: ReadinessPanelProps) {
  const { t } = useT();
  const ReadinessIcon = READINESS_ICONS[readiness.iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-cm-slate-200/60 p-6 flex flex-col items-center text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <ReadinessRing score={readiness.score} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-sm text-cm-slate-600"
      >
        {ReadinessIcon && (
          <ReadinessIcon className="w-4 h-4 inline-block mr-1 text-cm-slate-400" />
        )}
        {readiness.messageKey
          ? t(readiness.messageKey as Parameters<typeof t>[0], readiness.message)
          : readiness.message}
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
  );
}
