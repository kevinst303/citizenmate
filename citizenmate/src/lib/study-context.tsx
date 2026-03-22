"use client";

import { syncStudyProgressToSupabase, syncLanguageToSupabase } from "@/lib/sync";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { StudyProgress, TopicCategory } from "@/lib/types";
import { studyTopics } from "@/data/study-content";

// ===== Constants =====

const STORAGE_KEY = "citizenmate-study-progress";
const LANG_STORAGE_KEY = "citizenmate-study-lang";

export type StudyLanguage = "en" | "zh" | "both";

// ===== State =====

interface StudyState {
  progress: StudyProgress;
  language: StudyLanguage;
}

const initialProgress: StudyProgress = {
  completedSections: {},
  lastStudiedAt: null,
  lastSectionId: null,
};

const initialState: StudyState = {
  progress: initialProgress,
  language: "en",
};

// ===== Actions =====

type StudyAction =
  | { type: "TOGGLE_SECTION"; sectionId: string }
  | { type: "SET_LANGUAGE"; language: StudyLanguage }
  | { type: "RESET_PROGRESS" }
  | { type: "HYDRATE"; state: StudyState };

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case "TOGGLE_SECTION": {
      const isCompleted = !state.progress.completedSections[action.sectionId];
      const newCompleted = {
        ...state.progress.completedSections,
        [action.sectionId]: isCompleted,
      };
      // Remove key if uncompleted (keep storage clean)
      if (!isCompleted) {
        delete newCompleted[action.sectionId];
      }
      return {
        ...state,
        progress: {
          completedSections: newCompleted,
          lastStudiedAt: new Date().toISOString(),
          lastSectionId: action.sectionId,
        },
      };
    }
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    case "RESET_PROGRESS":
      return { ...state, progress: initialProgress };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

// ===== Helpers =====

export interface TopicProgress {
  completed: number;
  total: number;
  percentage: number;
}

function getTopicProgressFromState(
  progress: StudyProgress,
  topicId: TopicCategory
): TopicProgress {
  const topic = studyTopics.find((t) => t.id === topicId);
  if (!topic) return { completed: 0, total: 0, percentage: 0 };

  const total = topic.sections.length;
  const completed = topic.sections.filter(
    (s) => progress.completedSections[s.id]
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

function getOverallProgressFromState(progress: StudyProgress): TopicProgress {
  const allSections = studyTopics.flatMap((t) => t.sections);
  const total = allSections.length;
  const completed = allSections.filter(
    (s) => progress.completedSections[s.id]
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// ===== Context =====

interface StudyContextValue {
  progress: StudyProgress;
  language: StudyLanguage;
  toggleSection: (sectionId: string) => void;
  isSectionComplete: (sectionId: string) => boolean;
  getTopicProgress: (topicId: TopicCategory) => TopicProgress;
  getOverallProgress: () => TopicProgress;
  setLanguage: (language: StudyLanguage) => void;
  resetProgress: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

// ===== Provider =====

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);

      const progress = savedProgress
        ? (JSON.parse(savedProgress) as StudyProgress)
        : initialProgress;
      const language = (savedLang as StudyLanguage) || "en";

      dispatch({ type: "HYDRATE", state: { progress, language } });
    } catch {
      // Invalid storage data — use defaults
    }
  }, []);

  // Persist progress to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch {
      // Storage full or unavailable
    }

    // Background sync to Supabase
    import("@/lib/supabase").then(({ getSupabaseBrowserClient }) => {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncStudyProgressToSupabase(session.user.id).catch(() => {});
        }
      });
    }).catch(() => {});
  }, [state.progress]);

  // Persist language preference
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, state.language);
    } catch {
      // Storage full or unavailable
    }

    // Background sync to Supabase
    import("@/lib/supabase").then(({ getSupabaseBrowserClient }) => {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncLanguageToSupabase(session.user.id, state.language).catch(() => {});
        }
      });
    }).catch(() => {});
  }, [state.language]);

  const toggleSection = useCallback((sectionId: string) => {
    dispatch({ type: "TOGGLE_SECTION", sectionId });
  }, []);

  const isSectionComplete = useCallback(
    (sectionId: string) => {
      return !!state.progress.completedSections[sectionId];
    },
    [state.progress.completedSections]
  );

  const getTopicProgress = useCallback(
    (topicId: TopicCategory) => {
      return getTopicProgressFromState(state.progress, topicId);
    },
    [state.progress]
  );

  const getOverallProgress = useCallback(() => {
    return getOverallProgressFromState(state.progress);
  }, [state.progress]);

  const setLanguage = useCallback((language: StudyLanguage) => {
    dispatch({ type: "SET_LANGUAGE", language });
  }, []);

  const resetProgress = useCallback(() => {
    dispatch({ type: "RESET_PROGRESS" });
  }, []);

  return (
    <StudyContext.Provider
      value={{
        progress: state.progress,
        language: state.language,
        toggleSection,
        isSectionComplete,
        getTopicProgress,
        getOverallProgress,
        setLanguage,
        resetProgress,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

// ===== Hook =====

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return ctx;
}

// ===== Standalone accessor (for non-component usage) =====

export function getStudyProgress(): StudyProgress {
  if (typeof window === "undefined") return initialProgress;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StudyProgress) : initialProgress;
  } catch {
    return initialProgress;
  }
}
