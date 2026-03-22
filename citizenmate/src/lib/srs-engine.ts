// ===== CitizenMate SRS Engine =====
// SM-2-inspired spaced repetition algorithm for smart question ordering.

import type { QuizQuestion, TopicCategory } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import type {
  QuestionPerformance,
  MasteryLevel,
  SRSStats,
  TopicWeakness,
} from "@/lib/srs-types";

// ─── Constants ───────────────────────────────────────────

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MASTERED_THRESHOLD = 3; // consecutive correct to be "mastered"
const WEAK_ACCURACY_THRESHOLD = 60; // below 60% = weak question

// ─── SM-2 Interval Calculation ──────────────────────────

/**
 * Calculate the next review interval using a simplified SM-2 algorithm.
 * @param wasCorrect Whether the user answered correctly
 * @param current Current performance data (or null for first attempt)
 * @returns Updated performance fields
 */
export function calculateNextReview(
  wasCorrect: boolean,
  current: Pick<
    QuestionPerformance,
    "consecutiveCorrect" | "easeFactor" | "interval"
  > | null
): { interval: number; easeFactor: number; consecutiveCorrect: number; nextReviewAt: string } {
  const now = new Date();
  const ef = current?.easeFactor ?? DEFAULT_EASE_FACTOR;
  const prevInterval = current?.interval ?? 0;
  const prevConsecutive = current?.consecutiveCorrect ?? 0;

  if (!wasCorrect) {
    // Wrong answer: reset to short interval, decrease ease factor
    const newEf = Math.max(MIN_EASE_FACTOR, ef - 0.2);
    return {
      interval: 0.01, // review again very soon (~15 min conceptually)
      easeFactor: newEf,
      consecutiveCorrect: 0,
      nextReviewAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(), // 10 min
    };
  }

  // Correct answer: increase interval based on SM-2 schedule
  const consecutive = prevConsecutive + 1;
  let newInterval: number;

  if (consecutive === 1) {
    newInterval = 1; // 1 day
  } else if (consecutive === 2) {
    newInterval = 3; // 3 days
  } else {
    newInterval = Math.round(prevInterval * ef);
  }

  // Increase ease factor slightly on correct answer
  const newEf = Math.min(3.0, ef + 0.1);

  return {
    interval: newInterval,
    easeFactor: newEf,
    consecutiveCorrect: consecutive,
    nextReviewAt: new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
}

// ─── Performance Update ─────────────────────────────────

/**
 * Update a question's performance record after an answer.
 */
export function updatePerformance(
  questionId: string,
  topic: TopicCategory,
  wasCorrect: boolean,
  current: QuestionPerformance | null
): QuestionPerformance {
  const now = new Date().toISOString();
  const review = calculateNextReview(wasCorrect, current);

  return {
    questionId,
    topic,
    timesAnswered: (current?.timesAnswered ?? 0) + 1,
    timesCorrect: (current?.timesCorrect ?? 0) + (wasCorrect ? 1 : 0),
    consecutiveCorrect: review.consecutiveCorrect,
    lastAnsweredAt: now,
    nextReviewAt: review.nextReviewAt,
    easeFactor: review.easeFactor,
    interval: review.interval,
  };
}

// ─── Mastery Classification ─────────────────────────────

/**
 * Determine the mastery level of a question.
 */
export function getMasteryLevel(perf: QuestionPerformance | undefined): MasteryLevel {
  if (!perf || perf.timesAnswered === 0) return "new";
  if (perf.consecutiveCorrect >= MASTERED_THRESHOLD) return "mastered";
  if (perf.consecutiveCorrect >= 1 && perf.interval >= 1) return "reviewing";
  return "learning";
}

// ─── Smart Question Selection ───────────────────────────

interface ScoredQuestion {
  question: QuizQuestion;
  score: number; // higher = more urgent to review
}

/**
 * Select questions for a smart practice session.
 * Priority order:
 * 1. Overdue questions (past nextReviewAt)
 * 2. Questions with low accuracy (< 60%)
 * 3. Questions from weak topics
 * 4. Never-answered questions
 * 5. Random from remaining pool
 */
export function selectSmartQuestions(
  performances: Record<string, QuestionPerformance>,
  questionBank: QuizQuestion[],
  count: number,
  focusTopic?: TopicCategory
): QuizQuestion[] {
  const now = Date.now();

  // Filter to focus topic if specified
  const pool = focusTopic
    ? questionBank.filter((q) => q.topic === focusTopic)
    : questionBank;

  const scored: ScoredQuestion[] = pool.map((question) => {
    const perf = performances[question.id];
    let score = 0;

    if (!perf) {
      // Never answered — moderate priority
      score = 50;
    } else {
      const accuracy =
        perf.timesAnswered > 0
          ? (perf.timesCorrect / perf.timesAnswered) * 100
          : 0;

      // Overdue for review — highest priority
      const reviewTime = new Date(perf.nextReviewAt).getTime();
      if (reviewTime <= now) {
        const overdueMs = now - reviewTime;
        const overdueHours = overdueMs / (1000 * 60 * 60);
        score += 100 + Math.min(overdueHours, 100); // More overdue = higher score
      }

      // Low accuracy — high priority
      if (accuracy < WEAK_ACCURACY_THRESHOLD && perf.timesAnswered >= 2) {
        score += 80 - accuracy; // Lower accuracy = higher score boost
      }

      // Recently wrong — boost
      if (perf.consecutiveCorrect === 0 && perf.timesAnswered > 0) {
        score += 60;
      }

      // Mastered questions get very low priority
      if (perf.consecutiveCorrect >= MASTERED_THRESHOLD) {
        score = Math.max(0, score - 150);
      }
    }

    return { question, score };
  });

  // Sort by score (highest first), with randomization within same-score groups
  scored.sort((a, b) => {
    const diff = b.score - a.score;
    if (Math.abs(diff) < 5) return Math.random() - 0.5; // Shuffle similar scores
    return diff;
  });

  return scored.slice(0, count).map((s) => s.question);
}

// ─── Stats & Weakness Analysis ──────────────────────────

/**
 * Calculate aggregate SRS stats across all questions.
 */
export function calculateSRSStats(
  performances: Record<string, QuestionPerformance>,
  totalQuestionCount: number
): SRSStats {
  const now = Date.now();
  let newCount = 0;
  let learningCount = 0;
  let reviewingCount = 0;
  let masteredCount = 0;
  let dueCount = 0;

  const trackedCount = Object.keys(performances).length;
  newCount = totalQuestionCount - trackedCount;

  for (const perf of Object.values(performances)) {
    const level = getMasteryLevel(perf);
    switch (level) {
      case "new":
        newCount++;
        break;
      case "learning":
        learningCount++;
        break;
      case "reviewing":
        reviewingCount++;
        break;
      case "mastered":
        masteredCount++;
        break;
    }

    if (new Date(perf.nextReviewAt).getTime() <= now) {
      dueCount++;
    }
  }

  return {
    totalQuestions: totalQuestionCount,
    newCount,
    learningCount,
    reviewingCount,
    masteredCount,
    dueCount,
  };
}

/**
 * Analyze weakness by topic, sorted from weakest to strongest.
 */
export function analyzeTopicWeakness(
  performances: Record<string, QuestionPerformance>
): TopicWeakness[] {
  const now = Date.now();
  const topicMap: Record<
    string,
    { answered: number; correct: number; due: number; weak: number }
  > = {};

  const allTopics: TopicCategory[] = [
    "australia-people",
    "democratic-beliefs",
    "government-law",
    "australian-values",
  ];

  for (const t of allTopics) {
    topicMap[t] = { answered: 0, correct: 0, due: 0, weak: 0 };
  }

  for (const perf of Object.values(performances)) {
    const entry = topicMap[perf.topic];
    if (!entry) continue;

    entry.answered += perf.timesAnswered;
    entry.correct += perf.timesCorrect;

    if (new Date(perf.nextReviewAt).getTime() <= now) {
      entry.due++;
    }

    const accuracy =
      perf.timesAnswered > 0
        ? (perf.timesCorrect / perf.timesAnswered) * 100
        : 0;
    if (accuracy < WEAK_ACCURACY_THRESHOLD && perf.timesAnswered >= 2) {
      entry.weak++;
    }
  }

  const result: TopicWeakness[] = allTopics.map((topicId) => {
    const data = topicMap[topicId];
    return {
      topicId,
      label: TOPIC_LABELS[topicId],
      totalAnswered: data.answered,
      totalCorrect: data.correct,
      accuracy:
        data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0,
      dueCount: data.due,
      weakQuestionCount: data.weak,
    };
  });

  // Sort weakest first (lowest accuracy), topics with no data go last
  result.sort((a, b) => {
    if (a.totalAnswered === 0 && b.totalAnswered === 0) return 0;
    if (a.totalAnswered === 0) return 1;
    if (b.totalAnswered === 0) return -1;
    return a.accuracy - b.accuracy;
  });

  return result;
}
