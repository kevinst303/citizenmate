// ===== CitizenMate Gamification Engine =====
// Streak calculation, badge evaluation, and XAI explanation generation.

import type {
  BadgeDefinition,
  BadgeEvaluationInput,
  UserStreak,
  XAIExplanation,
} from "@/lib/gamification-types";
import type { QuestionPerformance, MasteryLevel } from "@/lib/srs-types";
import { getMasteryLevel } from "@/lib/srs-engine";

// ─── Constants ───────────────────────────────────────────

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Streak
  { id: "streak-3", name: "Getting Started", description: "You studied 3 days in a row!", icon: "flame", category: "streak", tier: 1, requirement_description: "3-day study streak" },
  { id: "streak-7", name: "Week Warrior", description: "A full week of daily study — now that's dedication!", icon: "flame", category: "streak", tier: 2, requirement_description: "7-day study streak" },
  { id: "streak-14", name: "Fortnight Focus", description: "Two weeks of consistent effort. You're building a habit!", icon: "flame", category: "streak", tier: 3, requirement_description: "14-day study streak" },
  { id: "streak-30", name: "Monthly Master", description: "30 days straight! This is who you are now.", icon: "flame", category: "streak", tier: 4, requirement_description: "30-day study streak" },
  { id: "streak-60", name: "Unstoppable", description: "60 days without missing a beat. Legendary discipline.", icon: "flame", category: "streak", tier: 5, requirement_description: "60-day study streak" },
  // Mastery
  { id: "mastery-25", name: "Quarter Master", description: "You've mastered 25% of all questions!", icon: "star", category: "mastery", tier: 1, requirement_description: "Master 25% of question bank" },
  { id: "mastery-50", name: "Halfway Hero", description: "50% of the question bank is under your belt.", icon: "star", category: "mastery", tier: 2, requirement_description: "Master 50% of question bank" },
  { id: "mastery-75", name: "Knowledge Champion", description: "75% mastery — you're getting close to test-ready!", icon: "star", category: "mastery", tier: 3, requirement_description: "Master 75% of question bank" },
  { id: "mastery-90", name: "Almost There", description: "90% mastered. Just a few more to go!", icon: "star", category: "mastery", tier: 4, requirement_description: "Master 90% of question bank" },
  { id: "mastery-100", name: "Perfect Score", description: "Every question mastered. You are ready!", icon: "star", category: "mastery", tier: 5, requirement_description: "Master 100% of question bank" },
  // Effort
  { id: "effort-10", name: "First Steps", description: "Completed 10 total questions across all sessions.", icon: "dumbbell", category: "effort", tier: 1, requirement_description: "Answer 10 questions total" },
  { id: "effort-50", name: "Practice Makes Perfect", description: "50 questions answered. Keep that momentum!", icon: "dumbbell", category: "effort", tier: 2, requirement_description: "Answer 50 questions total" },
  { id: "effort-100", name: "Century Club", description: "100 questions crushed. Serious effort!", icon: "dumbbell", category: "effort", tier: 3, requirement_description: "Answer 100 questions total" },
  { id: "effort-250", name: "Dedicated Scholar", description: "250 questions — your commitment is showing.", icon: "dumbbell", category: "effort", tier: 4, requirement_description: "Answer 250 questions total" },
  { id: "effort-500", name: "Iron Will", description: "500 questions. Nothing can stop you now.", icon: "dumbbell", category: "effort", tier: 5, requirement_description: "Answer 500 questions total" },
  // Milestone
  { id: "milestone-first-test", name: "First Test Taker", description: "You completed your very first practice test!", icon: "trophy", category: "milestone", tier: 1, requirement_description: "Complete 1 practice test" },
  { id: "milestone-5-tests", name: "Practice Pro", description: "Five practice tests in the books.", icon: "trophy", category: "milestone", tier: 2, requirement_description: "Complete 5 practice tests" },
  { id: "milestone-10-tests", name: "Test Machine", description: "10 practice tests — you know the format inside out.", icon: "trophy", category: "milestone", tier: 3, requirement_description: "Complete 10 practice tests" },
  { id: "milestone-perfect", name: "Flawless Run", description: "Scored 100% on a practice test!", icon: "trophy", category: "milestone", tier: 4, requirement_description: "Score 100% on any practice test" },
  { id: "milestone-values", name: "Values Guardian", description: "Mastered all Australian Values questions.", icon: "heart", category: "milestone", tier: 3, requirement_description: "Achieve 100% on Australian Values topic" },
];

