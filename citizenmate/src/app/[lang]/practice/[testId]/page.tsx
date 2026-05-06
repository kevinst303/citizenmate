"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz, getAttemptHistory } from "@/lib/quiz-context";
import { useAuth } from "@/lib/auth-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizCard } from "@/components/quiz/quiz-card";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { getTestById } from "@/data/tests";
import { motion } from "framer-motion";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const { profile, loading } = useAuth();
  const isPremium = profile.isPremium;
  const { openModal } = useUpgradeModal();
  const { t } = useT();
  const {
    state,
    currentQuestion,
    startQuiz,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    answeredCount,
  } = useQuiz();

  // Start quiz on mount
  useEffect(() => {
    if (loading) return; // Wait for profile to load
    
    // Protection: allow 1 free test completion total across any test
    const attempts = getAttemptHistory();
    if (!isPremium && (testId !== "mock-1" || attempts.length > 0)) {
      // User is not premium and trying to take a test they shouldn't
      router.push("/practice");
      openModal("quiz_limit");
      return;
    }

    const test = getTestById(testId);
    if (test && state.status === "idle") {
      startQuiz(testId);
    }
  }, [testId, state.status, startQuiz, isPremium, loading, router, openModal]);

  // Redirect to results when completed
  useEffect(() => {
    if (state.status === "completed" || state.status === "timed-out") {
      router.push(`/practice/${testId}/results`);
    }
  }, [state.status, testId, router]);

  // Show loading state
  if (!state.test || state.status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-[15px] bg-cm-teal text-white font-heading font-bold text-2xl mb-4"
          >
            CM
          </motion.div>
          <p className="text-cm-slate-500 font-medium">
            {t("quiz.loading", "Loading your practice test...")}
          </p>
        </div>
      </div>
    );
  }

  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion =
    state.currentQuestionIndex === state.test.questions.length - 1;
  const isFlagged = currentQuestion
    ? state.flaggedQuestions.has(currentQuestion.id)
    : false;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Focused header (no navbar/footer) */}
      <QuizHeader />

      {/* Main quiz area */}
      <div className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-10">
          {/* Question area */}
          <div>
            <QuizCard />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cm-slate-200">
              <motion.button
                onClick={prevQuestion}
                disabled={isFirstQuestion}
                whileHover={!isFirstQuestion ? { scale: 1.04, x: -2 } : {}}
                whileTap={!isFirstQuestion ? { scale: 0.96 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isFirstQuestion
                    ? "text-cm-slate-300 cursor-not-allowed"
                    : "text-cm-slate-700 hover:bg-cm-slate-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                {t("quiz.previous", "Previous")}
              </motion.button>

              <div className="flex items-center gap-2">
                {/* Flag button */}
                {currentQuestion && (
                  <motion.button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isFlagged
                        ? "bg-amber-100 text-amber-700 border border-amber-300"
                        : "text-cm-slate-500 hover:bg-cm-slate-100"
                    }`}
                    title={isFlagged ? t("quiz.unflag_question", "Unflag question") : t("quiz.flag_for_review", "Flag for review")}
                  >
                    <motion.span
                      animate={isFlagged ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Flag className="w-4 h-4" />
                    </motion.span>
                    <span className="hidden sm:inline">
                      {isFlagged ? t("quiz.flagged", "Flagged") : t("quiz.flag", "Flag")}
                    </span>
                  </motion.button>
                )}

                {/* Next / Submit */}
                {isLastQuestion ? (
                  <motion.button
                    onClick={submitQuiz}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cm-teal hover:bg-cm-teal/90 text-white font-heading font-semibold text-sm rounded-[10px] transition-colors duration-200 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {t("quiz.submit_test", "Submit Test")}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={nextQuestion}
                    whileHover={{ scale: 1.04, x: 2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cm-teal hover:bg-cm-teal/90 text-white font-heading font-semibold text-sm rounded-[10px] transition-colors duration-200 cursor-pointer"
                  >
                    {t("quiz.next", "Next")}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Progress grid */}
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-20 bg-white border border-[#E9ECEF] p-4 rounded-[15px]" style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
              <QuizProgress />

              {/* Mobile submit button */}
              <div className="sm:hidden mt-4 pt-4 border-t border-cm-slate-100">
                <button
                  onClick={submitQuiz}
                  className="w-full py-3 bg-cm-teal hover:bg-cm-teal/90 text-white font-heading font-semibold rounded-[10px] transition-all cursor-pointer"
                >
                    {t("quiz.mobile_submit", "Submit Test ({answered}/{total})").replace("{answered}", String(answeredCount)).replace("{total}", String(state.test.questions.length))}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
