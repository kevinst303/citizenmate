import type { StudyProgress, TopicCategory } from "@/lib/types";
import { studyTopics } from "@/data/study-content";

// ===== Types =====

export interface QuizResult {
  testId: string;
  score: number;
  total: number;
  valuesCorrect: number;
  valuesTotal: number;
  passed: boolean;
  completedAt: string;
  topicBreakdown?: Record<string, { correct: number; total: number }>;
}

export interface TopicMastery {
  topicId: TopicCategory;
  quizAccuracy: number; // 0-100
  studyCompletion: number; // 0-100
  overallMastery: number; // 0-100
  label: string;
}

export interface ReadinessData {
  score: number; // 0-100
  message: string;
  iconName: string;
  quizComponent: number; // 0-100
  studyComponent: number; // 0-100
  topicMastery: TopicMastery[];
  valuesReady: boolean;
  bestQuizScore: QuizResult | null;
  totalQuizzesTaken: number;
}

// ===== Constants =====

const QUIZ_WEIGHT = 0.6;
const STUDY_WEIGHT = 0.4;
const QUIZ_HISTORY_KEY = "citizenmate-quiz-history";

// ===== Quiz History (localStorage) =====

export function getQuizHistory(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(QUIZ_HISTORY_KEY);
    return saved ? (JSON.parse(saved) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = getQuizHistory();
    history.push(result);
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage error
  }
}

// ===== Readiness Calculations =====

function getBestQuizScore(history: QuizResult[]): QuizResult | null {
  if (history.length === 0) return null;
  return history.reduce((best, current) =>
    current.score / current.total > best.score / best.total ? current : best
  );
}

function getQuizAccuracyForTopic(
  topicId: TopicCategory,
  history: QuizResult[]
): number {
  // Look at the latest quiz result that has a topic breakdown
  const withBreakdown = history.filter((r) => r.topicBreakdown?.[topicId]);
  if (withBreakdown.length === 0) return 0;

  const latest = withBreakdown[withBreakdown.length - 1];
  const breakdown = latest.topicBreakdown![topicId];
  return breakdown.total > 0
    ? Math.round((breakdown.correct / breakdown.total) * 100)
    : 0;
}

function getStudyCompletionForTopic(
  topicId: TopicCategory,
  progress: StudyProgress
): number {
  const topic = studyTopics.find((t) => t.id === topicId);
  if (!topic) return 0;

  const total = topic.sections.length;
  if (total === 0) return 0;

  const completed = topic.sections.filter(
    (s) => progress.completedSections[s.id]
  ).length;

  return Math.round((completed / total) * 100);
}

const TOPIC_LABELS: Record<TopicCategory, string> = {
  "australia-people": "Australia & Its People",
  "democratic-beliefs": "Democratic Beliefs",
  "government-law": "Government & Law",
  "australian-values": "Australian Values",
};

export function calculateTopicMastery(
  topicId: TopicCategory,
  quizHistory: QuizResult[],
  studyProgress: StudyProgress
): TopicMastery {
  const quizAccuracy = getQuizAccuracyForTopic(topicId, quizHistory);
  const studyCompletion = getStudyCompletionForTopic(topicId, studyProgress);

  // If no quizzes taken, study completion carries full weight
  const hasQuizData = quizHistory.some((r) => r.topicBreakdown?.[topicId]);
  const overallMastery = hasQuizData
    ? Math.round(quizAccuracy * QUIZ_WEIGHT + studyCompletion * STUDY_WEIGHT)
    : studyCompletion;

  return {
    topicId,
    quizAccuracy,
    studyCompletion,
    overallMastery,
    label: TOPIC_LABELS[topicId],
  };
}

export function calculateReadiness(
  quizHistory: QuizResult[],
  studyProgress: StudyProgress
): ReadinessData {
  const topicIds: TopicCategory[] = [
    "australia-people",
    "democratic-beliefs",
    "government-law",
    "australian-values",
  ];

  const topicMastery = topicIds.map((id) =>
    calculateTopicMastery(id, quizHistory, studyProgress)
  );

  const bestQuiz = getBestQuizScore(quizHistory);

  // Quiz component: best quiz score percentage
  const quizComponent = bestQuiz
    ? Math.round((bestQuiz.score / bestQuiz.total) * 100)
    : 0;

  // Study component: average study completion across topics
  const studyComponent =
    topicMastery.length > 0
      ? Math.round(
          topicMastery.reduce((sum, t) => sum + t.studyCompletion, 0) /
            topicMastery.length
        )
      : 0;

  // Combined score
  const hasQuizData = quizHistory.length > 0;
  const score = hasQuizData
    ? Math.round(quizComponent * QUIZ_WEIGHT + studyComponent * STUDY_WEIGHT)
    : studyComponent;

  // Values readiness
  const valuesReady = bestQuiz
    ? bestQuiz.valuesCorrect === bestQuiz.valuesTotal
    : false;

  // Anxiety-reducing messaging
  const { message, iconName } = getReadinessMessage(score, hasQuizData, valuesReady);

  return {
    score,
    message,
    iconName,
    quizComponent,
    studyComponent,
    topicMastery,
    valuesReady,
    bestQuizScore: bestQuiz,
    totalQuizzesTaken: quizHistory.length,
  };
}

// ===== Anxiety-Reducing Messages =====

function getReadinessMessage(
  score: number,
  hasQuizData: boolean,
  valuesReady: boolean
): { message: string; iconName: string } {
  if (!hasQuizData && score === 0) {
    return {
      message: "Start studying or take a mock test to see your readiness, mate.",
      iconName: "hand",
    };
  }

  if (score < 25) {
    return {
      message:
        "You're just getting started — keep going and you'll build momentum fast!",
      iconName: "seedling",
    };
  }

  if (score < 50) {
    return {
      message: `You've already mastered ${score}% of what you need, mate. Keep it up!`,
      iconName: "dumbbell",
    };
  }

  if (score < 75) {
    return {
      message: `Great progress — ${score}% ready! Focus on your weak areas and you'll be there.`,
      iconName: "flame",
    };
  }

  if (score < 90) {
    if (!valuesReady) {
      return {
        message: `${score}% ready — almost there! Make sure you nail the Australian Values section.`,
        iconName: "zap",
      };
    }
    return {
      message: `${score}% ready — you're on track to pass! Keep practising, mate.`,
      iconName: "star",
    };
  }

  return {
    message:
      "You're looking ready to pass, mate! Consider booking your test if you haven't already.",
    iconName: "party-popper",
  };
}
