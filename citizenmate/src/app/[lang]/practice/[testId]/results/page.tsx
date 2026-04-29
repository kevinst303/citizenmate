"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { ResultsSummary } from "@/components/quiz/results-summary";
import { QuestionReview } from "@/components/quiz/question-review";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const { state, resetQuiz } = useQuiz();
  const [showQuestions, setShowQuestions] = useState(false);

  // If no result available, redirect to practice
  if (!state.result || !state.test) {
    return (
      <div className="min-h-screen bg-cm-ice flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cm-navy-50 text-cm-navy mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-cm-slate-900 mb-2">
            No results to show
          </h2>
          <p className="text-cm-slate-500 mb-6">
            Take a practice test first to see your results here.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Practice Tests
          </Link>
        </motion.div>
      </div>
    );
  }

  const { result, test, answers } = state;

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Top bar */}
      <header className="bg-white border-b border-cm-slate-200 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href="/practice"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cm-navy text-white font-heading font-bold text-sm">
                CM
              </div>
              <span className="font-heading text-sm font-semibold text-cm-slate-600">
                {test.title} — Results
              </span>
            </Link>

            {state.status === "timed-out" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                <Clock className="w-3 h-3" />
                Time expired
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <ResultsSummary result={result} />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetQuiz();
              router.push(`/practice/${testId}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/practice"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-xl hover:bg-cm-slate-50 transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Practice
            </Link>
          </motion.div>
        </motion.div>

        {/* Question Review Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowQuestions(!showQuestions)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-cm-slate-200 shadow-sm hover:bg-cm-slate-50 transition-colors duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-2.5 font-heading font-bold text-cm-slate-900">
              <BookOpen className="w-5 h-5 text-cm-navy" />
              Review All Questions & Answers
            </span>
            <span className="text-cm-slate-400">
              {showQuestions ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </span>
          </motion.button>

          <AnimatePresence>
            {showQuestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-4">
                  {test.questions.map((question, index) => (
                    <QuestionReview
                      key={question.id}
                      question={question}
                      questionNumber={index + 1}
                      userAnswer={answers[question.id]}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Encouragement footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-12 text-center pb-8"
        >
          <p className="text-cm-slate-400 text-sm italic">
            {result.passed
              ? "\"G'day mate, you're ready! 🇦🇺\""
              : "\"No worries, mate — every practice test makes you stronger. You've got this. 🇦🇺\""}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
