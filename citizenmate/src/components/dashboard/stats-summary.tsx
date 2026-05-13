"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  ClipboardCheck,
  Trophy,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useT } from "@/i18n/i18n-context";
import { STAT_ACCENTS } from "@/lib/dashboard-config";
import type { ReadinessData } from "@/lib/readiness";

// ===== Types =====

interface StatCard {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  bg: string;
  iconColor: string;
  accent: string;
}

// ===== Props =====

export interface StatsSummaryProps {
  readiness: ReadinessData;
}

// ===== Component =====

export function StatsSummary({ readiness }: StatsSummaryProps) {
  const { t } = useT();

  const stats: StatCard[] = [
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
        : "\u2014",
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="dashboard-section-divider"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-sky-light text-cm-sky">
          <Gauge className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
          {t("dashboard.your_stats")}
        </h2>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, statIdx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.08 * statIdx,
              type: "spring",
              stiffness: 150,
              damping: 14,
            }}
            whileHover={{
              y: -4,
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            className="rounded-2xl border border-cm-slate-200/60 bg-white p-4 text-center shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-default"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-80"
              style={{ backgroundColor: stat.accent }}
            />
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
  );
}
