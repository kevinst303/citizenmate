import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateNextReview, getMasteryLevel } from "@/lib/srs-engine";
import type { QuestionPerformance } from "@/lib/srs-types";

describe("SRS Engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("calculateNextReview", () => {
    it("handles incorrect answer correctly", () => {
      const result = calculateNextReview(false, null);
      expect(result.interval).toBe(0.01);
      expect(result.consecutiveCorrect).toBe(0);
      expect(result.easeFactor).toBe(2.3); // 2.5 - 0.2
      // Next review should be 10 minutes from now
      expect(result.nextReviewAt).toBe(new Date("2024-01-01T12:10:00.000Z").toISOString());
    });

    it("handles first correct answer correctly", () => {
      const result = calculateNextReview(true, null);
      expect(result.interval).toBe(1);
      expect(result.consecutiveCorrect).toBe(1);
      expect(result.easeFactor).toBe(2.6); // 2.5 + 0.1
      // Next review should be 1 day from now
      expect(result.nextReviewAt).toBe(new Date("2024-01-02T12:00:00.000Z").toISOString());
    });

    it("handles second correct answer correctly", () => {
      const current = {
        consecutiveCorrect: 1,
        easeFactor: 2.6,
        interval: 1,
      };
      const result = calculateNextReview(true, current);
      expect(result.interval).toBe(3);
      expect(result.consecutiveCorrect).toBe(2);
      expect(result.easeFactor).toBe(2.7);
    });

    it("applies ease factor for >= 3 correct answers", () => {
      const current = {
        consecutiveCorrect: 2,
        easeFactor: 2.7,
        interval: 3,
      };
      const result = calculateNextReview(true, current);
      // Interval = Math.round(3 * 2.7) = 8
      expect(result.interval).toBe(8);
      expect(result.consecutiveCorrect).toBe(3);
      expect(result.easeFactor).toBeCloseTo(2.8);
    });
  });

  describe("getMasteryLevel", () => {
    it("returns 'new' for unattempted questions", () => {
      expect(getMasteryLevel(undefined)).toBe("new");
    });

    it("returns 'mastered' for 3+ consecutive correct", () => {
      const perf: QuestionPerformance = {
        questionId: "test",
        topic: "australian-values",
        timesAnswered: 3,
        timesCorrect: 3,
        consecutiveCorrect: 3,
        lastAnsweredAt: "",
        nextReviewAt: "",
        easeFactor: 2.5,
        interval: 8,
      };
      expect(getMasteryLevel(perf)).toBe("mastered");
    });

    it("returns 'reviewing' for 1-2 consecutive correct", () => {
      const perf: QuestionPerformance = {
        questionId: "test",
        topic: "australian-values",
        timesAnswered: 1,
        timesCorrect: 1,
        consecutiveCorrect: 1,
        lastAnsweredAt: "",
        nextReviewAt: "",
        easeFactor: 2.5,
        interval: 1,
      };
      expect(getMasteryLevel(perf)).toBe("reviewing");
    });

    it("returns 'learning' if interval < 1 or consecutive is 0", () => {
      const perf: QuestionPerformance = {
        questionId: "test",
        topic: "australian-values",
        timesAnswered: 1,
        timesCorrect: 0,
        consecutiveCorrect: 0,
        lastAnsweredAt: "",
        nextReviewAt: "",
        easeFactor: 2.3,
        interval: 0.01,
      };
      expect(getMasteryLevel(perf)).toBe("learning");
    });
  });
});
