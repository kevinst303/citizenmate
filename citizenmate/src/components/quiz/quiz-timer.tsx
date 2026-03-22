"use client";

import { useQuiz } from "@/lib/quiz-context";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function QuizTimer() {
  const { state } = useQuiz();
  const { timeRemaining } = state;
  const [pulse, setPulse] = useState(false);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Urgency levels
  const isUrgent = timeRemaining <= 300; // < 5 min
  const isWarning = timeRemaining <= 900 && timeRemaining > 300; // 5-15 min
  const progress = state.test
    ? (timeRemaining / state.test.timeLimit) * 100
    : 100;

  // Pulse animation for urgent
  useEffect(() => {
    if (isUrgent) {
      const interval = setInterval(() => setPulse((p) => !p), 500);
      return () => clearInterval(interval);
    }
    setPulse(false);
  }, [isUrgent]);

  const barColor = isUrgent
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-500"
      : "bg-emerald-500";

  const textColor = isUrgent
    ? "text-red-600"
    : isWarning
      ? "text-amber-600"
      : "text-cm-slate-700";

  const iconColor = isUrgent
    ? "text-red-500"
    : isWarning
      ? "text-amber-500"
      : "text-cm-slate-400";

  return (
    <div className="flex items-center gap-2.5">
      {/* Timer icon */}
      <Clock
        className={`w-4.5 h-4.5 transition-all duration-300 ${iconColor} ${pulse ? "scale-110" : "scale-100"}`}
      />

      {/* Timer display */}
      <span
        className={`font-mono text-lg font-bold tabular-nums transition-all duration-300 ${textColor} ${pulse ? "scale-105" : "scale-100"}`}
      >
        {formatted}
      </span>

      {/* Progress bar */}
      <div className="hidden sm:block w-24 h-2 bg-cm-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
