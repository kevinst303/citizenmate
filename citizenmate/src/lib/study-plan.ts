import type { StudyProgress, TopicCategory } from "@/lib/types";
import { studyTopics } from "@/data/study-content";
import { getQuizHistory, calculateTopicMastery } from "@/lib/readiness";
import { getTestDate } from "@/lib/test-date-context";
import type { UrgencyLevel } from "@/lib/test-date-context";

// ===== Types =====

export interface StudyPlanSection {
  sectionId: string;
  sectionTitle: string;
  topicId: TopicCategory;
  topicTitle: string;
  isComplete: boolean;
  isHighPriority: boolean; // weak topic + incomplete → high priority
}

export interface StudyPlanDay {
  dayNumber: number; // 1-based
  date: string; // ISO date string
  sections: StudyPlanSection[];
  totalSections: number;
  estimatedMinutes: number;
}

export interface StudyPlan {
  generatedAt: string;
  testDate: string | null;
  daysUntilTest: number | null;
  urgencyLevel: UrgencyLevel;
  dailyPlan: StudyPlanDay[];
  weakTopics: TopicCategory[]; // topics where quiz accuracy < 75%
  summary: {
    totalSections: number;
    completedSections: number;
    remainingSections: number;
    sectionsPerDay: number;
    focusedTopicCount: number;
  };
}

// ===== Constants =====

/** Sections per study session (a reasonable daily target) */
const SECTIONS_PER_SESSION = 2;

/** Estimated time per section in minutes */
const MINUTES_PER_SECTION = 12;

/** Mastery threshold — topics below this are "weak" and get prioritized */
const WEAK_TOPIC_THRESHOLD = 75;

// ===== Core Algorithm =====

/**
 * Generate a personalized study plan based on test date, quiz history,
 * and study progress. Prioritizes weak topics first, then distributes
 * remaining sections evenly across available days.
 */
export function generateStudyPlan(progress?: StudyProgress): StudyPlan {
  const testDate = getTestDate();
  const quizHistory = getQuizHistory();
  const daysUntilTest = testDate ? getDaysUntilTest(testDate) : null;
  const urgencyLevel = getUrgencyLevel(daysUntilTest);

  // If no progress passed, read from standalone getter (non-React path)
  const effectiveProgress: StudyProgress = progress ?? getStudyProgressStandalone();

  // Build the master list of all sections with metadata
  const allSections = buildAllSections(effectiveProgress, quizHistory);

  // Identify weak topics (< 75% mastery from quizzes)
  const weakTopics = identifyWeakTopics(quizHistory, effectiveProgress);

  // Generate daily plan
  const dailyPlan = distributeSections(
    allSections,
    daysUntilTest,
    weakTopics,
  );

  const completedSections = allSections.filter((s) => s.isComplete).length;
  const remainingSections = allSections.length - completedSections;
  const planDays = dailyPlan.length;

  return {
    generatedAt: new Date().toISOString(),
    testDate,
    daysUntilTest,
    urgencyLevel,
    dailyPlan,
    weakTopics,
    summary: {
      totalSections: allSections.length,
      completedSections,
      remainingSections,
      sectionsPerDay: planDays > 0 ? Math.ceil(remainingSections / planDays) : 0,
      focusedTopicCount: weakTopics.length,
    },
  };
}

// ===== Helpers =====

