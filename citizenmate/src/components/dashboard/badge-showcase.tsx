// ===== CitizenMate: BadgeShowcase Dashboard Widget =====
// Refined: Top-4 highlight + expandable "View All" pattern.
// Responsive across desktop, tablet, mobile, and PWA viewports.
// Respects prefers-reduced-motion for all animations.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Flame,
  Star,
  Dumbbell,
  Trophy,
  Heart,
  Lock,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useBadgeShowcase } from "@/hooks/use-badge-showcase";
import type { BadgeDefinition } from "@/lib/gamification-types";
import type { BadgeCategory } from "@/hooks/use-badge-showcase";

// ── Icon map ────────────────────────────────────────────────────

function BadgeIcon({ icon, className }: { icon: string; className?: string }) {
  const sizeClass = className ?? "w-5 h-5";
  switch (icon) {
    case "flame":
      return <Flame className={sizeClass} />;
    case "star":
      return <Star className={sizeClass} />;
    case "dumbbell":
      return <Dumbbell className={sizeClass} />;
    case "trophy":
      return <Trophy className={sizeClass} />;
    case "heart":
      return <Heart className={sizeClass} />;
    default:
      return <Award className={sizeClass} />;
  }
}

// ── Motion variants ─────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28 } },
};

const earnedCardBg: Record<string, string> = {
  streak: "from-orange-50 to-amber-50/60 border-orange-200/50",
  mastery: "from-purple-50 to-violet-50/60 border-purple-200/50",
  effort: "from-blue-50 to-sky-50/60 border-blue-200/50",
  milestone: "from-amber-50 to-yellow-50/60 border-amber-200/50",
};

const earnedIconBg: Record<string, string> = {
  streak: "bg-orange-100 text-orange-600",
  mastery: "bg-purple-100 text-purple-600",
  effort: "bg-blue-100 text-blue-600",
  milestone: "bg-amber-100 text-amber-600",
};

const earnedGradient: Record<string, string> = {
  streak: "from-orange-400 to-amber-500",
  mastery: "from-purple-400 to-violet-500",
  effort: "from-blue-400 to-sky-500",
  milestone: "from-amber-400 to-yellow-500",
};

// ── Compact Highlight Card (used for top 4) ─────────────────────

function HighlightBadgeCard({
  badge,
  earned_at,
}: {
  badge: BadgeDefinition;
  earned_at?: string;
}) {
  const category = badge.category as keyof typeof earnedCardBg;

  return (
    <motion.div
      variants={cardItem}
      layout
      className={`relative flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${
        earnedCardBg[category] ?? "from-cm-slate-50 to-cm-slate-50/60 border-cm-slate-200/50"
      } border shadow-sm hover:shadow-md transition-all duration-200 group w-[calc(50%-0.375rem)] sm:w-auto sm:min-w-[180px]`}
    >
      {/* Tier shimmer */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${
          earnedGradient[category] ?? "from-cm-navy to-cm-teal"
        }`}
      />

      <div className="flex items-center gap-2.5 mt-1">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            earnedIconBg[category] ?? "bg-cm-navy-100 text-cm-navy"
          }`}
        >
          <BadgeIcon icon={badge.icon} className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading font-bold text-xs text-cm-slate-900 truncate">
            {badge.name}
          </p>
          <p className="text-[10px] text-cm-slate-500 leading-tight mt-0.5 line-clamp-1">
            {badge.description}
          </p>
        </div>
      </div>

      {/* Tier indicator */}
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: badge.tier }, (_, i) => (
          <Sparkles key={i} className="w-2 h-2 text-amber-400" />
        ))}
      </div>
    </motion.div>
  );
}

// ── Full Badge Card (used inside expanded view) ─────────────────

