"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSRS } from "@/lib/srs-context";
import { questionBank } from "@/data/questions";
import type { QuizQuestion, TopicCategory } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Trophy,
  Target,
  TrendingUp,
  RotateCcw,
  Globe,
  Scale,
  Landmark,
  Heart,
} from "lucide-react";
import { posthog } from "@/components/providers/posthog-provider";

const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

interface SessionResult {
  questionId: string;
  wasCorrect: boolean;
  selectedAnswer: number;
}

export default function SmartSessionPage() {
  const router = useRouter();
  const { recordAnswer, getSmartQuestions } = useSRS();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Load questions from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("citizenmate-smart-session");
    const focusTopic = sessionStorage.getItem("citizenmate-smart-focus") as TopicCategory | null;

    if (stored) {
      try {
        const questionIds = JSON.parse(stored) as string[];
        const loadedQuestions = questionIds
          .map((id) => questionBank.find((q) => q.id === id))
          .filter(Boolean) as QuizQuestion[];

        if (loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
          return;
        }
      } catch {
        // Fall through to generate fresh
      }
    }

    // Fallback: generate fresh questions
    const freshQuestions = getSmartQuestions(15, focusTopic ?? undefined);
    setQuestions(freshQuestions);
  }, [getSmartQuestions]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const progressPercent =
    totalQuestions > 0 ? Math.round((results.length / totalQuestions) * 100) : 0;

  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback || !currentQuestion) return;
      setSelectedAnswer(answerIndex);
      setShowFeedback(true);

      const wasCorrect = answerIndex === currentQuestion.correctAnswer;

      recordAnswer(currentQuestion.id, currentQuestion.topic, wasCorrect);

      setResults((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          wasCorrect,
          selectedAnswer: answerIndex,
        },
      ]);

      if (results.length === 0 && typeof window !== "undefined") {
        posthog.capture("srs_session_started", {
          focus_topic: sessionStorage.getItem("citizenmate-smart-focus") ?? "mixed",
          total_questions: totalQuestions,
        });
      }
    },
    [showFeedback, currentQuestion, recordAnswer, results.length, totalQuestions]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [currentIndex, totalQuestions]);

  // Summary stats
  const correctCount = results.filter((r) => r.wasCorrect).length;
  const incorrectCount = results.filter((r) => !r.wasCorrect).length;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-cm-ice flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-cm-slate-500">Loading your smart session…</p>
        </div>
      </div>
    );
  }

  // ─── Session Complete ─────────────────────────────────

  useEffect(() => {
    if (sessionComplete && typeof window !== "undefined") {
      const accuracy =
        results.length > 0
          ? Math.round((results.filter((r) => r.wasCorrect).length / results.length) * 100)
          : 0;
      posthog.capture("srs_session_completed", {
        total_questions: results.length,
        correct: results.filter((r) => r.wasCorrect).length,
        accuracy,
      });
    }
  }, [sessionComplete, results]);

  if (sessionComplete) {
    const accuracy =
      results.length > 0
        ? Math.round((correctCount / results.length) * 100)
        : 0;

    // Group results by topic
    const topicResults: Record<
      TopicCategory,
      { correct: number; total: number }
    > = {
      "australia-people": { correct: 0, total: 0 },
      "democratic-beliefs": { correct: 0, total: 0 },
      "government-law": { correct: 0, total: 0 },
      "australian-values": { correct: 0, total: 0 },
    };

    for (const result of results) {
      const question = questions.find((q) => q.id === result.questionId);
      if (question) {
        topicResults[question.topic].total++;
        if (result.wasCorrect) topicResults[question.topic].correct++;
      }
    }

    return (
      <div className="min-h-screen bg-cm-ice">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hero result */}
            <div
              className={`text-center p-8 sm:p-12 rounded-2xl ${
                accuracy >= 75
                  ? "bg-gradient-to-br from-emerald-50 via-cm-eucalyptus-light to-emerald-50"
                  : accuracy >= 50
                    ? "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50"
                    : "bg-gradient-to-br from-purple-50 via-fuchsia-50 to-purple-50"
              }`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 ${
                  accuracy >= 75
                    ? "bg-emerald-500"
                    : accuracy >= 50
                      ? "bg-amber-500"
                      : "bg-purple-500"
                } text-white`}
              >
                {accuracy >= 75 ? (
                  <Trophy className="w-10 h-10" />
                ) : (
                  <TrendingUp className="w-10 h-10" />
                )}
              </motion.div>

              <h1
                className={`text-3xl sm:text-4xl font-heading font-extrabold mb-3 ${
                  accuracy >= 75
                    ? "text-emerald-800"
                    : accuracy >= 50
                      ? "text-amber-800"
                      : "text-purple-800"
                }`}
              >
                {accuracy >= 75
                  ? "Brilliant session, mate!"
                  : accuracy >= 50
                    ? "Getting stronger!"
                    : "Keep at it, mate!"}
              </h1>

              <p className="text-lg text-cm-slate-600 max-w-md mx-auto">
                You got{" "}
                <span className="font-bold">
                  {correctCount} out of {results.length}
                </span>{" "}
                correct ({accuracy}%). Every session makes you stronger.
              </p>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-cm-slate-200 p-4 text-center">
                <CheckCircle2 className="w-5 h-5 text-cm-eucalyptus mx-auto mb-2" />
                <div className="text-2xl font-heading font-extrabold text-cm-eucalyptus">
                  {correctCount}
                </div>
                <div className="text-xs text-cm-slate-500">Correct</div>
              </div>
              <div className="bg-white rounded-xl border border-cm-slate-200 p-4 text-center">
                <XCircle className="w-5 h-5 text-cm-red mx-auto mb-2" />
                <div className="text-2xl font-heading font-extrabold text-cm-red">
                  {incorrectCount}
                </div>
                <div className="text-xs text-cm-slate-500">Incorrect</div>
              </div>
              <div className="bg-white rounded-xl border border-cm-slate-200 p-4 text-center">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-heading font-extrabold text-purple-600">
                  {accuracy}%
                </div>
                <div className="text-xs text-cm-slate-500">Accuracy</div>
              </div>
            </div>

            {/* Topic breakdown */}
            <div className="bg-white rounded-xl border border-cm-slate-200 p-6">
              <h3 className="text-sm font-heading font-bold text-cm-slate-900 mb-4">
                Topic Breakdown
              </h3>
              <div className="space-y-3">
                {(
                  Object.entries(topicResults) as [
                    TopicCategory,
                    { correct: number; total: number },
                  ][]
                )
                  .filter(([, data]) => data.total > 0)
                  .map(([topicId, data]) => {
                    const Icon = TOPIC_ICONS[topicId];
                    const pct =
                      data.total > 0
                        ? Math.round((data.correct / data.total) * 100)
                        : 0;

                    return (
                      <div key={topicId} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-cm-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-cm-slate-700 truncate">
                              {TOPIC_LABELS[topicId]}
                            </span>
                            <span className="font-bold text-cm-slate-900">
                              {data.correct}/{data.total}
                            </span>
                          </div>
                          <div className="h-2 bg-cm-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                pct >= 80
                                  ? "bg-cm-eucalyptus"
                                  : pct >= 60
                                    ? "bg-amber-500"
                                    : "bg-cm-red"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/practice/smart"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-bold rounded-xl hover:shadow-lg transition-all text-center"
              >
                <RotateCcw className="w-4 h-4" />
                Another Session
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-cm-slate-700 font-heading font-semibold rounded-xl border-2 border-cm-slate-200 hover:border-cm-slate-300 transition-all text-center"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Active Quiz ──────────────────────────────────────

  const wasCorrect =
    selectedAnswer !== null &&
    currentQuestion &&
    selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-cm-ice flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cm-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-heading font-bold text-sm text-cm-slate-900">
              Smart Practice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cm-slate-500 font-medium">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <Link
              href="/practice/smart"
              className="text-xs text-cm-slate-400 hover:text-cm-red transition-colors"
            >
              End
            </Link>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-cm-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Topic badge */}
            {currentQuestion && (
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = TOPIC_ICONS[currentQuestion.topic];
                  return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                      <Icon className="w-3 h-3" />
                      {TOPIC_LABELS[currentQuestion.topic]}
                    </span>
                  );
                })()}
                {currentQuestion.isValuesQuestion && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cm-red-light text-cm-red text-xs font-semibold">
                    <Heart className="w-3 h-3" />
                    Values
                  </span>
                )}
              </div>
            )}

            {/* Question text */}
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-cm-slate-900 leading-snug">
              {currentQuestion?.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                const showResult = showFeedback;

                let optionClasses =
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ";

                if (showResult) {
                  if (isCorrect) {
                    optionClasses +=
                      "bg-emerald-50 border-emerald-400 text-emerald-800";
                  } else if (isSelected && !isCorrect) {
                    optionClasses += "bg-red-50 border-red-400 text-red-800";
                  } else {
                    optionClasses +=
                      "bg-cm-slate-50 border-cm-slate-200 text-cm-slate-400";
                  }
                } else if (isSelected) {
                  optionClasses +=
                    "bg-purple-50 border-purple-400 text-purple-800";
                } else {
                  optionClasses +=
                    "bg-white border-cm-slate-200 text-cm-slate-700 hover:border-purple-300 hover:bg-purple-50/50";
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showFeedback ? { scale: 1.01 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={showFeedback}
                    className={optionClasses}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cm-slate-100 text-cm-slate-600 font-heading font-bold text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {option}
                      </span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-5 rounded-xl border ${
                      wasCorrect
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {wasCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-amber-600" />
                      )}
                      <span
                        className={`font-heading font-bold text-sm ${wasCorrect ? "text-emerald-700" : "text-amber-700"}`}
                      >
                        {wasCorrect ? "Correct!" : "Not quite — here's why:"}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${wasCorrect ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {currentQuestion.rationale}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-cm-slate-400">
                      <BookOpen className="w-3 h-3" />
                      {currentQuestion.bookReference}
                    </div>
                  </div>

                  {/* Next button */}
                  <div className="mt-4 flex justify-end">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      {currentIndex + 1 >= totalQuestions ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          See Results
                        </>
                      ) : (
                        <>
                          Next Question
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom stats bar */}
      <footer className="bg-white border-t border-cm-slate-200 py-3">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 flex items-center justify-between text-xs text-cm-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cm-eucalyptus" />
              {correctCount} correct
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-cm-red" />
              {incorrectCount} incorrect
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-purple-500" />
            SRS active
          </span>
        </div>
      </footer>
    </div>
  );
}