function getDaysUntilTest(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyLevel(days: number | null): UrgencyLevel {
  if (days === null) return "none";
  if (days < 0) return "none";
  if (days <= 7) return "imminent";
  if (days <= 14) return "crunch";
  if (days <= 30) return "focused";
  return "relaxed";
}

function getStudyProgressStandalone(): StudyProgress {
  if (typeof window === "undefined") {
    return { completedSections: {}, lastStudiedAt: null, lastSectionId: null };
  }
  try {
    const saved = localStorage.getItem("citizenmate-study-progress");
    return saved
      ? JSON.parse(saved)
      : { completedSections: {}, lastStudiedAt: null, lastSectionId: null };
  } catch {
    return { completedSections: {}, lastStudiedAt: null, lastSectionId: null };
  }
}

function buildAllSections(
  progress: StudyProgress,
  quizHistory: ReturnType<typeof getQuizHistory>,
): StudyPlanSection[] {
  const sections: StudyPlanSection[] = [];

  for (const topic of studyTopics) {
    const mastery = calculateTopicMastery(topic.id, quizHistory, progress);
    const isWeak = mastery.quizAccuracy < WEAK_TOPIC_THRESHOLD;

    for (const section of topic.sections) {
      const isComplete = !!progress.completedSections[section.id];
      sections.push({
        sectionId: section.id,
        sectionTitle: section.title,
        topicId: topic.id,
        topicTitle: topic.title,
        isComplete,
        isHighPriority: !isComplete && isWeak,
      });
    }
  }

  return sections;
}

function identifyWeakTopics(
  quizHistory: ReturnType<typeof getQuizHistory>,
  progress: StudyProgress,
): TopicCategory[] {
  const topicIds: TopicCategory[] = [
    "australia-people",
    "democratic-beliefs",
    "government-law",
    "australian-values",
  ];

  return topicIds.filter((id) => {
    const mastery = calculateTopicMastery(id, quizHistory, progress);
    return mastery.quizAccuracy < WEAK_TOPIC_THRESHOLD;
  });
}

/**
 * Distribute remaining (incomplete) sections across available days.
 * Priority ordering:
 *   1. High-priority sections (weak topic + incomplete) first
 *   2. Regular incomplete sections second
 *   3. Within each group, group by topic for coherent study sessions
 */
function distributeSections(
  allSections: StudyPlanSection[],
  daysUntilTest: number | null,
  _weakTopics: TopicCategory[],
): StudyPlanDay[] {
  const remaining = allSections.filter((s) => !s.isComplete);

  if (remaining.length === 0) {
    // All done! Return a congratulatory empty plan.
    return [];
  }

  // Sort: high priority first, then grouped by topic
  const sorted = [...remaining].sort((a, b) => {
    // High priority always comes first
    if (a.isHighPriority && !b.isHighPriority) return -1;
    if (!a.isHighPriority && b.isHighPriority) return 1;
    // Within same priority, group by topic
    return a.topicId.localeCompare(b.topicId);
  });

  // Determine number of days for distribution
  // - If test date is set: use days until test (min 1 day, max remaining sections count)
  // - If no test date: use a sensible default (~2 weeks to cover all sections at 2/day)
  const effectiveDays = daysUntilTest && daysUntilTest > 0
    ? Math.min(daysUntilTest, sorted.length)
    : Math.ceil(sorted.length / SECTIONS_PER_SESSION);

  const sectionsPerDay = Math.ceil(sorted.length / effectiveDays);

  const dailyPlan: StudyPlanDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < effectiveDays; i++) {
    const daySections = sorted.slice(
      i * sectionsPerDay,
      Math.min((i + 1) * sectionsPerDay, sorted.length),
    );

    if (daySections.length === 0) break;

    const planDate = new Date(today);
    planDate.setDate(today.getDate() + i);

    dailyPlan.push({
      dayNumber: i + 1,
      date: planDate.toISOString().split("T")[0],
      sections: daySections,
      totalSections: daySections.length,
      estimatedMinutes: daySections.length * MINUTES_PER_SECTION,
    });
  }

  return dailyPlan;
}

// ===== Standalone accessor (for non-component usage) =====

export function getCachedPlan(): StudyPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("citizenmate-study-plan");
    return saved ? (JSON.parse(saved) as StudyPlan) : null;
  } catch {
    return null;
  }
}

export function cachePlan(plan: StudyPlan): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("citizenmate-study-plan", JSON.stringify(plan));
  } catch {
    // Storage error — non-critical
  }
}
