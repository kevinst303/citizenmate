"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { TopicCategory, QuizQuestion } from "@/lib/types";
import type { QuestionPerformance, SRSState, SRSStats, TopicWeakness } from "@/lib/srs-types";
import {
  updatePerformance,
  selectSmartQuestions,
  calculateSRSStats,
  analyzeTopicWeakness,
} from "@/lib/srs-engine";
import { questionBank } from "@/data/questions";

// ─── Constants ───────────────────────────────────────────

const STORAGE_KEY = "citizenmate-srs-data";

// ─── State ───────────────────────────────────────────────

const initialState: SRSState = {
  performances: {},
  lastUpdatedAt: new Date().toISOString(),
};

// ─── Actions ─────────────────────────────────────────────

type SRSAction =
  | {
      type: "RECORD_ANSWER";
      questionId: string;
      topic: TopicCategory;
      wasCorrect: boolean;
    }
  | {
      type: "RECORD_BATCH";
      answers: Array<{
        questionId: string;
        topic: TopicCategory;
        wasCorrect: boolean;
      }>;
    }
  | { type: "LOAD_STATE"; state: SRSState }
  | { type: "RESET" };

function srsReducer(state: SRSState, action: SRSAction): SRSState {
  switch (action.type) {
    case "RECORD_ANSWER": {
      const current = state.performances[action.questionId] ?? null;
      const updated = updatePerformance(
        action.questionId,
        action.topic,
        action.wasCorrect,
        current
      );
      return {
        performances: {
          ...state.performances,
          [action.questionId]: updated,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    }

    case "RECORD_BATCH": {
      const newPerformances = { ...state.performances };
      for (const answer of action.answers) {
        const current = newPerformances[answer.questionId] ?? null;
        newPerformances[answer.questionId] = updatePerformance(
          answer.questionId,
          answer.topic,
          answer.wasCorrect,
          current
        );
      }
      return {
        performances: newPerformances,
        lastUpdatedAt: new Date().toISOString(),
      };
    }

    case "LOAD_STATE":
      return action.state;

    case "RESET":
      return { ...initialState, lastUpdatedAt: new Date().toISOString() };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────

interface SRSContextValue {
  state: SRSState;
  /** Record a single question answer */
  recordAnswer: (
    questionId: string,
    topic: TopicCategory,
    wasCorrect: boolean
  ) => void;
  /** Record multiple answers at once (e.g., after a mock test) */
  recordBatch: (
    answers: Array<{
      questionId: string;
      topic: TopicCategory;
      wasCorrect: boolean;
    }>
  ) => void;
  /** Get smart-ordered questions for a practice session */
  getSmartQuestions: (
    count: number,
    focusTopic?: TopicCategory
  ) => QuizQuestion[];
  /** Get aggregate SRS statistics */
  getStats: () => SRSStats;
  /** Get topic weakness analysis */
  getTopicWeakness: () => TopicWeakness[];
  /** Reset all SRS data */
  resetSRS: () => void;
}

const SRSContext = createContext<SRSContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────

export function SRSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(srsReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SRSState;
        dispatch({ type: "LOAD_STATE", state: parsed });
      }
    } catch {
      // Silent fail — start fresh
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded — silent fail
    }
  }, [state]);

  const recordAnswer = useCallback(
    (questionId: string, topic: TopicCategory, wasCorrect: boolean) => {
      dispatch({ type: "RECORD_ANSWER", questionId, topic, wasCorrect });
    },
    []
  );

  const recordBatch = useCallback(
    (
      answers: Array<{
        questionId: string;
        topic: TopicCategory;
        wasCorrect: boolean;
      }>
    ) => {
      dispatch({ type: "RECORD_BATCH", answers });
    },
    []
  );

  const getSmartQuestions = useCallback(
    (count: number, focusTopic?: TopicCategory) => {
      return selectSmartQuestions(
        state.performances,
        questionBank,
        count,
        focusTopic
      );
    },
    [state.performances]
  );

  const getStats = useCallback(() => {
    return calculateSRSStats(state.performances, questionBank.length);
  }, [state.performances]);

  const getTopicWeakness = useCallback(() => {
    return analyzeTopicWeakness(state.performances);
  }, [state.performances]);

  const resetSRS = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <SRSContext.Provider
      value={{
        state,
        recordAnswer,
        recordBatch,
        getSmartQuestions,
        getStats,
        getTopicWeakness,
        resetSRS,
      }}
    >
      {children}
    </SRSContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────

export function useSRS() {
  const context = useContext(SRSContext);
  if (!context) {
    throw new Error("useSRS must be used within an SRSProvider");
  }
  return context;
}

// ─── Standalone accessor (for use outside React) ─────────

export function getSRSData(): SRSState {
  if (typeof window === "undefined") return initialState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as SRSState) : initialState;
  } catch {
    return initialState;
  }
}