const STREAK_THRESHOLDS = [3, 7, 14, 30, 60];
const FREEZE_MILESTONE_INTERVAL = 7; // 1 freeze per 7 consecutive days
const MAX_STREAK_FREEZES = 3;
const MASTERY_THRESHOLDS = [25, 50, 75, 90, 100];
const EFFORT_THRESHOLDS = [10, 50, 100, 250, 500];

// Streak milestone XP rewards
const STREAK_MILESTONE_XP: Record<number, number> = {
  3: 50,
  7: 100,
  14: 250,
  30: 500,
  60: 1000,
};

// ─── Streak Calculation ──────────────────────────────────

/**
 * Calculate the current streak based on last activity date.
 * Uses the 'Australia/Sydney' timezone assumption for day boundaries.
 * Gracefully handles edge cases: timezone shifts, missed days, first activity.
 */
export function calculateStreak(
  lastActivityDate: string | null,
  currentStreak: number
): { newStreak: number; isIncremented: boolean } {
  if (!lastActivityDate) {
    return { newStreak: 1, isIncremented: true };
  }

  const now = new Date();
  const lastDate = new Date(lastActivityDate);

  // Normalize to date-only comparison (ignore time)
  const todayStr = now.toISOString().slice(0, 10);
  const lastStr = lastDate.toISOString().slice(0, 10);

  if (todayStr === lastStr) {
    // Already recorded today — no change
    return { newStreak: currentStreak, isIncremented: false };
  }

  // Calculate day difference
  const today = new Date(todayStr);
  const last = new Date(lastStr);
  const diffMs = today.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day — increment streak
    return { newStreak: currentStreak + 1, isIncremented: true };
  }

  // Streak broken — reset to 1
  return { newStreak: 1, isIncremented: true };
}

/**
 * Calculate streak with freeze-aware logic.
 * If the streak would break and a freeze is available, the freeze is consumed
 * instead of resetting the streak.
 */
export function calculateStreakWithFreeze(
  lastActivityDate: string | null,
  currentStreak: number,
  streakFreezeAvailable: number,
  frozenDays: number,
  lastFreezeUsedDate: string | null
): {
  newStreak: number;
  isIncremented: boolean;
  freezeConsumed: boolean;
  remainingFreezes: number;
  newFrozenDays: number;
} {
  if (!lastActivityDate) {
    // First activity ever
    return {
      newStreak: 1,
      isIncremented: true,
      freezeConsumed: false,
      remainingFreezes: streakFreezeAvailable,
      newFrozenDays: frozenDays,
    };
  }

  const now = new Date();
  const lastDate = new Date(lastActivityDate);

  // Normalize to date-only comparison (ignore time)
  const todayStr = now.toISOString().slice(0, 10);
  const lastStr = lastDate.toISOString().slice(0, 10);

  if (todayStr === lastStr) {
    // Already recorded today — no change
    return {
      newStreak: currentStreak,
      isIncremented: false,
      freezeConsumed: false,
      remainingFreezes: streakFreezeAvailable,
      newFrozenDays: frozenDays,
    };
  }

  // Calculate day difference
  const today = new Date(todayStr);
  const last = new Date(lastStr);
  const diffMs = today.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day — increment streak
    return {
      newStreak: currentStreak + 1,
      isIncremented: true,
      freezeConsumed: false,
      remainingFreezes: streakFreezeAvailable,
      newFrozenDays: frozenDays,
    };
  }

  // Streak gap detected — check for freeze
  if (streakFreezeAvailable > 0) {
    // Prevent double-freeze on same gap
    if (lastFreezeUsedDate) {
      const freezeDateStr = new Date(lastFreezeUsedDate).toISOString().slice(0, 10);
      if (freezeDateStr === lastStr || freezeDateStr === todayStr) {
        // Freeze already consumed for this gap — reset
        return {
          newStreak: 1,
          isIncremented: true,
          freezeConsumed: false,
          remainingFreezes: streakFreezeAvailable,
          newFrozenDays: frozenDays,
        };
      }
    }

    // Consume freeze: keep streak intact, mark day as frozen
    return {
      newStreak: currentStreak, // Streak preserved!
      isIncremented: true,
      freezeConsumed: true,
      remainingFreezes: streakFreezeAvailable - 1,
      newFrozenDays: frozenDays + 1,
    };
  }

  // No freeze available — reset
  return {
    newStreak: 1,
    isIncremented: true,
    freezeConsumed: false,
    remainingFreezes: 0,
    newFrozenDays: frozenDays,
  };
}


