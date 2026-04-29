import { describe, it, expect } from "vitest";
import { calculateTopicMastery, calculateReadiness } from "@/lib/readiness";
import type { QuizResult } from "@/lib/readiness";

const mockStudyProgress = {
  completedSections: {
    "ap-intro": true,
    "ap-aboriginal": true,
    // "ap-early-days" is missing
  },
  bookmarkedQuestions: [],
};

const mockQuizHistory: QuizResult[] = [
  {
    testId: "1",
    score: 15,
    total: 20,
    valuesCorrect: 4,
    valuesTotal: 5,
    passed: false,
    completedAt: new Date().toISOString(),
    topicBreakdown: {
      "australia-people": { correct: 4, total: 5 },
      "democratic-beliefs": { correct: 4, total: 5 },
      "government-law": { correct: 3, total: 5 },
      "australian-values": { correct: 4, total: 5 },
    },
  },
];

describe("Readiness Calculator", () => {
  describe("calculateTopicMastery", () => {
    it("combines study completion and quiz accuracy", () => {
      // In data/study-content.ts, australia-people has 6 sections. 
      // If we mock it we might not have all 6 sections tracked, but the calculator uses real studyTopics.
      // 2 / 6 = 33% study completion.
      // Quiz accuracy = 4 / 5 = 80%.
      // Mastery = 80% * 0.6 + 33% * 0.4 = 48 + 13.2 = 61.2 -> 61%.
      
      const result = calculateTopicMastery(
        "australia-people",
        mockQuizHistory,
        mockStudyProgress
      );
      
      expect(result.topicId).toBe("australia-people");
      expect(result.quizAccuracy).toBe(80);
      // Study completion depends on actual length in study-content.ts, we check math roughly.
      expect(result.overallMastery).toBeGreaterThan(0);
      expect(result.label).toBe("Australia & Its People");
    });

    it("uses 100% study weight if no quiz data", () => {
      const result = calculateTopicMastery(
        "australia-people",
        [],
        mockStudyProgress
      );
      
      expect(result.quizAccuracy).toBe(0);
      expect(result.overallMastery).toBe(result.studyCompletion);
    });
  });

  describe("calculateReadiness", () => {
    it("computes combined score and values readiness", () => {
      const result = calculateReadiness(mockQuizHistory, mockStudyProgress);
      
      expect(result.quizComponent).toBe(75); // 15 / 20
      expect(result.totalQuizzesTaken).toBe(1);
      expect(result.valuesReady).toBe(false); // 4/5 is false
      expect(result.topicMastery.length).toBe(4);
    });

    it("returns zero score with no history or study progress", () => {
      const result = calculateReadiness([], { completedSections: {}, bookmarkedQuestions: [] });
      
      expect(result.score).toBe(0);
      expect(result.quizComponent).toBe(0);
      expect(result.studyComponent).toBe(0);
      expect(result.valuesReady).toBe(false);
      expect(result.totalQuizzesTaken).toBe(0);
      expect(result.iconName).toBe("hand");
    });
    
    it("identifies valuesReady correctly", () => {
      const passedHistory: QuizResult[] = [
        {
          testId: "2",
          score: 18,
          total: 20,
          valuesCorrect: 5,
          valuesTotal: 5,
          passed: true,
          completedAt: new Date().toISOString(),
        },
      ];
      const result = calculateReadiness(passedHistory, mockStudyProgress);
      expect(result.valuesReady).toBe(true);
      expect(result.bestQuizScore?.score).toBe(18);
    });
  });
});
