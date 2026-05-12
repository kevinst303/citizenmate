// ===== CitizenMate: StreakCard Dashboard Widget =====
// Displays current streak, longest streak, freeze count, and a 14-day mini-calendar.
// Respects prefers-reduced-motion for all animations.

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

// ── Streak Calendar ──────────────────────────────────────────────

function StreakCalendar({
  lastActivityDate,
  frozenDays,
}: {
  lastActivityDate: string | null;
  frozenDays: number;
}) {
  const days = useMemo(() => {
    const result: { date: string; label: string; status: "active" | "frozen" | "missed" | "future" }[] = [];
    const today = new Date();
    let remainingFrozen = frozenDays;

    // Generate last 14 days (including today)
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

      let status: "active" | "frozen" | "missed" | "future";
      if (isFuture) {
        status = "future";
      } else if (isToday) {
        status = "active";
      } else if (isActive && remainingFrozen > 0) {
        // Estimate frozen days from the history
        status = "frozen";
        remainingFrozen--;
      } else if (isActive) {
        status = "active";
      } else {
        status = "missed";
      }

      // If lastActivityDate is null, all past days are "missed"
      if (!lastActivityDate && !isToday && !isFuture) {
        status = "missed";
      }

      result.push({ date: dateStr, label: dayLabel, status });
    }

    return result;
  }, [lastActivityDate, frozenDays]);

  return (
    <div className="flex gap-1.5 justify-center" role="list" aria-label="Streak calendar - last 14 days">
      {days.map((day, idx) => (
        <div
          key={day.date}
          role="listitem"
          aria-label={`${day.label} - ${day.status === "active" ? "Active" : day.status === "frozen" ? "Frozen" : day.status === "future" ? "Future" : "Missed"}`}
          className={`w-7 h-10 rounded-md flex flex-col items-center justify-center text-[9px] font-semibold transition-colors duration-200 ${
            day.status === "active"
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : day.status === "frozen"
                ? "bg-sky-100 text-sky-700 border border-sky-200"
                : day.status === "future"
                  ? "bg-cm-slate-50 text-cm-slate-300 border border-cm-slate-100"
                  : "bg-red-50 text-red-400 border border-red-100"
          }`}
        >
          <span className="mb-0.5">{day.label}</span>
          <span className="leading-none">
            {day.status === "active" && "🔥"}
            {day.status === "frozen" && "❄️"}
            {day.status === "missed" && "·"}
            {day.status === "future" && ""}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Streak Counter Animation ─────────────────────────────────────

function AnimatedStreakCount({ value, label, icon: Icon, color }: {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      variants={fadeItem}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <motion.p
          className="text-xl font-heading font-bold text-cm-slate-900 tabular-nums"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          {value}
        </motion.p>
        <p className="text-[11px] text-cm-slate-500 font-medium leading-tight">
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
        className="bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cm-slate-100 animate-pulse" />
          <div className="h-5 w-32 bg-cm-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-10 bg-cm-slate-50 rounded-xl animate-pulse" />
          <div className="h-10 bg-cm-slate-50 rounded-xl animate-pulse" />
          <div className="h-16 bg-cm-slate-50 rounded-xl animate-pulse" />
        </div>
      </motion.div>
    );
  }

  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const freezeCount = streak?.streak_freeze_available ?? 0;
  const frozenDays = streak?.frozen_days ?? 0;
  const lastActivityDate = streak?.last_activity_date ?? null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white border border-cm-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <motion.div variants={fadeItem} className="flex items-center gap-2.5 mb-4">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-orange-100 text-orange-600">
          <Flame className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 text-lg">
          Study Streak
        </h2>
        {isCheckedInToday && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold"
          >
            <Zap className="w-3 h-3" />
            Checked in
          </motion.span>
        )}
        {freezeConsumed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold"
          >
            <Snowflake className="w-3 h-3" />
            Freeze used
          </motion.span>
        )}
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div variants={fadeItem} className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Streak stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <AnimatedStreakCount
          value={currentStreak}
          label="Current Streak"
          icon={Flame}
          color="bg-orange-100 text-orange-600"
        />
        <AnimatedStreakCount
          value={longestStreak}
          label="Best Streak"
          icon={TrendingUp}
          color="bg-cm-gold-light text-cm-gold"
        />
        <AnimatedStreakCount
          value={freezeCount}
          label="Freezes"
          icon={Snowflake}
          color="bg-sky-100 text-sky-600"
        />
      </div>

      {/* Freeze Awarded indicator */}
      {freezeAwarded && (
        <motion.div
          variants={fadeItem}
          className="mb-3 p-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-2"
        >
          <Snowflake className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-xs text-sky-700 font-medium">
            +1 Freeze token awarded for 7-day milestone!
          </span>
        </motion.div>
      )}

      {/* Streak Calendar */}
      <motion.div variants={fadeItem} className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <CalendarDays className="w-3.5 h-3.5 text-cm-slate-400" />
          <span className="text-[11px] font-bold text-cm-slate-500 uppercase tracking-wider">
            Last 14 Days
          </span>
        </div>
        <StreakCalendar
          lastActivityDate={lastActivityDate}
          frozenDays={frozenDays}
        />
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-cm-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald-100 border border-emerald-200" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-sky-100 border border-sky-200" /> Frozen
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-50 border border-red-100" /> Missed
          </span>
        </div>
      </motion.div>

      {/* XP Rewards + Badges Toast */}
      <XpToast xpRewards={xpRewards} newlyEarnedBadges={newlyEarnedBadges} />

      {/* Freeze info tooltip */}
      <motion.div
        variants={fadeItem}
        className="mt-3 p-2.5 rounded-xl bg-cm-navy-50 border border-cm-slate-100"
      >
        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-cm-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-cm-slate-500 leading-relaxed">
            <span className="font-semibold text-cm-slate-700">How it works:</span>{" "}
            Check in daily to maintain your streak. If you miss a day, a
            freeze token protects your streak from breaking. Earn{" "}
            <span className="font-semibold">1 freeze per 7-day milestone</span>
            {" "}(max 3). Longer streaks unlock XP bonuses and badges!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
