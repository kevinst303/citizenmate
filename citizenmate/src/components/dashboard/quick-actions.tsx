"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  ClipboardCheck,
  BookOpen,
  Heart,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useT } from "@/i18n/i18n-context";

// ===== Types =====

interface QuickAction {
  icon: typeof Brain;
  title: string;
  desc: string;
  href: string;
  color: string;
  bgIcon: string;
  borderHover: string;
}

// ===== Props =====

export interface QuickActionsProps {
  recommendedAction?: string;
}

// ===== Component =====

export function QuickActions({ recommendedAction }: QuickActionsProps) {
  const { t } = useT();

  const actions: QuickAction[] = [
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="dashboard-section-divider"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-purple-600">
          <Zap className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
          {t("dashboard.quick_actions")}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, actionIdx) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 * actionIdx,
              type: "spring",
              stiffness: 150,
              damping: 16,
            }}
          >
            <Link
              href={action.href}
              className={`group flex items-center gap-4 p-5 bg-white border border-cm-slate-200/60 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${action.borderHover} relative overflow-hidden`}
            >
              {/* Recommended badge */}
              {recommendedAction && action.title === recommendedAction && (
                <span className="absolute top-2.5 right-2.5 recommended-pulse inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cm-gold text-white text-[10px] font-bold shadow-sm z-10">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("dashboard.recommended")}
                </span>
              )}

              {/* Hover subtle background highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out z-0" />

              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${action.bgIcon} ${action.color} transition-transform duration-300 group-hover:scale-110 z-10`}
              >
                <action.icon className="w-5 h-5" />
              </div>
              <div className="z-10 relative">
                <h3 className="font-heading font-semibold text-sm text-cm-slate-900 mb-0.5">
                  {action.title}
                </h3>
                <p className="text-xs text-cm-slate-500">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-cm-slate-400 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-cm-navy transition-all duration-300 z-10" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
