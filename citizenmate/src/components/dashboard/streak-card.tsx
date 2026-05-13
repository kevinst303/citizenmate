// ===== CitizenMate: StreakCard Dashboard Widget =====
// Modern redesign with glassmorphism, milestone ring, responsive calendar,
// and PWA-aware layout. Respects prefers-reduced-motion.

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Snowflake, Zap, Award, CalendarDays, Clock, TrendingUp } from "lucide-react";
import { useDailyStreak } from "@/hooks/use-daily-streak";

// ── Motion variants (respects reduced-motion via framer-motion) ──

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ── Milestone Progress Ring ───────────────────────────────────────

const MILESTONES = [7, 14, 21, 30, 60, 100];

const MILESTONE_MESSAGES: Record<number, string> = {
  7: "One week strong! 🎯",
  14: "Two-week warrior! ⚔️",
  21: "Three weeks! 💪",
  30: "A whole month! 🌟",
  60: "Two months! ⚡",
  100: "Legendary! 🔥",
};

function MilestoneRing({ currentStreak }: { currentStreak: number }) {
  const nextMilestone = MILESTONES.find((m) => m > currentStreak) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find((m) => m <= currentStreak) ?? 0;
  const progress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (clampedProgress / 100) * circumference;

  const milestoneIndex = MILESTONES.indexOf(nextMilestone);
  const ringColors = [
    "stroke-orange-500",
    "stroke-amber-500",
    "stroke-yellow-500",
    "stroke-amber-400",
    "stroke-orange-400",
    "stroke-red-400",
  ];
  const ringColor = ringColors[milestoneIndex] ?? "stroke-orange-500";

  return (
    <div className="relative flex-shrink-0" aria-label={`Streak progress: ${currentStreak} of ${nextMilestone} days`}>
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          stroke="currentColor"
          className="text-cm-slate-100"
          strokeWidth="5"
        />
        {/* Progress ring */}
        <motion.circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          className={ringColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-heading font-bold text-cm-slate-900 tabular-nums leading-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          {currentStreak}
        </motion.span>
        <span className="text-[9px] font-semibold text-cm-slate-400 uppercase tracking-wider mt-0.5">
          days
        </span>
      </div>
    </div>
  );
}

// ── Streak Calendar (responsive, horizontal-scroll on mobile) ─────

function StreakCalendar({
  lastActivityDate,
  frozenDays,
}: {
  lastActivityDate: string | null;
  frozenDays: number;
}) {
  const days = useMemo(() => {
    const result: { date: string; label: string; status: "active" | "frozen" | "missed" | "future" | "today" }[] = [];
    const today = new Date();
    let remainingFrozen = frozenDays;

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayLabel = date.toLocaleDateString("en-AU", { weekday: "short" }).slice(0, 2);

      const isToday = i === 0;
      const isFuture = i > 0;
      const isActive = lastActivityDate
        ? new Date(lastActivityDate).toISOString().slice(0, 10) >= dateStr
        : false;

      let status: "active" | "frozen" | "missed" | "future" | "today";
      if (isToday) {
        status = "today";
      } else if (isFuture) {
        status = "future";
      } else if (isActive && remainingFrozen > 0) {
        status = "frozen";
        remainingFrozen--;
      } else if (isActive) {
        status = "active";
      } else {
        status = "missed";
      }

      if (!lastActivityDate && !isToday && !isFuture) {
        status = "missed";
      }

      result.push({ date: dateStr, label: dayLabel, status });
    }

    return result;
  }, [lastActivityDate, frozenDays]);

  const statusStyles: Record<string, string> = {
    today: "bg-gradient-to-b from-orange-400 to-orange-500 text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-300",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    frozen: "bg-sky-50 text-sky-700 border border-sky-200",
    future: "bg-cm-slate-50 text-cm-slate-300 border border-cm-slate-100",
    missed: "bg-red-50/60 text-red-400 border border-red-100/60",
  };

  const statusEmoji: Record<string, string> = {
    today: "🔥",
    active: "",
    frozen: "❄️",
    missed: "",
    future: "",
  };

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
      <div
        className="flex gap-1.5 min-w-max justify-start sm:justify-center"
        role="list"
        aria-label="Streak calendar - last 14 days"
      >
        {days.map((day, idx) => (
          <motion.div
            key={day.date}
            role="listitem"
            aria-label={`${day.label} - ${
              day.status === "today" ? "Today" : day.status === "active" ? "Active" : day.status === "frozen" ? "Frozen" : day.status === "future" ? "Future" : "Missed"
            }`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 * idx, duration: 0.25 }}
            className={`w-8 h-11 sm:w-9 sm:h-12 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition-all duration-200 ${
              statusStyles[day.status] ?? ""
            } ${day.status === "today" ? "scale-110 sm:scale-100" : ""}`}
          >
            <span className="mb-0.5 leading-none">{day.label}</span>
            <span className="leading-none text-xs">
              {statusEmoji[day.status] ||
                (day.status === "missed" ? "·" : "")}
              {day.status === "future" && ""}
              {day.status === "active" && !statusEmoji[day.status] && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Stat Pill (horizontal layout for better mobile density) ────────

function StatPill({
  value,
  label,
  icon: Icon,
  color,
  bg,
  ringColor,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  ringColor: string;
}) {
  return (
    <motion.div
      variants={fadeItem}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg} border border-cm-slate-100/80 transition-all duration-200 hover:shadow-sm group`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color} ring-1 ${ringColor} ring-offset-1`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <motion.p
          className="text-lg sm:text-xl font-heading font-bold text-cm-slate-900 tabular-nums leading-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          {value}
        </motion.p>
        <p className="text-[11px] text-cm-slate-500 font-medium leading-tight mt-0.5 whitespace-nowrap">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ── XP Reward Toast ──────────────────────────────────────────────

function XpToast({
  xpRewards,
  newlyEarnedBadges,
}: {
  xpRewards: { amount: number; source: string; reason: string }[];
  newlyEarnedBadges: { id: string; name: string; description: string; icon: string }[];
}) {
  const totalXp = xpRewards.reduce((sum, r) => sum + r.amount, 0);
  if (totalXp === 0 && newlyEarnedBadges.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Award className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          Rewards Earned
        </span>
      </div>
      {totalXp > 0 && (
        <p className="text-sm text-cm-slate-700">
          <span className="font-bold text-amber-600">+{totalXp} XP</span>
          {xpRewards.map((r, i) => (
            <span key={i} className="text-cm-slate-500">
              {i === 0 ? " — " : ", "}
              {r.reason}
            </span>
          ))}
        </p>
      )}
      {newlyEarnedBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {newlyEarnedBadges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold"
            >
              <Award className="w-3 h-3" />
              {badge.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export function StreakCard() {
  const {
    streak,
    isLoading,
    isCheckedInToday,
    freezeConsumed,
    freezeAwarded,
    xpRewards,
    newlyEarnedBadges,
    error,
  } = useDailyStreak();

  if (isLoading && !streak) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm"
      >
        {/* Decorative gradient blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cm-slate-100 animate-pulse" />
          <div className="h-5 w-32 bg-cm-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-cm-slate-50 rounded-xl animate-pulse" />
          <div className="h-16 bg-cm-slate-50 rounded-xl animate-pulse" />
          <div className="h-20 bg-cm-slate-50 rounded-xl animate-pulse" />
        </div>
      </motion.div>
    );
  }

  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const freezeCount = streak?.streak_freeze_available ?? 0;
  const frozenDays = streak?.frozen_days ?? 0;
  const lastActivityDate = streak?.last_activity_date ?? null;

  const milestoneMessage = currentStreak >= 7
    ? Object.entries(MILESTONE_MESSAGES)
        .reverse()
        .find(([days]) => currentStreak >= Number(days))?.[1]
    : null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden bg-white border border-cm-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* ── Decorative background elements ── */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        {/* ── Header ── */}
        <motion.div variants={fadeItem} className="flex items-center gap-2.5 mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-cm-slate-900 text-lg sm:text-xl leading-tight">
              Study Streak
            </h2>
            {milestoneMessage && (
              <p className="text-[11px] text-cm-slate-400 font-medium">
                {milestoneMessage}
              </p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {isCheckedInToday && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shadow-sm"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Checked in</span>
                <span className="sm:hidden">✓</span>
              </motion.span>
            )}
            {freezeConsumed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold shadow-sm"
              >
                <Snowflake className="w-3 h-3" />
                <span className="hidden sm:inline">Freeze used</span>
                <span className="sm:hidden">❄️</span>
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* ── Error state ── */}
        {error && (
          <motion.div variants={fadeItem} className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </motion.div>
        )}

        {/* ── Main streak display: Ring + Stats ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-5">
          {/* Milestone ring (centered on mobile, left-aligned on desktop) */}
          <motion.div variants={fadeItem} className="flex-shrink-0">
            <MilestoneRing currentStreak={currentStreak} />
          </motion.div>

          {/* Stats pills */}
          <div className="flex-1 grid grid-cols-1 gap-2.5 w-full">
            <StatPill
              value={longestStreak}
              label="Best Streak"
              icon={TrendingUp}
              color="bg-amber-100 text-amber-600"
              bg="bg-amber-50/60"
              ringColor="ring-amber-200/50"
            />
            <StatPill
              value={freezeCount}
              label="Freezes Available"
              icon={Snowflake}
              color="bg-sky-100 text-sky-600"
              bg="bg-sky-50/60"
              ringColor="ring-sky-200/50"
            />
          </div>
        </div>

        {/* ── Freeze Awarded indicator ── */}
        {freezeAwarded && (
          <motion.div
            variants={fadeItem}
            className="mb-4 p-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 flex items-center gap-2.5"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-sky-700 font-semibold">Freeze Token Earned!</p>
              <p className="text-[11px] text-sky-600">+1 for reaching a 7-day milestone</p>
            </div>
          </motion.div>
        )}

        {/* ── Streak Calendar ── */}
        <motion.div variants={fadeItem} className="mb-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-cm-slate-400" />
              <span className="text-[11px] font-bold text-cm-slate-500 uppercase tracking-wider">
                Last 14 Days
              </span>
            </div>
            {/* Milestone markers (desktop only) */}
            <div className="hidden sm:flex items-center gap-3">
              {MILESTONES.filter((m) => m <= 30).map((m) => (
                <div key={m} className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      currentStreak >= m ? "bg-orange-400" : "bg-cm-slate-200"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold transition-colors duration-300 ${
                      currentStreak >= m ? "text-orange-500" : "text-cm-slate-300"
                    }`}
                  >
                    {m}d
                  </span>
                </div>
              ))}
            </div>
          </div>
          <StreakCalendar lastActivityDate={lastActivityDate} frozenDays={frozenDays} />
          {/* Legend */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2.5 text-[10px] text-cm-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-emerald-50 border border-emerald-200" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-sky-50 border border-sky-200" /> Frozen
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-red-50/60 border border-red-100/60" /> Missed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-gradient-to-b from-orange-400 to-orange-500" /> Today
            </span>
          </div>
        </motion.div>

        {/* ── XP Rewards + Badges Toast ── */}
        <XpToast xpRewards={xpRewards} newlyEarnedBadges={newlyEarnedBadges} />

        {/* ── Collapsible "How it works" ── */}
        <motion.details
          variants={fadeItem}
          className="mt-3 group/details"
          open={currentStreak === 0}
        >
          <summary className="flex items-center gap-2 p-2.5 rounded-xl bg-cm-navy-50/50 border border-cm-slate-100 cursor-pointer hover:bg-cm-navy-50 transition-colors list-none marker:hidden">
            <Clock className="w-3.5 h-3.5 text-cm-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-cm-slate-500">
              How Streaks Work
            </span>
            <svg
              className="ml-auto w-3.5 h-3.5 text-cm-slate-400 transition-transform duration-200 group-open/details:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-2 p-3 rounded-xl bg-cm-navy-50/40 border border-cm-slate-50">
            <p className="text-[11px] text-cm-slate-500 leading-relaxed">
              <span className="font-semibold text-cm-slate-700">How it works:</span>{" "}
              Check in daily to maintain your streak. Miss a day? A{" "}
              <span className="font-semibold text-sky-600">freeze token</span> protects your streak
              from breaking. Earn{" "}
              <span className="font-semibold text-amber-600">1 freeze per 7-day milestone</span>{" "}
              (max 3). Longer streaks unlock XP bonuses and badges!
            </p>
          </div>
        </motion.details>
      </div>

      {/* ── Bottom milestone progress bar ── */}
      <div className="h-1 bg-cm-slate-50">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 rounded-r-full"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, (currentStreak / (MILESTONES[MILESTONES.length - 1] ?? 100)) * 100)}%`,
          }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