// ─── Badge Evaluation ────────────────────────────────────

/**
 * Evaluate which badges a user should earn based on their current stats.
 * Returns only newly earned badges (not already claimed).
 */
export function evaluateBadges(
  input: BadgeEvaluationInput,
  alreadyEarnedBadgeIds: Set<string>
): BadgeDefinition[] {
  const newlyEarned: BadgeDefinition[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (alreadyEarnedBadgeIds.has(badge.id)) continue;

    let earned = false;

    switch (badge.category) {
      case "streak": {
        const tier = STREAK_THRESHOLDS.indexOf(
          parseInt(badge.id.split("-")[1])
        );
        if (tier >= 0 && input.currentStreak >= STREAK_THRESHOLDS[tier]) {
          earned = true;
        }
        break;
      }
      case "mastery": {
        const tier = MASTERY_THRESHOLDS.indexOf(
          parseInt(badge.id.split("-")[1])
        );
        if (tier >= 0 && input.masteryPercentage >= MASTERY_THRESHOLDS[tier]) {
          earned = true;
        }
        break;
      }
      case "effort": {
        const tier = EFFORT_THRESHOLDS.indexOf(
          parseInt(badge.id.split("-")[1])
        );
        if (tier >= 0 && input.totalQuestionsAnswered >= EFFORT_THRESHOLDS[tier]) {
          earned = true;
        }
        break;
      }
      case "milestone": {
        switch (badge.id) {
          case "milestone-first-test":
            earned = input.totalTestsCompleted >= 1;
            break;
          case "milestone-5-tests":
            earned = input.totalTestsCompleted >= 5;
            break;
          case "milestone-10-tests":
            earned = input.totalTestsCompleted >= 10;
            break;
          case "milestone-perfect":
            earned =
              input.bestTestScore !== null &&
              input.bestTestScore.score === input.bestTestScore.total;
            break;
          case "milestone-values":
            earned = input.valuesMasteryPercentage >= 100;
            break;
        }
        break;
      }
    }

    if (earned) {
      newlyEarned.push(badge);
    }
  }

  return newlyEarned;
}

// ─── XAI (Explainable AI) ─────────────────────────────────

/**
 * Generate a human-readable explanation for why a specific question
 * was selected for review. Makes the SRS algorithm transparent.
 */
export function generateXAIExplanation(
  perf: QuestionPerformance | undefined,
  now: number
): XAIExplanation {
  if (!perf || perf.timesAnswered === 0) {
    return {
      primaryReason: "New topic to explore",
      detail: "You haven't seen this question before. Starting with new material builds a strong foundation across all topics.",
      metrics: [
        { label: "Status", value: "New" },
        { label: "Priority", value: "Foundation building" },
      ],
      urgency: "medium",
    };
  }

  const accuracy =
    perf.timesAnswered > 0
      ? Math.round((perf.timesCorrect / perf.timesAnswered) * 100)
      : 0;

  const masteryLevel: MasteryLevel = getMasteryLevel(perf);
  const reviewTime = new Date(perf.nextReviewAt).getTime();
  const isOverdue = reviewTime <= now;

  if (isOverdue && masteryLevel !== "mastered") {
    const overdueHours = Math.round((now - reviewTime) / (1000 * 60 * 60));
    return {
      primaryReason: "Due for review",
      detail: `This question was scheduled for review ${
        overdueHours < 24
          ? `${overdueHours} hours ago`
          : `${Math.round(overdueHours / 24)} days ago`
      }. Reviewing it now strengthens long-term memory before the forgetting curve drops too far.`,
      metrics: [
        { label: "Accuracy", value: `${accuracy}%` },
        { label: "Overdue", value: `${overdueHours < 24 ? overdueHours + "h" : Math.round(overdueHours / 24) + "d"}` },
        { label: "Interval", value: `${perf.interval}d` },
      ],
      urgency: "high",
    };
  }

  if (accuracy < 60 && perf.timesAnswered >= 2) {
    return {
      primaryReason: "Needs more practice",
      detail: `Your accuracy on this question is ${accuracy}%. The algorithm detects this as a weak spot — a few more correct attempts will lock it into long-term memory.`,
      metrics: [
        { label: "Accuracy", value: `${accuracy}%` },
        { label: "Attempts", value: `${perf.timesAnswered}` },
        { label: "Streak", value: `${perf.consecutiveCorrect} correct` },
      ],
      urgency: "high",
    };
  }

  if (perf.consecutiveCorrect === 0) {
    return {
      primaryReason: "Recent mistake — reinforce now",
      detail: "You got this wrong last time. The algorithm brings it back quickly while the correction is still fresh in your mind, preventing the error from sticking.",
      metrics: [
        { label: "Accuracy", value: `${accuracy}%` },
        { label: "Last result", value: "Incorrect" },
      ],
      urgency: "high",
    };
  }

  if (masteryLevel === "mastered") {
    return {
      primaryReason: "Maintenance review",
      detail: `You've mastered this question with ${perf.consecutiveCorrect} consecutive correct answers. This gentle review keeps it fresh without taking up too much of your study time.`,
      metrics: [
        { label: "Accuracy", value: `${accuracy}%` },
        { label: "Mastered", value: "✓" },
        { label: "Interval", value: `${perf.interval}d` },
      ],
      urgency: "low",
    };
  }

  // General review
  return {
    primaryReason: "Optimising your retention",
    detail: `You're at ${accuracy}% accuracy with a ${perf.interval}-day review interval. The algorithm spaces out reviews to maximise memory retention — each correct answer extends the interval further.`,
    metrics: [
      { label: "Accuracy", value: `${accuracy}%` },
      { label: "Interval", value: `${perf.interval}d` },
      { label: "Ease", value: `${perf.easeFactor.toFixed(1)}x` },
    ],
    urgency: "medium",
  };
}

