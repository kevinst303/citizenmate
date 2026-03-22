"use client";

import { syncQuizHistoryToSupabase } from "@/lib/sync";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type {
  QuizTest,
  QuizAnswer,
  QuizResult,
  QuizStatus,
  TopicBreakdown,
  TopicCategory,
} from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import { getTestById } from "@/data/tests";

// ─── State ───────────────────────────────────────────────

interface QuizState {
  test: QuizTest | null;
  status: QuizStatus;
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> selectedAnswer
  flaggedQuestions: Set<string>;
  timeRemaining: number; // seconds
  result: QuizResult | null;
  startedAt: string | null;
}

const initialState: QuizState = {
  test: null,
  status: "idle",
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: new Set(),
  timeRemaining: 2700,
  result: null,
  startedAt: null,
};

// ─── Actions ─────────────────────────────────────────────

type QuizAction =
  | { type: "START_QUIZ"; test: QuizTest }
  | { type: "SELECT_ANSWER"; questionId: string; answerIndex: number }
  | { type: "TOGGLE_FLAG"; questionId: string }
  | { type: "NAVIGATE_TO"; index: number }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "TICK_TIMER" }
  | { type: "SUBMIT_QUIZ" }
  | { type: "TIME_UP" }
  | { type: "RESET" };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...initialState,
        test: action.test,
        status: "in-progress",
        timeRemaining: action.test.timeLimit,
        startedAt: new Date().toISOString(),
      };

    case "SELECT_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answerIndex,
        },
      };

    case "TOGGLE_FLAG": {
      const newFlagged = new Set(state.flaggedQuestions);
      if (newFlagged.has(action.questionId)) {
        newFlagged.delete(action.questionId);
      } else {
        newFlagged.add(action.questionId);
      }
      return { ...state, flaggedQuestions: newFlagged };
    }

    case "NAVIGATE_TO":
      if (!state.test) return state;
      return {
        ...state,
        currentQuestionIndex: Math.max(
          0,
          Math.min(action.index, state.test.questions.length - 1)
        ),
      };

    case "NEXT_QUESTION":
      if (!state.test) return state;
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.test.questions.length - 1
        ),
      };

    case "PREV_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case "TICK_TIMER":
      if (state.timeRemaining <= 1) {
        return { ...state, timeRemaining: 0 };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };

    case "SUBMIT_QUIZ":
    case "TIME_UP": {
      if (!state.test) return state;
      const result = calculateResult(state);
      saveAttempt(state, result);
      return {
        ...state,
        status: action.type === "TIME_UP" ? "timed-out" : "completed",
        result,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ─── Scoring ─────────────────────────────────────────────

function calculateResult(state: QuizState): QuizResult {
  const { test, answers, timeRemaining, startedAt } = state;
  if (!test) throw new Error("No test loaded");

  let score = 0;
  let valuesScore = 0;
  const topicCounts: Record<TopicCategory, { correct: number; total: number }> =
    {
      "australia-people": { correct: 0, total: 0 },
      "democratic-beliefs": { correct: 0, total: 0 },
      "government-law": { correct: 0, total: 0 },
      "australian-values": { correct: 0, total: 0 },
    };

  for (const question of test.questions) {
    topicCounts[question.topic].total++;

    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      score++;
      topicCounts[question.topic].correct++;
      if (question.isValuesQuestion) valuesScore++;
    }
  }

  const topicBreakdown: TopicBreakdown[] = Object.entries(topicCounts).map(
    ([topic, counts]) => ({
      topic: topic as TopicCategory,
      correct: counts.correct,
      total: counts.total,
      percentage:
        counts.total > 0 ? Math.round((counts.correct / counts.total) * 100) : 0,
    })
  );

  const valuesPassed = valuesScore === 5;
  const passed = score >= 15 && valuesPassed;
  const timeUsed = test.timeLimit - timeRemaining;

  return {
    testId: test.id,
    score,
    totalQuestions: test.questions.length,
    passed,
    valuesScore,
    valuesPassed,
    topicBreakdown,
    timeUsed,
    completedAt: new Date().toISOString(),
  };
}

// ─── localStorage persistence ────────────────────────────

const STORAGE_KEY = "citizenmate_attempts";

function saveAttempt(state: QuizState, result: QuizResult) {
  if (typeof window === "undefined" || !state.test) return;

  try {
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Array<Record<string, unknown>>;

    existing.push({
      id: `${state.test.id}-${Date.now()}`,
      testId: state.test.id,
      answers: state.answers,
      flaggedQuestions: Array.from(state.flaggedQuestions),
      startedAt: state.startedAt,
      completedAt: result.completedAt,
      timeRemaining: state.timeRemaining,
      result,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // Also save to readiness quiz history (used by dashboard)
    const QUIZ_HISTORY_KEY = "citizenmate-quiz-history";
    const historyRaw = localStorage.getItem(QUIZ_HISTORY_KEY);
    const history = historyRaw ? JSON.parse(historyRaw) as Array<Record<string, unknown>> : [];
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    for (const b of result.topicBreakdown) {
      topicBreakdown[b.topic] = { correct: b.correct, total: b.total };
    }
    history.push({
      testId: result.testId,
      score: result.score,
      total: result.totalQuestions,
      valuesCorrect: result.valuesScore,
      valuesTotal: 5,
      passed: result.passed,
      topicBreakdown,
      completedAt: result.completedAt,
    });
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));

    // Update SRS performance data for each question
    try {
      const SRS_KEY = "citizenmate-srs-data";
      const srsRaw = localStorage.getItem(SRS_KEY);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const srsData: { performances: Record<string, any>; lastUpdatedAt: string } = srsRaw
        ? JSON.parse(srsRaw)
        : { performances: {}, lastUpdatedAt: new Date().toISOString() };

      // Dynamically import the SRS engine to avoid circular deps
      import("@/lib/srs-engine").then(({ updatePerformance }) => {
        for (const question of state.test!.questions) {
          const userAnswer = state.answers[question.id];
          if (userAnswer === undefined) continue; // unanswered

          const wasCorrect = userAnswer === question.correctAnswer;
          const current = srsData.performances[question.id] ?? null;
          srsData.performances[question.id] = updatePerformance(
            question.id,
            question.topic,
            wasCorrect,
            current
          );
        }

        srsData.lastUpdatedAt = new Date().toISOString();
        localStorage.setItem(SRS_KEY, JSON.stringify(srsData));
      }).catch(() => {});
    } catch {
      // SRS update failed — non-critical
    }
  } catch {
    // Silent fail for localStorage quota/errors
  }

  // Background sync to Supabase (non-blocking)
  if (typeof window !== "undefined") {
    try {
      // Dynamically check auth state without requiring a provider
      import("@/lib/supabase").then(({ getSupabaseBrowserClient }) => {
        const supabase = getSupabaseBrowserClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            syncQuizHistoryToSupabase(session.user.id).catch(() => {});
          }
        });
      }).catch(() => {});
    } catch {
      // Supabase not configured — skip
    }
  }
}

