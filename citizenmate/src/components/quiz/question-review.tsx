"use client";

import { motion } from "framer-motion";
import type { QuizQuestion } from "@/lib/types";
import {
  CheckCircle2,
  XCircle,
  Heart,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface QuestionReviewProps {
  question: QuizQuestion;
  questionNumber: number;
  userAnswer: number | undefined;
}

export function QuestionReview({
  question,
  questionNumber,
  userAnswer,
}: QuestionReviewProps) {
  const isCorrect = userAnswer === question.correctAnswer;
  const wasAnswered = userAnswer !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        rounded-xl border-2 p-5 sm:p-6
        ${
          isCorrect
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-red-200 bg-red-50/50"
        }
      `}
    >
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`
            flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg
            ${isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}
          `}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-4.5 h-4.5" />
          ) : (
            <XCircle className="w-4.5 h-4.5" />
          )}
        </motion.span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cm-slate-400">
              Q{questionNumber}
            </span>
            {question.isValuesQuestion && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cm-gold-light text-cm-gold text-xs font-semibold border border-amber-200/60">
                <Heart className="w-2.5 h-2.5" />
                Values
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-heading font-bold text-cm-slate-900">
            {question.text}
          </h4>
        </div>
      </div>

      {/* Options review */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => {
          const isCorrectOption = index === question.correctAnswer;
          const isUserChoice = index === userAnswer;
          const letter = String.fromCharCode(65 + index);

          let optionClass =
            "border-cm-slate-100 bg-white text-cm-slate-600";
          if (isCorrectOption) {
            optionClass =
              "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
          } else if (isUserChoice && !isCorrectOption) {
            optionClass =
              "border-red-300 bg-red-50 text-red-800 line-through";
          }

          return (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${optionClass}`}
            >
              <span className="text-sm font-bold font-heading opacity-60">
                {letter}
              </span>
              <span className="text-sm flex-1">{option}</span>
              {isCorrectOption && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              {isUserChoice && !isCorrectOption && (
                <span className="text-xs text-red-400 flex-shrink-0">
                  your answer
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Rationale */}
      <div className="bg-white rounded-lg border border-cm-slate-100 p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cm-sky" />
          <span className="text-xs font-semibold text-cm-sky uppercase tracking-wide">
            Explanation
          </span>
        </div>
        <p className="text-sm text-cm-slate-700 leading-relaxed">
          {question.rationale}
        </p>
        <p className="text-xs text-cm-slate-400 mt-2 italic">
          Reference: {question.bookReference}
        </p>
      </div>

      {/* Unanswered notice */}
      {!wasAnswered && (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 font-medium">
          <AlertTriangle className="w-4 h-4" />
          You didn&apos;t answer this question
        </div>
      )}
    </motion.div>
  );
}