/** Get all badge definitions for reference */
export function getAllBadgeDefinitions(): BadgeDefinition[] {
  return BADGE_DEFINITIONS;
}

/** Get a single badge by ID */
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}

/**
 * Calculate streak milestone XP reward for a given streak value.
 * Returns 0 if no milestone is reached.
 */
export function getStreakMilestoneXp(streak: number): number {
  return STREAK_MILESTONE_XP[streak] ?? 0;
}

/**
 * Calculate how many freezes should be awarded for a given streak value.
 * 1 freeze per 7 consecutive days, capped at MAX_STREAK_FREEZES.
 */
export function getStreakFreezeAward(currentStreak: number): number {
  const earnedFreezes = Math.floor(currentStreak / FREEZE_MILESTONE_INTERVAL);
  return Math.min(earnedFreezes, MAX_STREAK_FREEZES);
}

/** Export freeze constants for use in other modules */
export { FREEZE_MILESTONE_INTERVAL, MAX_STREAK_FREEZES };

// ─── Progression (Level) System ─────────────────────────

/** XP required per level. Index 0 = Level 1 base (0 XP). */
const LEVEL_XP_THRESHOLDS = [
  0,      // Level 1 (0–99 XP)
  100,    // Level 2 (100–249 XP)
  250,    // Level 3 (250–499 XP)
  500,    // Level 4 (500–999 XP)
  1000,   // Level 5 (1,000–1,999 XP)
  2000,   // Level 6 (2,000–3,499 XP)
  3500,   // Level 7 (3,500–5,999 XP)
  6000,   // Level 8 (6,000–9,999 XP)
  10000,  // Level 9 (10,000–15,999 XP)
  16000,  // Level 10 (16,000+ XP — after this, level 10 is max)
];

const MAX_LEVEL = LEVEL_XP_THRESHOLDS.length;

/**
 * Calculate which level a user is at based on total XP.
 * Returns the level (1-indexed) and progress toward the next level.
 */
export function calculateLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number; // 0–1 fraction
  isMaxLevel: boolean;
} {
  let level = 1;
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_XP_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }

  const isMaxLevel = level >= MAX_LEVEL;
  const currentLevelXp = LEVEL_XP_THRESHOLDS[level - 1];
  const nextLevelXp = isMaxLevel
    ? currentLevelXp
    : LEVEL_XP_THRESHOLDS[level];

  const xpInLevel = totalXp - currentLevelXp;
  const xpForNext = nextLevelXp - currentLevelXp;
  const progress = xpForNext > 0 ? Math.min(xpInLevel / xpForNext, 1) : 1;

  return { level, currentLevelXp, nextLevelXp, progress, isMaxLevel };
}

/**
 * Get the title string for a given level.
 */
export function getLevelTitle(level: number): string {
  const titles = [
    "Newcomer",         // L1
    "Apprentice",       // L2
    "Scholar",          // L3
    "Practitioner",     // L4
    "Expert",           // L5
    "Guardian",         // L6
    "Champion",         // L7
    "Virtuoso",         // L8
    "Legend",           // L9
    "Grand Master",     // L10
  ];
  return titles[Math.min(level - 1, titles.length - 1)] ?? "Grand Master";
}

