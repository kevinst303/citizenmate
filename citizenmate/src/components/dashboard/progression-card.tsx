// ===== CitizenMate: ProgressionCard Dashboard Widget =====
// Displays user level, XP progress bar, level title, and XP source breakdown.
// Animates with framer-motion, respects prefers-reduced-motion.

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Award, BookOpen, Star, Sparkles, Trophy } from "lucide-react";
import { useProgression, type ProgressionData } from "@/hooks/use-progression";

// ── Motion variants ─────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const progressBar = {
  hidden: { scaleX: 0, transformOrigin: "left" as const },
  show: (progress: number) => ({
    scaleX: progress,
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" as const },
  }),
};

// ── Helpers ─────────────────────────────────────────────

function getLevelColor(level: number): string {
  if (level >= 9) return "from-amber-400 to-yellow-300";
  if (level >= 7) return "from-purple-400 to-pink-300";
  if (level >= 5) return "from-blue-400 to-cyan-300";
  if (level >= 3) return "from-teal-400 to-emerald-300";
  return "from-slate-400 to-gray-300";
}

function getLevelBadgeColor(level: number): string {
  if (level >= 9) return "bg-amber-100/80 text-amber-700 border-amber-200/60";
  if (level >= 7) return "bg-purple-100/80 text-purple-700 border-purple-200/60";
  if (level >= 5) return "bg-blue-100/80 text-blue-700 border-blue-200/60";
  if (level >= 3) return "bg-teal-100/80 text-teal-700 border-teal-200/60";
  return "bg-slate-100 text-slate-600 border-slate-200/60";
}

function getLevelIcon(level: number): string {
  if (level >= 9) return "👑";
  if (level >= 7) return "💎";
  if (level >= 5) return "⭐";
  if (level >= 3) return "🌟";
  return "✨";
}

function getSourceIcon(source: string): React.ReactNode {
  switch (source) {
    case "streak_milestone":
      return <FlameIcon />;
    case "badge_earned":
      return <Award className="w-3.5 h-3.5" />;
    case "quiz_complete":
      return <BookOpen className="w-3.5 h-3.5" />;
    case "daily_login":
      return <Zap className="w-3.5 h-3.5" />;
    case "test_completed":
      return <Trophy className="w-3.5 h-3.5" />;
    default:
      return <Star className="w-3.5 h-3.5" />;
  }
}

function FlameIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

function SourceLabel({ source }: { source: string }) {
  const labels: Record<string, string> = {
    streak_milestone: "Streak Milestones",
    badge_earned: "Badges Earned",
    quiz_complete: "Quiz Completions",
    daily_login: "Daily Login",
    test_completed: "Practice Tests",
    referral_bonus: "Referrals",
    admin_award: "Admin Awards",
  };
  return <>{labels[source] ?? source}</>;
}

// ── Skeleton Loader ─────────────────────────────────────

function ProgressionSkeleton() {
  return (
    <div className="bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-cm-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-cm-slate-100 rounded" />
          <div className="h-3 w-32 bg-cm-slate-100 rounded" />
        </div>
      </div>
      <div className="h-3 bg-cm-slate-100 rounded-full mb-3" />
      <div className="h-3 w-28 bg-cm-slate-100 rounded" />
    </div>
  );
}

// ── Level Badge ─────────────────────────────────────────