export function getAttemptHistory(): Array<{
  testId: string;
  result: QuizResult;
  completedAt: string;
}> {
  if (typeof window === "undefined") return [];
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Array<{ testId: string; result: QuizResult; completedAt: string }>;
    return data;
  } catch {
    return [];
  }
}

// ─── Context ─────────────────────────────────────────────

interface QuizContextValue {
  state: QuizState;
  currentQuestion: ReturnType<typeof getCurrentQuestion>;
  startQuiz: (testId: string) => void;
  selectAnswer: (questionId: string, answerIndex: number) => void;
  toggleFlag: (questionId: string) => void;
  navigateTo: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  answeredCount: number;
  progress: number;
}

function getCurrentQuestion(state: QuizState) {
  if (!state.test) return null;
  return state.test.questions[state.currentQuestionIndex] ?? null;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer management
  useEffect(() => {
    if (state.status === "in-progress" && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.status, state.timeRemaining > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-submit on time up
  useEffect(() => {
    if (state.status === "in-progress" && state.timeRemaining <= 0) {
      dispatch({ type: "TIME_UP" });
    }
  }, [state.timeRemaining, state.status]);

  const startQuiz = useCallback((testId: string) => {
    const test = getTestById(testId);
    if (test) {
      dispatch({ type: "START_QUIZ", test });
    }
  }, []);

  const selectAnswer = useCallback(
    (questionId: string, answerIndex: number) => {
      dispatch({ type: "SELECT_ANSWER", questionId, answerIndex });
    },
    []
  );

  const toggleFlag = useCallback((questionId: string) => {
    dispatch({ type: "TOGGLE_FLAG", questionId });
  }, []);

  const navigateTo = useCallback((index: number) => {
    dispatch({ type: "NAVIGATE_TO", index });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const prevQuestion = useCallback(() => {
    dispatch({ type: "PREV_QUESTION" });
  }, []);

  const submitQuiz = useCallback(() => {
    dispatch({ type: "SUBMIT_QUIZ" });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const currentQuestion = getCurrentQuestion(state);
  const answeredCount = Object.keys(state.answers).length;
  const progress = state.test
    ? Math.round((answeredCount / state.test.questions.length) * 100)
    : 0;

  return (
    <QuizContext.Provider
      value={{
        state,
        currentQuestion,
        startQuiz,
        selectAnswer,
        toggleFlag,
        navigateTo,
        nextQuestion,
        prevQuestion,
        submitQuiz,
        resetQuiz,
        answeredCount,
        progress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
