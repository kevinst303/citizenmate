"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/lib/quiz-context";

export function QuizProgress() {
  const { state, navigateTo } = useQuiz();

  if (!state.test) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-cm-slate-500">
          {Object.keys(state.answers).length} of {state.test.questions.length}{" "}
          answered
        </span>
        <span className="text-sm font-medium text-cm-slate-500">
          {state.flaggedQuestions.size > 0 &&
            `${state.flaggedQuestions.size} flagged`}
        </span>
      </div>

      {/* Question grid — animated cells */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {state.test.questions.map((question, index) => {
          const isAnswered = question.id in state.answers;
          const isFlagged = state.flaggedQuestions.has(question.id);
          const isCurrent = index === state.currentQuestionIndex;

          let bgClass = "bg-cm-slate-100 text-cm-slate-500 hover:bg-cm-slate-200";

          if (isCurrent) {
            bgClass = "bg-cm-navy text-white ring-2 ring-cm-navy ring-offset-2";
          } else if (isFlagged && isAnswered) {
            bgClass =
              "bg-amber-100 text-amber-700 border border-amber-300";
          } else if (isFlagged) {
            bgClass =
              "bg-amber-50 text-amber-600 border border-amber-200";
          } else if (isAnswered) {
            bgClass = "bg-cm-eucalyptus-light text-cm-eucalyptus";
          }

          return (
            <motion.button
              key={question.id}
              onClick={() => navigateTo(index)}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.02,
                type: "spring" as const,
                stiffness: 300,
                damping: 18,
              }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              layout
              className={`
                relative flex items-center justify-center
                w-full aspect-square rounded-lg text-xs sm:text-sm font-bold font-heading
                transition-colors duration-150 cursor-pointer
                ${bgClass}
              `}
              title={`Question ${index + 1}${isFlagged ? " (flagged)" : ""}${isAnswered ? " (answered)" : ""}`}
            >
              {index + 1}
              {isFlagged && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
                  className="absolute -top-1 -right-1 text-[10px]"
                >
                  ⚑
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-cm-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cm-navy inline-block" /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cm-eucalyptus-light inline-block" />{" "}
          Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" />{" "}
          Flagged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cm-slate-100 inline-block" />{" "}
          Unanswered
        </span>
      </div>
    </div>
  );
}
