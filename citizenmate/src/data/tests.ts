import { questionBank } from "./questions";
import type { QuizTest, QuizQuestion } from "@/lib/types";

/**
 * Selects N random questions from a filtered subset, ensuring no duplicates.
 */
function pickRandom(pool: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Build a mock test with 20 questions:
 * - 15 general questions (from australia-people, democratic-beliefs, government-law)
 * - 5 Australian Values questions (isValuesQuestion: true)
 */
function buildTest(
  id: string,
  title: string,
  description: string,
  seed: number
): QuizTest {
  // Use seed for consistent shuffling per test
  const seededRandom = (a: number) => {
    let s = a;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  const rng = seededRandom(seed);

  const generalPool = questionBank.filter((q) => !q.isValuesQuestion);
  const valuesPool = questionBank.filter((q) => q.isValuesQuestion);

  // Seeded shuffle
  const shuffleWithSeed = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const generalQuestions = shuffleWithSeed(generalPool).slice(0, 15);
  const valuesQuestions = shuffleWithSeed(valuesPool).slice(0, 5);

  // Interleave: values questions at positions 4, 8, 12, 16, 19 (0-indexed: 3,7,11,15,18)
  const questions: QuizQuestion[] = [];
  let gIdx = 0;
  let vIdx = 0;
  const valuesPositions = new Set([3, 7, 11, 15, 18]);

  for (let i = 0; i < 20; i++) {
    if (valuesPositions.has(i) && vIdx < valuesQuestions.length) {
      questions.push(valuesQuestions[vIdx++]);
    } else if (gIdx < generalQuestions.length) {
      questions.push(generalQuestions[gIdx++]);
    }
  }

  return {
    id,
    title,
    description,
    totalQuestions: 20,
    valuesQuestions: 5,
    timeLimit: 2700, // 45 minutes
    questions,
  };
}

export const mockTests: QuizTest[] = [
  buildTest(
    "mock-test-1",
    "Practice Test 1",
    "Your first full-length mock test — 20 questions, 45 minutes, just like the real thing. A great place to start and identify your strengths.",
    42
  ),
  buildTest(
    "mock-test-2",
    "Practice Test 2",
    "A fresh set of questions across all topics. Use this to build confidence and cover areas you might have missed in Test 1.",
    137
  ),
  buildTest(
    "mock-test-3",
    "Practice Test 3",
    "Your final practice round before the real test. Treat this like a dress rehearsal — full timer, no peeking!",
    256
  ),
  buildTest(
    "mock-test-4",
    "Practice Test 4",
    "Dive into expanded topics including Australian history, Indigenous heritage, and the electoral system. Great for deepening your knowledge.",
    512
  ),
  buildTest(
    "mock-test-5",
    "Practice Test 5",
    "Challenge yourself with more questions on democratic values, the Constitution, and civic responsibilities.",
    789
  ),
  buildTest(
    "mock-test-6",
    "Practice Test 6",
    "The ultimate practice test — comprehensive coverage across all topics. Ace this and you're ready for the real thing!",
    1024
  ),
  buildTest(
    "mock-test-7",
    "Practice Test 7",
    "Focus on government structures, the court system, and how laws are made. Perfect for strengthening your knowledge of Australian governance.",
    1337
  ),
  buildTest(
    "mock-test-8",
    "Practice Test 8",
    "Explore questions on multiculturalism, community values, and what it means to be a good Australian citizen. A deep dive into values.",
    2048
  ),
  buildTest(
    "mock-test-9",
    "Practice Test 9",
    "A well-rounded mix covering Indigenous heritage, democratic rights, and modern Australian society. Great for final revision.",
    3141
  ),
  buildTest(
    "mock-test-10",
    "Practice Test 10",
    "The final challenge — your most comprehensive test yet. If you can pass this one, you're absolutely ready for the real citizenship test!",
    4096
  ),
  buildTest(
    "mock-test-11",
    "Practice Test 11",
    "Test your knowledge of Australia's unique inventions, sporting legends, and cultural milestones in this specially curated test.",
    5555
  ),
  buildTest(
    "mock-test-12",
    "Practice Test 12",
    "Focus on government agencies, the tax system, superannuation, and How laws protect Australian workers and consumers.",
    6174
  ),
  buildTest(
    "mock-test-13",
    "Practice Test 13",
    "Dive deep into Australian values like reconciliation, environmental stewardship, and community resilience.",
    7071
  ),
  buildTest(
    "mock-test-14",
    "Practice Test 14",
    "A balanced mix of history, governance, and values from across the entire 500-question bank. Great all-round revision.",
    8192
  ),
  buildTest(
    "mock-test-15",
    "Practice Test 15",
    "The ultimate final test — covering the broadest range of questions. Pass this and the real test will feel easy!",
    9999
  ),
];

export function getTestById(id: string): QuizTest | undefined {
  return mockTests.find((t) => t.id === id);
}
