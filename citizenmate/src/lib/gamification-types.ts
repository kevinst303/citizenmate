// ===== CitizenMate Gamification Types =====

export type BadgeCategory = "streak" | "mastery" | "effort" | "milestone";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  tier: number; // 1–5
  requirement_description: string;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeDefinition;
}

export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_active_days: number;
}

export interface GamificationState {
  streak: UserStreak | null;
  badges: UserBadge[];
  unclaimedBadges: BadgeDefinition[];
  isLoading: boolean;
}

// ─── Badge Evaluation Context ────────────────────────────

export interface BadgeEvaluationInput {
  currentStreak: number;
  longestStreak: number;
  totalQuestionsAnswered: number;
  totalTestsCompleted: number;
  masteryPercentage: number; // 0–100
  bestTestScore: { score: number; total: number } | null;
  valuesMasteryPercentage: number; // 0–100
}

// ─── XP Types ────────────────────────────────────────────

export interface XpEntry {
  id: string;
  user_id: string;
  amount: number;
  source: XpSource;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type XpSource =
  | "quiz_complete"
  | "streak_milestone"
  | "badge_earned"
  | "daily_login"
  | "test_completed"
  | "referral_bonus"
  | "admin_award";

// ─── XAI (Explainable AI) Types ──────────────────────────

export interface XAIExplanation {
  /** Primary reason this question was selected */
  primaryReason: string;
  /** Detailed human-readable explanation */
  detail: string;
  /** Supporting metrics */
  metrics: {
    label: string;
    value: string;
  }[];
  /** Urgency level for visual emphasis */
  urgency: "high" | "medium" | "low" | "none";
}