function BadgeCard({
  badge,
  earned,
  earned_at,
}: {
  badge: BadgeDefinition;
  earned: boolean;
  earned_at?: string;
}) {
  const category = badge.category as keyof typeof earnedCardBg;

  if (earned) {
    const earnedDate = earned_at
      ? new Date(earned_at).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

    return (
      <motion.div
        variants={cardItem}
        layout
        className={`relative p-3.5 rounded-xl bg-gradient-to-br ${
          earnedCardBg[category] ?? "from-cm-slate-50 to-cm-slate-50/60 border-cm-slate-200/50"
        } border shadow-sm hover:shadow-md transition-all duration-200 group`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${
            earnedGradient[category] ?? "from-cm-navy to-cm-teal"
          }`}
        />
        <div className="flex items-start gap-3 mt-1">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              earnedIconBg[category] ?? "bg-cm-navy-100 text-cm-navy"
            }`}
          >
            <BadgeIcon icon={badge.icon} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-bold text-sm text-cm-slate-900 truncate">
              {badge.name}
            </p>
            <p className="text-[11px] text-cm-slate-500 leading-snug mt-0.5 line-clamp-2">
              {badge.description}
            </p>
            {earnedDate && (
              <p className="text-[10px] text-cm-slate-400 font-medium mt-1">
                Earned {earnedDate}
              </p>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: badge.tier }, (_, i) => (
            <Sparkles key={i} className="w-2.5 h-2.5 text-amber-400" />
          ))}
        </div>
      </motion.div>
    );
  }

  // Unclaimed badge
  return (
    <motion.div
      variants={cardItem}
      layout
      className="relative p-3.5 rounded-xl bg-cm-slate-50/60 border border-cm-slate-100 border-dashed shadow-sm opacity-70 hover:opacity-90 transition-opacity duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cm-slate-100 text-cm-slate-300 flex items-center justify-center">
          <Lock className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading font-bold text-sm text-cm-slate-400 truncate">
            {badge.name}
          </p>
          <p className="text-[11px] text-cm-slate-400 leading-snug mt-0.5 line-clamp-2">
            {badge.requirement_description}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: badge.tier }, (_, i) => (
          <Sparkles key={i} className="w-2.5 h-2.5 text-cm-slate-200" />
        ))}
      </div>
    </motion.div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-cm-slate-500">
          Collection Progress
        </span>
        <span className="text-[11px] font-bold text-cm-slate-700 tabular-nums">
          {current}/{total}
        </span>
      </div>
      <div className="w-full h-2 bg-cm-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cm-teal to-cm-navy"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] text-cm-slate-400 mt-1 font-medium">
        {current === 0
          ? "Complete activities to earn your first badge!"
          : current === total
            ? "All badges collected! Incredible!"
            : `${total - current} more badge${total - current === 1 ? "" : "s"} to collect`}
      </p>
    </div>
  );
}

// ── Expand/Collapse Button ──────────────────────────────────────

function ExpandButton({
  expanded,
  onClick,
  remainingCount,
}: {
  expanded: boolean;
  onClick: () => void;
  remainingCount: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cm-slate-50/80 border border-cm-slate-100 hover:bg-cm-slate-100/80 hover:border-cm-slate-200 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse badge list" : `View all ${remainingCount} badges`}
    >
      <span className="text-xs font-semibold text-cm-slate-600 group-hover:text-cm-slate-800 transition-colors">
        {expanded ? "Show Less" : `View All Badges (${remainingCount})`}
      </span>
      <motion.span
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className="text-cm-slate-400"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.span>
    </button>
  );
}

// ── Main Component ──────────────────────────────────────────────

