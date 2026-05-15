"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { mockTests } from "@/data/tests";
import type { QuizTest, QuizQuestion, QuizAnswer } from "@/lib/types";
import {
  FileText,
  Clock,
  Target,
  Heart,
  Award,
  ArrowRight,
  ArrowLeft,
  Flag,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  Lock,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useT } from "@/i18n/i18n-context";

const GUEST_STORAGE_KEY = "guestAttemptV1";
const FREE_TEST = mockTests[0]; // Practice Test 1

type Status = "landing" | "in-progress" | "completed" | "already-done";

interface ResultData {
  score: number;
  total: number;
  passed: boolean;
  valuesScore: number;
  valuesTotal: number;
  timeUsed: number;
}

export default function FreeTestPage() {
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang as string) || "en";
  const { t } = useT();

  const [status, setStatus] = useState<Status>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(FREE_TEST.timeLimit);
  const [result, setResult] = useState<ResultData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if already taken
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(GUEST_STORAGE_KEY)) {
        setStatus("already-done");
      }
    }
  }, []);

  // Timer
  useEffect(() => {
    if (status === "in-progress" && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up — auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, timeRemaining > 0]);

  // Auto-submit on time up
  useEffect(() => {
    if (status === "in-progress" && timeRemaining <= 0) {
      submitQuiz();
    }
  }, [timeRemaining, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const startTest = useCallback(() => {
    setStatus("in-progress");
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeRemaining(FREE_TEST.timeLimit);
    setResult(null);
  }, []);

  const selectAnswer = useCallback((questionId: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const submitQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    let valuesScore = 0;

    for (const q of FREE_TEST.questions) {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correctAnswer) {
        score++;
        if (q.isValuesQuestion) valuesScore++;
      }
    }

    const timeUsed = FREE_TEST.timeLimit - timeRemaining;
    const valuesPassed = valuesScore === 5;
    const passed = score >= 15 && valuesPassed;

    setResult({ score, total: FREE_TEST.questions.length, passed, valuesScore, valuesTotal: 5, timeUsed });
    setStatus("completed");

    // Mark as taken
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_STORAGE_KEY, "1");
    }
  }, [answers, timeRemaining]);

  const question = FREE_TEST.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = FREE_TEST ? Math.round((answeredCount / FREE_TEST.questions.length) * 100) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const timeLow = timeRemaining < 300;

  // === LANDING PAGE ===
  if (status === "landing") {
    return (
      <div className="min-h-screen bg-cm-ice">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-cm-navy via-cm-navy-light to-teal-700 pt-24 pb-16 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              No sign-up required
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4"
            >
              Try a Free Practice Test
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-base sm:text-lg max-w-xl mx-auto"
            >
              Experience a full Australian citizenship practice test — 20 questions, 45 minutes. No account needed. See where you stand.
            </motion.p>
          </div>
        </section>

        {/* Test preview + CTA */}
        <section className="mx-auto max-w-lg px-4 sm:px-6 -mt-8 relative z-10 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl shadow-card p-6 sm:p-8"
          >
            {/* Test format */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: FileText, value: "20", label: "Questions" },
                { icon: Clock, value: "45 min", label: "Time Limit" },
                { icon: Target, value: "75%", label: "Pass Mark" },
                { icon: Heart, value: "5/5", label: "Values Required" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy-50 text-cm-navy mb-2">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-heading font-extrabold text-cm-navy">{stat.value}</div>
                  <div className="text-xs text-cm-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="text-sm text-cm-slate-500 mb-6 text-center">
              This is a real sample from our 15-test practice bank. After completing, you&apos;ll see your score and can sign up to unlock all tests and track your progress.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startTest}
              className="w-full flex items-center justify-center gap-2 py-4 font-heading font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200"
            >
              Start Free Test
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <p className="text-xs text-cm-slate-400 text-center mt-4">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              One free attempt per browser. No account required.
            </p>
          </motion.div>
        </section>
      </div>
    );
  }

  // === ALREADY TAKEN ===
  if (status === "already-done") {
    return (
      <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl shadow-card p-8 sm:p-10 text-center max-w-md w-full"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-5">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-cm-slate-900 mb-3">
            You&apos;ve Already Taken Your Free Test
          </h2>
          <p className="text-sm text-cm-slate-500 mb-2">
            Each person gets one free practice test to try out the platform.
          </p>
          <p className="text-sm text-cm-slate-500 mb-6">
            Sign up to unlock 15 more tests, track your scores, and get personalized study recommendations.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/${lang}/sign-up`}
              className="w-full flex items-center justify-center gap-2 py-3 font-heading font-semibold text-white bg-gradient-to-r from-cm-navy to-cm-navy-light rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up Free
            </Link>
            <Link
              href={`/${lang}/sign-in`}
              className="w-full flex items-center justify-center gap-2 py-3 font-heading font-semibold text-cm-navy bg-cm-navy-50 rounded-xl hover:bg-cm-navy-100 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // === TEST IN PROGRESS ===
  if (status === "in-progress" && question) {
    return (
      <div className="min-h-screen bg-cm-ice">
        {/* Header bar */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cm-slate-200">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-cm-slate-600">
                Q{currentIndex + 1}/{FREE_TEST.questions.length}
              </span>
              <div className="h-1.5 w-24 bg-cm-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cm-navy rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleFlag(question.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  flagged.has(question.id)
                    ? "text-amber-600"
                    : "text-cm-slate-400 hover:text-amber-600"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged.has(question.id) ? "fill-amber-600" : ""}`} />
                Flag
              </button>
              <span
                className={`text-sm font-mono font-bold tabular-nums ${
                  timeLow ? "text-red-500 animate-pulse" : "text-cm-slate-700"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {/* Question text */}
              <h2 className="text-lg sm:text-xl font-heading font-bold text-cm-slate-900 mb-6">
                {question.text}
              </h2>

              {/* Answer options */}
              <div className="space-y-3 mb-8">
                {question.options.map((option, idx) => {
                  const isSelected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(question.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-cm-navy bg-cm-navy-50 shadow-sm"
                          : "border-cm-slate-200 bg-white hover:border-cm-slate-300 hover:bg-cm-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                            isSelected
                              ? "border-cm-navy bg-cm-navy text-white"
                              : "border-cm-slate-300 text-cm-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span
                          className={`text-sm leading-relaxed ${
                            isSelected ? "text-cm-slate-900 font-medium" : "text-cm-slate-600"
                          }`}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-cm-slate-600 hover:text-cm-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentIndex < FREE_TEST.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((p) => p + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-cm-navy text-white rounded-xl hover:bg-cm-navy-light transition-colors shadow-sm"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/25 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Submit Test
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // === COMPLETED ===
  if (status === "completed" && result) {
    return (
      <div className="min-h-screen bg-cm-ice">
        {/* Result hero */}
        <section
          className={`relative pt-24 pb-16 px-4 sm:px-6 text-center ${
            result.passed
              ? "bg-gradient-to-br from-emerald-600 to-teal-700"
              : "bg-gradient-to-br from-amber-600 to-orange-700"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 mb-5"
          >
            {result.passed ? (
              <Award className="w-10 h-10 text-white" />
            ) : (
              <Target className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2"
          >
            {result.passed ? "Congratulations!" : "Good Effort!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-base"
          >
            {result.passed
              ? "You passed! You're on track for the real citizenship test."
              : "You scored below the 75% pass mark. More practice will help!"}
          </motion.p>
        </section>

        {/* Score card */}
        <section className="mx-auto max-w-lg px-4 sm:px-6 -mt-10 relative z-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl shadow-card p-6 sm:p-8"
          >
            {/* Score */}
            <div className="text-center mb-6">
              <div className="text-5xl font-heading font-extrabold text-cm-navy">
                {result.score}/{result.total}
              </div>
              <div className="text-sm text-cm-slate-500 mt-1">
                {Math.round((result.score / result.total) * 100)}% correct
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-cm-slate-50">
                <div className="text-xs text-cm-slate-500 mb-1">Time Used</div>
                <div className="text-lg font-heading font-bold text-cm-slate-900">{formatTime(result.timeUsed)}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-cm-slate-50">
                <div className="text-xs text-cm-slate-500 mb-1">Values</div>
                <div className="text-lg font-heading font-bold text-cm-slate-900">
                  {result.valuesScore}/{result.valuesTotal}
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-cm-slate-50">
                <div className="text-xs text-cm-slate-500 mb-1">Result</div>
                <div
                  className={`text-lg font-heading font-bold ${
                    result.passed ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {result.passed ? "PASSED" : "NOT YET"}
                </div>
              </div>
            </div>

            {/* Signup CTA */}
            <div className="bg-gradient-to-br from-cm-navy to-cm-navy-light rounded-xl p-6 text-center">
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Ready to Master the Test?
              </h3>
              <p className="text-sm text-white/70 mb-5">
                Sign up to unlock 15 full practice tests, track your scores, and get AI-powered study recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/${lang}/sign-up`}
                  className="flex items-center justify-center gap-2 px-6 py-3 font-heading font-semibold text-cm-navy bg-white rounded-xl hover:bg-white/90 shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Free Account
                </Link>
                <Link
                  href={`/${lang}/sign-in`}
                  className="flex items-center justify-center gap-2 px-6 py-3 font-heading font-semibold text-white/80 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-5 text-center">
              <Link
                href={`/${lang}`}
                className="text-sm text-cm-slate-400 hover:text-cm-navy transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    );
  }

  return null;
}
