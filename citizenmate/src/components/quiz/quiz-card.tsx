"use client";

import { useQuiz } from "@/lib/quiz-context";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export function QuizCard() {
  const { state, currentQuestion, selectAnswer } = useQuiz();

  if (!currentQuestion || !state.test) return null;

  const selectedAnswer = state.answers[currentQuestion.id];
  const questionNumber = state.currentQuestionIndex + 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 40, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="w-full bg-white border border-[#E9ECEF] rounded-[15px] p-6 sm:p-8"
        style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
      >
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <motion.span
              key={`num-${questionNumber}`}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-cm-teal text-white text-sm font-bold font-heading"
            >
              {questionNumber}
            </motion.span>
            {currentQuestion.isValuesQuestion && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cm-gold-light text-cm-gold text-xs font-semibold border border-amber-200/60"
              >
                <Heart className="w-3 h-3" />
                Australian Values
              </motion.span>
            )}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-xl sm:text-2xl font-heading font-bold text-cm-slate-900 leading-snug"
          >
            {currentQuestion.text}
          </motion.h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const letter = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + index * 0.06,
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                }}
                whileHover={{
                  scale: 1.01,
                  x: 4,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectAnswer(currentQuestion.id, index)}
                className={`
                  w-full flex items-start gap-4 p-4 sm:p-5 rounded-[10px] border-2 text-left
                  transition-colors duration-200 cursor-pointer group
                  ${
                    isSelected
                      ? "border-cm-teal bg-cm-teal/5 shadow-md answer-selected-shimmer"
                      : "border-[#E9ECEF] bg-white hover:border-cm-teal/50 hover:bg-cm-teal/[0.03] hover:shadow-sm"
                  }
                `}
              >
                {/* Letter badge */}
                <motion.span
                  animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`
                    flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-sm font-bold font-heading
                    transition-colors duration-200
                    ${
                      isSelected
                        ? "bg-cm-teal text-white"
                        : "bg-cm-slate-100 text-cm-slate-600 group-hover:bg-cm-teal/10 group-hover:text-cm-teal"
                    }
                  `}
                >
                  {letter}
                </motion.span>

                {/* Option text */}
                <span
                  className={`
                    text-base sm:text-lg leading-relaxed pt-1
                    ${isSelected ? "text-cm-teal font-semibold" : "text-cm-slate-700"}
                  `}
                >
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