function LevelBadge({ level, levelTitle }: { level: number; levelTitle: string }) {
  const colorClass = getLevelBadgeColor(level);
  const icon = getLevelIcon(level);

  return (
    <motion.div
      variants={fadeItem}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${colorClass}`}
    >
      <span className="text-sm leading-none">{icon}</span>
      <span>{levelTitle}</span>
    </motion.div>
  );
}

// ── XP Progress Bar ─────────────────────────────────────

function XpProgressBar({ data }: { data: ProgressionData }) {
  const { progress, totalXp, currentLevelXp, nextLevelXp, isMaxLevel } = data;
  const colorClass = getLevelColor(data.level);

  return (
    <motion.div variants={fadeItem} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-cm-slate-500">
        <span>
          XP Progress
          {!isMaxLevel && (
            <span className="ml-1 text-cm-slate-400">
              ({totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()})
            </span>
          )}
        </span>
        <span className="font-medium text-cm-slate-700">
          {isMaxLevel ? "MAX LEVEL" : `${Math.round(progress * 100)}%`}
        </span>
      </div>
      <div className="h-2.5 bg-cm-slate-100 rounded-full overflow-hidden">
        <motion.div
          custom={progress}
          variants={progressBar}
          initial="hidden"
          animate="show"
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
}

// ── XP Source Breakdown ─────────────────────────────────

function XpSourceBreakdown({ xpBySource }: { xpBySource: Record<string, number> }) {
  const total = Object.values(xpBySource).reduce((sum, v) => sum + v, 0);
  if (total === 0) return null;

  const sorted = Object.entries(xpBySource).sort(([, a], [, b]) => b - a);

  return (
    <motion.div variants={fadeItem} className="space-y-2 pt-2 border-t border-cm-slate-100">
      <h4 className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider">
        XP Breakdown
      </h4>
      <div className="space-y-1.5">
        {sorted.slice(0, 5).map(([source, amount]) => {
          const pct = Math.round((amount / total) * 100);
          return (
            <div key={source} className="flex items-center gap-2 text-xs">
              <span className="flex-shrink-0 w-4 text-cm-slate-400">
                {getSourceIcon(source)}
              </span>
              <span className="flex-1 text-cm-slate-600 truncate">
                <SourceLabel source={source} />
              </span>
              <span className="font-medium text-cm-slate-800">
                {amount.toLocaleString()} XP
              </span>
              <span className="text-cm-slate-400 w-8 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Recent Activity ─────────────────────────────────────

function RecentActivity({ activities }: { activities: ProgressionData["recentActivity"] }) {
  if (activities.length === 0) return null;

  return (
    <motion.div variants={fadeItem} className="space-y-2 pt-2 border-t border-cm-slate-100">
      <h4 className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider">
        Recent XP
      </h4>
      <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin">
        {activities.slice(0, 6).map((act, i) => (
          <div
            key={`${act.createdAt}-${i}`}
            className="flex items-center gap-2 text-xs"
          >
            <span className="text-emerald-600 font-medium">+{act.amount}</span>
            <span className="text-cm-slate-500">
              <SourceLabel source={act.source} />
            </span>
            <span className="ml-auto text-cm-slate-400">
              {formatRelativeTime(act.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ── Main Component ──────────────────────────────────────

export function ProgressionCard() {
  const { data, isLoading, error } = useProgression();

  if (isLoading) return <ProgressionSkeleton />;

  if (error) {
    return (
      <div className="bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm">
        <p className="text-xs text-red-500/80">Could not load progression data.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header: Section Title */}
      <motion.div variants={fadeItem} className="flex items-center gap-2.5 mb-4">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-pink-300 text-white">
          <TrendingUp className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
          Your Progression
        </h2>
      </motion.div>

      {/* Level + Title row */}
      <motion.div variants={fadeItem} className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${getLevelColor(data.level)} bg-opacity-20`}
          >
            {getLevelIcon(data.level)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-cm-slate-900">
                Level {data.level}
              </h3>
              <LevelBadge level={data.level} levelTitle={data.levelTitle} />
            </div>
            <p className="text-xs text-cm-slate-500 mt-0.5">
              {data.totalXp.toLocaleString()} Total XP
            </p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-cm-slate-200" />
      </motion.div>

      {/* XP Progress Bar */}
      <XpProgressBar data={data} />

      {/* XP Source Breakdown */}
      <XpSourceBreakdown xpBySource={data.xpBySource} />

      {/* Recent Activity */}
      <RecentActivity activities={data.recentActivity} />
    </motion.div>
  );
}
