import type { ReadinessData } from "@/lib/readiness";

export function getAIInsight(readiness: ReadinessData): {
  iconName: "hand" | "alert-triangle" | "party-popper" | "trending-up" | "book-open";
  message: string;
  variant: "info" | "success" | "warning";
  recommendedAction: string; // matches a quick action title
} {
  if (readiness.totalQuizzesTaken === 0) {
    return {
      iconName: "hand",
      message: "Welcome! Start with the study guide to build a strong foundation, then test yourself with a mock test.",
      variant: "info",
      recommendedAction: "Continue Studying",
    };
  }
  if (!readiness.valuesReady) {
    return {
      iconName: "alert-triangle",
      message: "Australian Values require 5/5 to pass. This is the fastest way to boost your readiness score.",
      variant: "warning",
      recommendedAction: "Review Values",
    };
  }
  if (readiness.score >= 75) {
    return {
      iconName: "party-popper",
      message: "You're looking test-ready! Take one more mock test to lock in your confidence before the real thing.",
      variant: "success",
      recommendedAction: "Take a Mock Test",
    };
  }
  if (readiness.score >= 40) {
    return {
      iconName: "trending-up",
      message: "Your scores are trending up! Keep the momentum going with consistent practice and study.",
      variant: "info",
      recommendedAction: "Smart Practice",
    };
  }
  return {
    iconName: "book-open",
    message: "Build your knowledge first — study the guide, then take practice tests to track your progress.",
    variant: "info",
    recommendedAction: "Continue Studying",
  };
}
