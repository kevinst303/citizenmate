import { getSupabaseBrowserClient } from "@/lib/supabase";

// ===== Data Sync Layer =====
// Bidirectional sync between localStorage and Supabase.
// localStorage remains the primary store; Supabase syncs in background for signed-in users.

// ── Storage keys (must match the ones in context files) ──

const STUDY_PROGRESS_KEY = "citizenmate-study-progress";
const QUIZ_HISTORY_KEY = "citizenmate-quiz-history";
const TEST_DATE_KEY = "citizenmate-test-date";
const STUDY_LANG_KEY = "citizenmate-study-lang";

// ── Check if Supabase is configured ──

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ── Sync study progress: localStorage → Supabase ──

export async function syncStudyProgressToSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (typeof window === "undefined") return;

  try {
    const saved = localStorage.getItem(STUDY_PROGRESS_KEY);
    if (!saved) return;

    const progress = JSON.parse(saved) as {
      completedSections: Record<string, boolean>;
      lastStudiedAt: string | null;
      lastSectionId: string | null;
    };

    const supabase = getSupabaseBrowserClient();

    await supabase.from("study_progress").upsert(
      {
        user_id: userId,
        completed_sections: progress.completedSections,
        last_studied_at: progress.lastStudiedAt,
        last_section_id: progress.lastSectionId,
      },
      { onConflict: "user_id" }
    );
  } catch (err) {
    console.error("[sync] Failed to sync study progress:", err);
  }
}

// ── Sync quiz history: localStorage → Supabase ──

export async function syncQuizHistoryToSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (typeof window === "undefined") return;

  try {
    const saved = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!saved) return;

    const history = JSON.parse(saved) as Array<{
      testId: string;
      score: number;
      total: number;
      valuesCorrect: number;
      valuesTotal: number;
      passed: boolean;
      topicBreakdown?: Record<string, { correct: number; total: number }>;
      completedAt: string;
    }>;

    if (history.length === 0) return;

    const supabase = getSupabaseBrowserClient();

    // Get existing history to avoid duplicates
    const { data: existing } = await supabase
      .from("quiz_history")
      .select("completed_at")
      .eq("user_id", userId);

    const existingDates = new Set(
      (existing ?? []).map((r: { completed_at: string }) => r.completed_at)
    );

    // Only insert new entries
    const newEntries = history
      .filter((h) => !existingDates.has(h.completedAt))
      .map((h) => ({
        user_id: userId,
        test_id: h.testId,
        score: h.score,
        total: h.total,
        values_correct: h.valuesCorrect,
        values_total: h.valuesTotal,
        passed: h.passed,
        topic_breakdown: h.topicBreakdown ?? null,
        completed_at: h.completedAt,
      }));

    if (newEntries.length > 0) {
      await supabase.from("quiz_history").insert(newEntries);
    }
  } catch (err) {
    console.error("[sync] Failed to sync quiz history:", err);
  }
}

// ── Sync test date: localStorage → Supabase profile ──

export async function syncTestDateToSupabase(
  userId: string,
  testDate: string | null
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseBrowserClient();
    await supabase
      .from("profiles")
      .update({ test_date: testDate })
      .eq("id", userId);
  } catch (err) {
    console.error("[sync] Failed to sync test date:", err);
  }
}

// ── Sync language preference: localStorage → Supabase profile ──

export async function syncLanguageToSupabase(
  userId: string,
  language: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseBrowserClient();
    await supabase
      .from("profiles")
      .update({ preferred_language: language })
      .eq("id", userId);
  } catch (err) {
    console.error("[sync] Failed to sync language:", err);
  }
}

// ── Push ALL local data to Supabase (on first sign-in) ──

export async function syncAllToSupabase(userId: string): Promise<void> {
  await Promise.all([
    syncStudyProgressToSupabase(userId),
    syncQuizHistoryToSupabase(userId),
    syncTestDateToSupabase(
      userId,
      typeof window !== "undefined"
        ? localStorage.getItem(TEST_DATE_KEY)
        : null
    ),
    syncLanguageToSupabase(
      userId,
      typeof window !== "undefined"
        ? localStorage.getItem(STUDY_LANG_KEY) ?? "en"
        : "en"
    ),
  ]);
}

// ── Pull all data from Supabase → localStorage (on sign-in) ──

export async function pullFromSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (typeof window === "undefined") return;

  try {
    const supabase = getSupabaseBrowserClient();

    // Pull profile (test date + language)
    const { data: profile } = await supabase
      .from("profiles")
      .select("test_date, preferred_language")
      .eq("id", userId)
      .single();

    if (profile) {
      if (profile.test_date) {
        localStorage.setItem(TEST_DATE_KEY, profile.test_date);
      }
      if (profile.preferred_language) {
        localStorage.setItem(STUDY_LANG_KEY, profile.preferred_language);
      }
    }

    // Pull study progress
    const { data: studyData } = await supabase
      .from("study_progress")
      .select("completed_sections, last_studied_at, last_section_id")
      .eq("user_id", userId)
      .single();

    if (studyData) {
      // Merge: union of completed sections (keep any local + any cloud)
      const localSaved = localStorage.getItem(STUDY_PROGRESS_KEY);
      const localProgress = localSaved
        ? (JSON.parse(localSaved) as {
            completedSections: Record<string, boolean>;
          })
        : { completedSections: {} };

      const cloudSections =
        (studyData.completed_sections as Record<string, boolean>) ?? {};
      const merged = {
        completedSections: {
          ...localProgress.completedSections,
          ...cloudSections,
        },
        lastStudiedAt: studyData.last_studied_at,
        lastSectionId: studyData.last_section_id,
      };

      localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(merged));
    }

    // Pull quiz history
    const { data: quizData } = await supabase
      .from("quiz_history")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: true });

    if (quizData && quizData.length > 0) {
      // Merge with local history (deduplicate by completed_at)
      const localHistorySaved = localStorage.getItem(QUIZ_HISTORY_KEY);
      const localHistory = localHistorySaved
        ? (JSON.parse(localHistorySaved) as Array<{
            completedAt: string;
          }>)
        : [];

      const localDates = new Set(localHistory.map((h) => h.completedAt));

      const cloudEntries = quizData
        .filter(
          (r: { completed_at: string }) => !localDates.has(r.completed_at)
        )
        .map(
          (r: {
            test_id: string;
            score: number;
            total: number;
            values_correct: number;
            values_total: number;
            passed: boolean;
            topic_breakdown: Record<string, { correct: number; total: number }> | null;
            completed_at: string;
          }) => ({
            testId: r.test_id,
            score: r.score,
            total: r.total,
            valuesCorrect: r.values_correct,
            valuesTotal: r.values_total,
            passed: r.passed,
            topicBreakdown: r.topic_breakdown,
            completedAt: r.completed_at,
          })
        );

      const merged = [...localHistory, ...cloudEntries].sort(
        (a, b) =>
          new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      );

      localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(merged));
    }
  } catch (err) {
    console.error("[sync] Failed to pull from Supabase:", err);
  }
}
