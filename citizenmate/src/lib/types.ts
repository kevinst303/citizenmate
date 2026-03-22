// ===== CitizenMate Quiz Engine Types =====

export type TopicCategory =
  | "australia-people"
  | "democratic-beliefs"
  | "government-law"
  | "australian-values";

export const TOPIC_LABELS: Record<TopicCategory, string> = {
  "australia-people": "Australia and Its People",
  "democratic-beliefs": "Democratic Beliefs, Rights & Liberties",
  "government-law": "Government and the Law",
  "australian-values": "Australian Values",
};

export interface QuizQuestion {
  id: string;
  text: string;
  options: [string, string, string, string];
  /** Index of the correct answer (0-3) */
  correctAnswer: number;
  topic: TopicCategory;
  /** If true, this is an Australian Values question — all must be correct to pass */
  isValuesQuestion: boolean;
  /** Explanation shown after the test */
  rationale: string;
  /** Reference to the section of "Our Common Bond" */
  bookReference: string;
}

export interface QuizTest {
  id: string;
  title: string;
  description: string;
  /** Total questions (always 20 for a full mock) */
  totalQuestions: number;
  /** Number of values questions (always 5) */
  valuesQuestions: number;
  /** Time limit in seconds (2700 = 45 minutes) */
  timeLimit: number;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
}

export type QuizStatus = "idle" | "in-progress" | "completed" | "timed-out";

export interface TopicBreakdown {
  topic: TopicCategory;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizResult {
  testId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  valuesScore: number;
  valuesPassed: boolean;
  topicBreakdown: TopicBreakdown[];
  timeUsed: number; // in seconds
  completedAt: string; // ISO timestamp
}

export interface QuizAttempt {
  id: string;
  testId: string;
  answers: Record<string, number>; // questionId -> selectedAnswer
  flaggedQuestions: string[];
  startedAt: string;
  completedAt: string | null;
  timeRemaining: number;
  result: QuizResult | null;
}

// ===== CitizenMate Study Mode Types =====

export interface StudySection {
  id: string;
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  keyFacts: string[];
  keyFactsZh: string[];
  relatedQuestionIds: string[];
}

export interface StudyTopic {
  id: TopicCategory;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  sections: StudySection[];
}

export interface StudyProgress {
  completedSections: Record<string, boolean>;
  lastStudiedAt: string | null;
  lastSectionId: string | null;
}
