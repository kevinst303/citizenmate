"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useState,
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

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from idb-keyval on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("idb-keyval").then(({ get }) => {
      get<SRSState>(STORAGE_KEY)
        .then((saved) => {
          if (saved) {
            dispatch({ type: "LOAD_STATE", state: saved });
          }
        })
        .catch(() => {
          // Silent fail — start fresh
        })
        .finally(() => {
          setIsLoaded(true);
        });
    });
  }, []);

  // Persist to idb-keyval on every state change, but ONLY after initial load
  useEffect(() => {
    if (typeof window === "undefined" || !isLoaded) return;
    
    import("idb-keyval").then(({ set }) => {
      set(STORAGE_KEY, state).catch(() => {
        // Storage quota exceeded — silent fail
      });
    });
  }, [state, isLoaded]);

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

  const value = useMemo(
    () => ({
      state,
      recordAnswer,
      recordBatch,
      getSmartQuestions,
      getStats,
      getTopicWeakness,
      resetSRS,
    }),
    [
      state,
      recordAnswer,
      recordBatch,
      getSmartQuestions,
      getStats,
      getTopicWeakness,
      resetSRS,
    ]
  );

  return (
    <SRSContext.Provider value={value}>
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
