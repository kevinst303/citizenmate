// ===== CitizenMate Spaced Repetition System Types =====

import type { TopicCategory } from "@/lib/types";

/**
 * Per-question performance data tracked across all quiz attempts.
 * Uses an SM-2-inspired algorithm for scheduling reviews.
 */
export interface QuestionPerformance {
  questionId: string;
  topic: TopicCategory;
  /** Total number of times this question has been answered */
  timesAnswered: number;
  /** Total number of times answered correctly */
  timesCorrect: number;
  /** Consecutive correct answers (resets on wrong answer) */
  consecutiveCorrect: number;
  /** ISO timestamp of the last time this question was answered */
  lastAnsweredAt: string;
  /** ISO timestamp of when this question should next be reviewed */
  nextReviewAt: string;
  /** SM-2 ease factor — starts at 2.5, adjusts based on performance */
  easeFactor: number;
  /** Current review interval in days */
  interval: number;
}

/**
 * Full SRS state persisted to localStorage.
 */
export interface SRSState {
  performances: Record<string, QuestionPerformance>;
  lastUpdatedAt: string;
}

/**
 * Mastery level for a question based on SRS data.
 */
export type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

/**
 * Aggregated stats for the SRS dashboard.
 */
export interface SRSStats {
  totalQuestions: number;
  newCount: number;
  learningCount: number;
  reviewingCount: number;
  masteredCount: number;
  /** Questions due for review right now */
  dueCount: number;
}

/**
 * Per-topic weakness data for the weak areas display.
 */
export interface TopicWeakness {
  topicId: TopicCategory;
  label: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number; // 0-100
  dueCount: number;
  weakQuestionCount: number;
}
