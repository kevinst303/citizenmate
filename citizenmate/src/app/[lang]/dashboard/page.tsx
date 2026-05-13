"use client"; // force turbopack rebuild

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, X, Lock } from "lucide-react";
import { useStudy } from "@/lib/study-context";
import { useTestDate } from "@/lib/test-date-context";
import { calculateReadiness, getQuizHistory, type ReadinessData, type QuizResult } from "@/lib/readiness";
import { StreakCard } from "@/components/dashboard/streak-card";
import { BadgeShowcase } from "@/components/dashboard/badge-showcase";
import { ProgressionCard } from "@/components/dashboard/progression-card";
import { AbsInsightsWidget } from "@/components/dashboard/abs-insights-widget";
import { LifeInAustraliaSection } from "@/components/dashboard/life-in-australia-section";
import { ReadinessPanel } from "@/components/dashboard/readiness-panel";
import { TestDateCard } from "@/components/dashboard/test-date-card";
import { TopicMasteryGrid } from "@/components/dashboard/topic-mastery-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { INSIGHT_ICONS } from "@/lib/dashboard-config";
import { getAIInsight } from "@/lib/insights";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { useAuth } from "@/lib/auth-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { useT } from "@/i18n/i18n-context";
import { useInactivityTrigger } from "@/hooks/use-inactivity-trigger";

// ===== Animations =====

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ===== Page =====

export default function DashboardPage() {
  const { progress } = useStudy();
  const { daysUntilTest, urgencyLevel, openModal, testDate } = useTestDate();
  const { user, profile, loading: authLoading } = useAuth();
  const { openModal: openUpgradeModal } = useUpgradeModal();
  const { t } = useT();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  useInactivityTrigger();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/${lang}/?auth=required`);
    }
  }, [user, authLoading, router]);

  const [hasMounted, setHasMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    setHasMounted(true);
    getQuizHistory().then(setQuizHistory);
  }, []);

  const readiness: ReadinessData = useMemo(
    () => calculateReadiness(quizHistory, progress),
    [progress, quizHistory],
  );

  const aiInsight = useMemo(() => getAIInsight(readiness), [readiness]);

  return (
    <div className="min-h-screen bg-cm-ice">
      <SubpageHero
        title={t("dashboard.hero_title")}
        breadcrumbs={[
          { label: t("dashboard.hero_breadcrumb_home"), href: "/" },
          { label: t("dashboard.hero_breadcrumb_dashboard") },
        ]}
        description={
          readiness.messageKey
            ? t(readiness.messageKey as Parameters<typeof t>[0], readiness.message)
            : readiness.message
        }
        bgImage="/generated/dash-welcome.webp"
        badge={t("dashboard.hero_badge")}
        curveColorClass="text-cm-ice"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 pb-20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

          {/* Upgrade Banner for Free Users */}
          {hasMounted && !profile.isPremium && showBanner && (
            <motion.div
              variants={item}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cm-slate-900 via-cm-navy-darker to-cm-slate-900 shadow-xl border border-white/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cm-gold to-amber-500 text-white shadow-lg shadow-amber-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5 tracking-tight">
                    {t("dashboard.unlock_premium")}
                  </h3>
                  <p className="text-sm text-cm-slate-200">{t("dashboard.unlock_premium_desc")}</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => openUpgradeModal("dashboard_banner")}
                  className="px-5 py-2.5 bg-white text-cm-navy-darker text-sm font-bold rounded-xl hover:bg-cm-ice transition-colors shadow-lg shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cm-slate-900"
                >
                  {t("dashboard.upgrade_now")}
                </button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-2 text-cm-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cm-slate-900"
                  aria-label={t("dashboard.dismiss_banner")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* AI Insight Banner */}
          <motion.div
            variants={item}
            className="ai-insight-card rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              "--insight-accent":
                aiInsight.variant === "warning"
                  ? "#D97706"
                  : aiInsight.variant === "success"
                    ? "#059669"
                    : "#0C2340",
            } as React.CSSProperties}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                aiInsight.variant === "warning"
                  ? "bg-amber-100 text-amber-600"
                  : aiInsight.variant === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-cm-navy-50 text-cm-navy"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-cm-gold uppercase tracking-wider">
                  {t("dashboard.ai_insight")}
                </span>
              </div>
              <p className="text-sm text-cm-slate-700 leading-relaxed">
                {(() => {
                  const Icon = INSIGHT_ICONS[aiInsight.iconName];
                  return Icon ? <Icon className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-cm-slate-500" /> : null;
                })()}
                {aiInsight.messageKey
                  ? t(aiInsight.messageKey as Parameters<typeof t>[0], aiInsight.message)
                  : aiInsight.message}
              </p>
            </div>
          </motion.div>

          {/* Row 1: Readiness + Test date */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <ReadinessPanel readiness={readiness} />
            <TestDateCard
              testDate={testDate}
              daysUntilTest={daysUntilTest}
              urgencyLevel={urgencyLevel}
              openModal={openModal}
            />
          </div>

          {/* Values alert */}
          {!readiness.valuesReady && readiness.totalQuizzesTaken > 0 && (
            <motion.div
              variants={item}
              className="flex items-center gap-3 px-5 py-4 bg-red-50/80 border border-red-100 rounded-2xl alert-gradient"
            >
              <AlertTriangle className="w-5 h-5 text-cm-red flex-shrink-0 animate-icon-pulse" />
              <div>
                <p className="text-sm font-semibold text-cm-red-dark">{t("dashboard.values_not_ready")}</p>
                <p className="text-xs text-cm-red-dark/80 mt-0.5">{t("dashboard.values_not_ready_desc")}</p>
              </div>
              <Link
                href={`/${lang}/study/australian-values`}
                className="flex-shrink-0 px-3 py-1.5 bg-cm-red text-white text-xs font-semibold rounded-lg hover:bg-cm-red/90 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-red focus-visible:ring-offset-2 shadow-sm"
              >
                {t("dashboard.study_values_now")}
              </Link>
            </motion.div>
          )}

          {/* Topic mastery */}
          <TopicMasteryGrid
            readiness={readiness}
            isPremium={hasMounted ? profile.isPremium : true}
            openUpgradeModal={openUpgradeModal}
          />

          {/* Streak Card */}
          <motion.div variants={item} className="dashboard-section-divider">
            <StreakCard />
          </motion.div>

          {/* Badge Showcase */}
          <motion.div variants={item} className="dashboard-section-divider">
            <BadgeShowcase />
          </motion.div>

          {/* Progression Card */}
          <motion.div variants={item} className="dashboard-section-divider">
            <ProgressionCard />
          </motion.div>

          {/* Quick actions */}
          <QuickActions recommendedAction={aiInsight.recommendedAction} />

          {/* Stats summary */}
          <StatsSummary readiness={readiness} />

          {/* ABS Data Integration */}
          <motion.div variants={item} className="dashboard-section-divider">
            <AbsInsightsWidget />
          </motion.div>

          {/* Life in Australia */}
          <motion.div variants={item} className="dashboard-section-divider">
            <LifeInAustraliaSection />
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}
