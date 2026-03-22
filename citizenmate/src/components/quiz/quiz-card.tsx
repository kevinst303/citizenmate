"use client";

import { useQuiz } from "@/lib/quiz-context";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function QuizCard() {
  const { state, currentQuestion, selectAnswer } = useQuiz();

  if (!currentQuestion || !state.test) return null;

  const selectedAnswer = state.answers[currentQuestion.id];
  const questionNumber = state.currentQuestionIndex + 1;

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full"
    >
      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-navy text-white text-sm font-bold font-heading">
            {questionNumber}
          </span>
          {currentQuestion.isValuesQuestion && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cm-gold-light text-cm-gold text-xs font-semibold border border-amber-200/60">
              <Heart className="w-3 h-3" />
              Australian Values
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-cm-slate-900 leading-snug">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const letter = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={index}
              onClick={() => selectAnswer(currentQuestion.id, index)}
              className={`
                w-full flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 text-left
                transition-all duration-200 cursor-pointer group
                ${
                  isSelected
                    ? "border-cm-navy bg-cm-navy-50 shadow-md"
                    : "border-cm-slate-200 bg-white hover:border-cm-navy-light hover:bg-cm-navy-50/30 hover:shadow-sm"
                }
              `}
            >
              {/* Letter badge */}
              <span
                className={`
                  flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold font-heading
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-cm-navy text-white"
                      : "bg-cm-slate-100 text-cm-slate-600 group-hover:bg-cm-navy-100 group-hover:text-cm-navy"
                  }
                `}
              >
                {letter}
              </span>

              {/* Option text */}
              <span
                className={`
                  text-base sm:text-lg leading-relaxed pt-1
                  ${isSelected ? "text-cm-navy font-semibold" : "text-cm-slate-700"}
                `}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
