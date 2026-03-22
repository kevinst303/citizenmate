"use client";

import Link from "next/link";
import { useQuiz } from "@/lib/quiz-context";
import { QuizTimer } from "./quiz-timer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Flag,
  XCircle,
  AlertCircle,
} from "lucide-react";

export function QuizHeader() {
  const { state, submitQuiz, answeredCount } = useQuiz();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!state.test) return null;

  const unansweredCount = state.test.questions.length - answeredCount;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-cm-slate-200 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              href="/practice"
              className="flex items-center gap-2 text-cm-slate-500 hover:text-cm-navy transition-colors duration-200"
              onClick={(e) => {
                if (state.status === "in-progress") {
                  e.preventDefault();
                  setShowConfirm(true);
                }
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cm-navy text-white font-heading font-bold text-sm">
                CM
              </div>
              <span className="hidden sm:inline font-heading text-sm font-semibold text-cm-slate-600">
                {state.test.title}
              </span>
            </Link>

            {/* Center: Question counter */}
            <div className="flex items-center gap-2 text-sm font-medium text-cm-slate-600">
              <span className="font-heading">
                Question{" "}
                <span className="text-cm-navy font-bold">
                  {state.currentQuestionIndex + 1}
                </span>{" "}
                of {state.test.questions.length}
              </span>
            </div>

            {/* Right: Timer + Submit */}
            <div className="flex items-center gap-3">
              <QuizTimer />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConfirm(true)}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-cm-navy hover:bg-cm-navy-light text-white text-sm font-heading font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Submit Test
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
            >
              <h3 className="text-xl font-heading font-bold text-cm-slate-900 mb-2">
                Submit your test?
              </h3>

              {unansweredCount > 0 ? (
                <p className="text-cm-slate-600 mb-6">
                  You have{" "}
                  <span className="font-bold text-amber-600">
                    {unansweredCount} unanswered{" "}
                    {unansweredCount === 1 ? "question" : "questions"}
                  </span>
                  . Unanswered questions will be marked as incorrect.
                </p>
              ) : (
                <p className="text-cm-slate-600 mb-6">
                  You&apos;ve answered all {state.test.questions.length} questions.
                  Ready to see your results?
                </p>
              )}

              <div className="flex items-center gap-3 text-sm text-cm-slate-500 mb-6 bg-cm-slate-50 rounded-xl p-3">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {answeredCount} answered
                </span>
                <span className="text-cm-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  {state.flaggedQuestions.size} flagged
                </span>
                <span className="text-cm-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  {unansweredCount} unanswered
                </span>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 border-2 border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-xl hover:bg-cm-slate-50 transition-colors duration-200 cursor-pointer"
                >
                  Keep Going
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowConfirm(false);
                    submitQuiz();
                  }}
                  className="flex-1 px-4 py-3 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  Submit Test
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
