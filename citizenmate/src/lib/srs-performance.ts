import type { QuestionPerformance } from "@/lib/srs-types";
import type { TopicCategory } from "@/lib/types";

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

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
    const newEf = Math.max(MIN_EASE_FACTOR, ef - 0.2);
    return {
      interval: 0.01,
      easeFactor: newEf,
      consecutiveCorrect: 0,
      nextReviewAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
    };
  }

  const consecutive = prevConsecutive + 1;
  let newInterval: number;

  if (consecutive === 1) {
    newInterval = 1;
  } else if (consecutive === 2) {
    newInterval = 3;
  } else {
    newInterval = Math.round(prevInterval * ef);
  }

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