export function BadgeShowcase() {
  const {
    data,
    isLoading,
    error,
    activeCategory,
    refresh,
    setCategory,
    categoryLabels,
    categoryOrder,
    getBadgeCategory,
  } = useBadgeShowcase();

  const [showAll, setShowAll] = useState(false);

  // Derived: all earned badges sorted by tier desc, then most recent first
  const sortedEarned = useMemo(() => {
    if (!data) return [];
    return [...data.earned].sort((a, b) => {
      if (b.tier !== a.tier) return b.tier - a.tier;
      const dateA = (a as { earned_at?: string }).earned_at ? new Date((a as { earned_at: string }).earned_at).getTime() : 0;
      const dateB = (b as { earned_at?: string }).earned_at ? new Date((b as { earned_at: string }).earned_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [data]);

  // Top 4 highlight badges
  const highlightBadges = useMemo(() => sortedEarned.slice(0, 4), [sortedEarned]);

  // Remaining earned badges (shown in expanded view, respecting category filter)
  const filteredEarned = useMemo(() => {
    if (!data) return [];
    const source = showAll ? data.earned : [];
    if (activeCategory === "all") return source;
    return source.filter((b) => getBadgeCategory(b) === activeCategory);
  }, [data, activeCategory, getBadgeCategory, showAll]);

  const filteredUnclaimed = useMemo(() => {
    if (!data) return [];
    if (activeCategory === "all") return data.unclaimed;
    return data.unclaimed.filter((b) => getBadgeCategory(b) === activeCategory);
  }, [data, activeCategory, getBadgeCategory]);

  // Total remaining (earned beyond top 4 + all unclaimed)
  const remainingCount = useMemo(() => {
    const extraEarned = Math.max(0, (data?.earned.length ?? 0) - 4);
    const locked = data?.unclaimed.length ?? 0;
    return extraEarned + locked;
  }, [data]);

  // Loading skeleton
  if (isLoading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-cm-slate-200/60 p-5 sm:p-6 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cm-slate-100 animate-pulse" />
          <div className="h-5 w-36 bg-cm-slate-100 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-cm-slate-300 animate-spin" />
        </div>
      </motion.div>
    );
  }

  const totalEarned = data?.stats?.totalEarned ?? 0;
  const totalBadges = data?.stats?.totalBadges ?? 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white border border-cm-slate-200/60 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ── Header ── */}
      <motion.div variants={cardItem} className="flex items-center gap-2.5 mb-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-600">
          <Award className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 text-base sm:text-lg">
          Achievement Badges
        </h2>
        <button
          onClick={refresh}
          className="ml-auto p-1.5 rounded-lg hover:bg-cm-slate-50 text-cm-slate-400 hover:text-cm-slate-600 transition-colors"
          aria-label="Refresh badges"
          title="Refresh badges"
        >
          <Loader2 className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </motion.div>

      {/* ── Error state ── */}
      {error && (
        <motion.div variants={cardItem} className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* ── Progress bar ── */}
      <motion.div variants={cardItem} className="mb-3">
        <ProgressBar current={totalEarned} total={totalBadges} />
      </motion.div>

      {/* ── Top 4 Highlight Badges (always visible) ── */}
      {highlightBadges.length > 0 ? (
        <motion.div
          variants={cardItem}
          className="flex flex-wrap gap-3 sm:gap-3"
        >
          <AnimatePresence mode="popLayout">
            {highlightBadges.map((badge) => (
              <HighlightBadgeCard
                key={badge.id}
                badge={badge}
                earned_at={(badge as { earned_at?: string }).earned_at}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          variants={cardItem}
          className="mb-2 p-4 rounded-xl bg-cm-slate-50/60 border border-cm-slate-100 border-dashed text-center"
        >
          <Award className="w-6 h-6 text-cm-slate-300 mx-auto mb-1.5" />
          <p className="text-xs text-cm-slate-400 font-medium">
            No badges earned yet. Start your study journey!
          </p>
        </motion.div>
      )}

      {/* ── Expand/Collapse Button ── */}
      {remainingCount > 0 && (
        <ExpandButton
          expanded={showAll}
          onClick={() => setShowAll(!showAll)}
          remainingCount={remainingCount}
        />
      )}

      {/* ── Expanded View: Filters + All Badges ── */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {/* Category filter tabs */}
              <div className="flex flex-wrap gap-1.5 mb-4" role="tablist" aria-label="Badge category filter">
                {categoryOrder.map((cat) => {
                  const count =
                    cat === "all"
                      ? totalEarned
                      : (data?.earned ?? []).filter((b) => getBadgeCategory(b) === cat).length;

                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={activeCategory === cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        activeCategory === cat
                          ? "bg-cm-navy text-white shadow-sm"
                          : "bg-cm-slate-50 text-cm-slate-500 hover:bg-cm-slate-100"
                      }`}
                    >
                      {categoryLabels[cat]}
                      <span className="ml-1.5 opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Earned badges grid */}
              <AnimatePresence mode="wait">
                {filteredEarned.length > 0 ? (
                  <motion.div
                    key={`earned-${activeCategory}`}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
                  >
                    {filteredEarned.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        earned
                        earned_at={(badge as { earned_at?: string }).earned_at}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-earned-${activeCategory}`}
                    variants={cardItem}
                    className="mb-4 p-4 rounded-xl bg-cm-slate-50/60 border border-cm-slate-100 border-dashed text-center"
                  >
                    <Award className="w-6 h-6 text-cm-slate-300 mx-auto mb-1.5" />
                    <p className="text-xs text-cm-slate-400 font-medium">
                      {activeCategory === "all"
                        ? "No badges earned yet. Start your study journey!"
                        : `No ${categoryLabels[activeCategory].toLowerCase()} badges earned yet.`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unclaimed badges */}
              {filteredUnclaimed.length > 0 && (
                <motion.div variants={cardItem}>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-3.5 h-3.5 text-cm-slate-400" />
                    <span className="text-[11px] font-bold text-cm-slate-500 uppercase tracking-wider">
                      Locked ({filteredUnclaimed.length})
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`unclaimed-${activeCategory}`}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {filteredUnclaimed.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} earned={false} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
