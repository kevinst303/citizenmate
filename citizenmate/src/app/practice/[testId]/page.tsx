"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizCard } from "@/components/quiz/quiz-card";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { getTestById } from "@/data/tests";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
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
    const test = getTestById(testId);
    if (test && state.status === "idle") {
      startQuiz(testId);
    }
  }, [testId, state.status, startQuiz]);

  // Redirect to results when completed
  useEffect(() => {
    if (state.status === "completed" || state.status === "timed-out") {
      router.push(`/practice/${testId}/results`);
    }
  }, [state.status, testId, router]);

  // Show loading state
  if (!state.test || state.status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cm-ice">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cm-navy text-white font-heading font-bold text-2xl mb-4 animate-pulse">
            CM
          </div>
          <p className="text-cm-slate-500 font-medium">
            Loading your practice test...
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
    <div className="min-h-screen bg-cm-ice flex flex-col">
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
              <button
                onClick={prevQuestion}
                disabled={isFirstQuestion}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isFirstQuestion
                    ? "text-cm-slate-300 cursor-not-allowed"
                    : "text-cm-slate-700 hover:bg-cm-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {/* Flag button */}
                {currentQuestion && (
                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isFlagged
                        ? "bg-amber-100 text-amber-700 border border-amber-300"
                        : "text-cm-slate-500 hover:bg-cm-slate-100"
                    }`}
                    title={isFlagged ? "Unflag question" : "Flag for review"}
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isFlagged ? "Flagged" : "Flag"}
                    </span>
                  </button>
                )}

                {/* Next / Submit */}
                {isLastQuestion ? (
                  <button
                    onClick={submitQuiz}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Progress grid */}
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-20 bg-white rounded-2xl border border-cm-slate-200 p-4 shadow-sm">
              <QuizProgress />

              {/* Mobile submit button */}
              <div className="sm:hidden mt-4 pt-4 border-t border-cm-slate-100">
                <button
                  onClick={submitQuiz}
                  className="w-full py-3 bg-cm-navy hover:bg-cm-navy-light text-white font-heading font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Submit Test ({answeredCount}/{state.test.questions.length})
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
