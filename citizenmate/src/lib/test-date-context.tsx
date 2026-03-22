"use client";

import { syncTestDateToSupabase } from "@/lib/sync";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

// ===== Constants =====

const STORAGE_KEY = "citizenmate-test-date";

export type UrgencyLevel = "relaxed" | "focused" | "crunch" | "imminent" | "none";

// ===== Helpers =====

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  // Reset time portions so we compare dates only
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgency(days: number | null): UrgencyLevel {
  if (days === null) return "none";
  if (days < 0) return "none"; // past
  if (days <= 7) return "imminent";
  if (days <= 14) return "crunch";
  if (days <= 30) return "focused";
  return "relaxed";
}

// ===== Context =====

interface TestDateContextValue {
  testDate: string | null;
  daysUntilTest: number | null;
  urgencyLevel: UrgencyLevel;
  setTestDate: (date: string) => void;
  clearTestDate: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TestDateContext = createContext<TestDateContextValue | null>(null);

// ===== Provider =====

export function TestDateProvider({ children }: { children: ReactNode }) {
  const [testDate, setTestDateState] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Validate it's a future date
        const d = new Date(saved);
        if (!isNaN(d.getTime())) {
          setTestDateState(saved);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (testDate) {
        localStorage.setItem(STORAGE_KEY, testDate);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }

    // Background sync to Supabase
    import("@/lib/supabase").then(({ getSupabaseBrowserClient }) => {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncTestDateToSupabase(session.user.id, testDate).catch(() => {});
        }
      });
    }).catch(() => {});
  }, [testDate]);

  const setTestDate = useCallback((date: string) => {
    setTestDateState(date);
  }, []);

  const clearTestDate = useCallback(() => {
    setTestDateState(null);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const daysUntilTest = useMemo(() => getDaysUntil(testDate), [testDate]);
  const urgencyLevel = useMemo(() => getUrgency(daysUntilTest), [daysUntilTest]);

  return (
    <TestDateContext.Provider
      value={{
        testDate,
        daysUntilTest,
        urgencyLevel,
        setTestDate,
        clearTestDate,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </TestDateContext.Provider>
  );
}

// ===== Hook =====

export function useTestDate(): TestDateContextValue {
  const ctx = useContext(TestDateContext);
  if (!ctx) {
    throw new Error("useTestDate must be used within a TestDateProvider");
  }
  return ctx;
}
