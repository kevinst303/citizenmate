"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Wind, X, Play, Pause, Timer } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

interface WellbeingPromptProps {
  visible: boolean;
  onDismiss: () => void;
  triggerReason: "30min" | "15min" | "manual";
}

const PHASE_CYCLE: { phase: BreathPhase; duration: number; labelKey: string }[] = [
  { phase: "inhale", duration: 4000, labelKey: "wellbeing.breathe_in" },
  { phase: "hold", duration: 7000, labelKey: "wellbeing.hold" },
  { phase: "exhale", duration: 8000, labelKey: "wellbeing.breathe_out" },
  { phase: "rest", duration: 2000, labelKey: "wellbeing.rest" },
];

const TOTAL_CYCLES = 3; // 3 rounds of 4-7-8 breathing

function BreathingCircle({
  phase,
  progress,
  shouldReduceMotion,
}: {
  phase: BreathPhase;
  progress: number;
  shouldReduceMotion: boolean;
}) {
  const sizeByPhase: Record<BreathPhase, number> = {
    inhale: 1.0,
    hold: 1.0,
    exhale: 0.6,
    rest: 0.6,
  };

  const colors: Record<BreathPhase, string> = {
    inhale: "from-sky-400/30 to-indigo-400/40",
    hold: "from-indigo-400/40 to-purple-400/40",
    exhale: "from-teal-400/30 to-emerald-400/30",
    rest: "from-sky-300/20 to-sky-300/20",
  };

  const scale = sizeByPhase[phase];
  const duration = PHASE_CYCLE.find((p) => p.phase === phase)?.duration ?? 4000;

  if (shouldReduceMotion) {
    // Static rendering with no motion animations
    return (
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring - static */}
        <div
          className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${colors[phase]} blur-xl`}
        />
        {/* Pulsing circle - static */}
        <div
          className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${colors[phase]} border-2 border-white/40 flex items-center justify-center`}
        >
          {/* Progress ring - static */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="3"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={(1 - progress) * 2 * Math.PI * 44}
            />
          </svg>
          <span className="relative z-10 text-white text-xs font-semibold font-heading text-center leading-tight px-1">
            {phase === "inhale" && "Breathe\nIn"}
            {phase === "hold" && "Hold"}
            {phase === "exhale" && "Breathe\nOut"}
            {phase === "rest" && "Rest"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${colors[phase]} blur-xl`}
        animate={{ scale: [scale * 0.9, scale * 1.05, scale * 0.9] }}
        transition={{ duration: duration / 1000, ease: "easeInOut", repeat: 0 }}
      />

      {/* Pulsing circle */}
      <motion.div
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${colors[phase]} border-2 border-white/40 flex items-center justify-center`}
        animate={{ scale: [scale * 0.8, scale, scale * 0.8] }}
        transition={{ duration: duration / 1000, ease: "easeInOut", repeat: 0 }}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44}
            animate={{ strokeDashoffset: (1 - progress) * 2 * Math.PI * 44 }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </svg>
        <span className="relative z-10 text-white text-xs font-semibold font-heading text-center leading-tight px-1">
          {phase === "inhale" && "Breathe\nIn"}
          {phase === "hold" && "Hold"}
          {phase === "exhale" && "Breathe\nOut"}
          {phase === "rest" && "Rest"}
        </span>
      </motion.div>
    </div>
  );
}

export function WellbeingPrompt({ visible, onDismiss, triggerReason }: WellbeingPromptProps) {
  const { t } = useT();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = !!prefersReducedMotion;
  const [isActive, setIsActive] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartRef = useRef<number>(0);

  const totalPhases = PHASE_CYCLE.length * TOTAL_CYCLES;

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      setIsActive(false);
      setCycleIndex(0);
      setPhaseIndex(0);
      setPhaseProgress(0);
      setCompleted(false);
    }
  }, [visible]);

  // Run breathing cycle
  useEffect(() => {
    if (!visible || !isActive || completed) return;

    const phase = PHASE_CYCLE[phaseIndex % PHASE_CYCLE.length];
    if (!phase) return;

    phaseStartRef.current = Date.now();

    phaseTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - phaseStartRef.current;
      const progress = Math.min(elapsed / phase.duration, 1);
      setPhaseProgress(progress);

      if (progress >= 1) {
        clearInterval(phaseTimerRef.current!);
        const nextPhaseIdx = phaseIndex + 1;

        if (nextPhaseIdx >= totalPhases) {
          setCompleted(true);
          setIsActive(false);
        } else {
          setPhaseIndex(nextPhaseIdx);
          if (nextPhaseIdx % PHASE_CYCLE.length === 0) {
            setCycleIndex((prev) => prev + 1);
          }
        }
      }
    }, 50);

    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [visible, isActive, phaseIndex, completed, totalPhases]);

  const currentPhase = PHASE_CYCLE[phaseIndex % PHASE_CYCLE.length]?.phase ?? "inhale";
  const currentCycleNumber = cycleIndex + 1;

  const handleStart = useCallback(() => {
    setIsActive(true);
    setPhaseIndex(0);
    setPhaseProgress(0);
    setCycleIndex(0);
    setCompleted(false);
  }, []);

  const handleStop = useCallback(() => {
    setIsActive(false);
  }, []);

  const getReasonText = () => {
    if (triggerReason === "30min") {
      return t("wellbeing.thirty_min_prompt", "You've been focused for 15 minutes. Take a quick breath break.");
    }
    if (triggerReason === "15min") {
      return t("wellbeing.fifteen_min_prompt", "Almost there! A deep breath can help you finish strong.");
    }
    return t("wellbeing.generic_prompt", "A moment of calm can sharpen your focus.");
  };

  return (
    <AnimatePresence>
      {visible && (
        shouldReduceMotion ? (
          // Static overlay for reduced motion
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isActive) onDismiss();
            }}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-[20px] p-6 sm:p-8 overflow-hidden"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.1) 0px 4px 12px 0px, rgba(0,0,0,0.2) 0px 20px 48px 0px",
              }}
            >
              {/* Background gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-400" />

              {/* Close button */}
              {!isActive && (
                <button
                  onClick={onDismiss}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cm-slate-100 hover:bg-cm-slate-200 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <X className="w-4 h-4 text-cm-slate-500" />
                </button>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-sky-400 to-indigo-500 mb-4">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-heading font-bold text-cm-slate-900 mb-1.5">
                  {t("wellbeing.title", "Take a Breath")}
                </h2>
                <p className="text-sm text-cm-slate-500 leading-relaxed max-w-xs mx-auto">
                  {completed
                    ? t("wellbeing.completed", "Feeling refreshed! Your mind is ready to continue.")
                    : isActive
                      ? t("wellbeing.follow_guide", "Follow the circle's rhythm…")
                      : getReasonText()}
                </p>
              </div>

              {/* Breathing animation area */}
              <div className="flex flex-col items-center justify-center py-6">
                {completed ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-white">
                        <path
                          d="M20 6L9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">
                      {t("wellbeing.done", "Done!")}
                    </span>
                  </div>
                ) : isActive ? (
                  <div className="flex flex-col items-center gap-4">
                    <BreathingCircle phase={currentPhase} progress={phaseProgress} shouldReduceMotion={shouldReduceMotion} />
                    {/* Phase indicator - static dots */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < currentCycleNumber - 1
                              ? "bg-emerald-400"
                              : i === currentCycleNumber - 1
                                ? "bg-indigo-400"
                                : "bg-cm-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cm-slate-400">
                      <Timer className="w-3 h-3" />
                      <span>
                        {t("wellbeing.cycle_count", "Cycle {current} of {total}")
                          .replace("{current}", String(currentCycleNumber))
                          .replace("{total}", String(TOTAL_CYCLES))}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                    <Wind className="w-10 h-10 text-indigo-400" />
                  </div>
                )}

                {/* Inactive CTA buttons */}
                {!isActive && !completed && (
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={handleStart}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-heading font-semibold text-sm transition-all cursor-pointer hover:from-sky-600 hover:to-indigo-600"
                    >
                      <Play className="w-4 h-4" />
                      {t("wellbeing.start_breathing", "Start Breathing")}
                    </button>
                    <button
                      onClick={onDismiss}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-cm-slate-100 text-cm-slate-600 font-medium text-sm hover:bg-cm-slate-200 transition-colors cursor-pointer"
                    >
                      {t("wellbeing.skip", "Skip")}
                    </button>
                  </div>
                )}

                {/* Active stop button */}
                {isActive && !completed && (
                  <button
                    onClick={handleStop}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-cm-slate-100 text-cm-slate-500 font-medium text-sm hover:bg-cm-slate-200 transition-colors cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    {t("wellbeing.stop", "Stop")}
                  </button>
                )}

                {/* Completed button */}
                {completed && (
                  <button
                    onClick={onDismiss}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-heading font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
                  >
                    {t("wellbeing.continue_test", "Continue Test")}
                  </button>
                )}
              </div>

              {/* Quick tip */}
              {!isActive && !completed && (
                <p className="text-center text-xs text-cm-slate-400 mt-2">
                  {t("wellbeing.subtitle", "4-7-8 breathing • 3 cycles • 1 minute")}
                </p>
              )}
            </div>
          </div>
        ) : (
          // Animated overlay for normal motion
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isActive) onDismiss();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-[20px] p-6 sm:p-8 overflow-hidden"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.1) 0px 4px 12px 0px, rgba(0,0,0,0.2) 0px 20px 48px 0px",
              }}
            >
              {/* Background gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-400" />

              {/* Close button */}
              {!isActive && (
                <button
                  onClick={onDismiss}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cm-slate-100 hover:bg-cm-slate-200 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <X className="w-4 h-4 text-cm-slate-500" />
                </button>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-sky-400 to-indigo-500 mb-4">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-heading font-bold text-cm-slate-900 mb-1.5">
                  {t("wellbeing.title", "Take a Breath")}
                </h2>
                <p className="text-sm text-cm-slate-500 leading-relaxed max-w-xs mx-auto">
                  {completed
                    ? t("wellbeing.completed", "Feeling refreshed! Your mind is ready to continue.")
                    : isActive
                      ? t("wellbeing.follow_guide", "Follow the circle's rhythm…")
                      : getReasonText()}
                </p>
              </div>

              {/* Breathing animation area */}
              <div className="flex flex-col items-center justify-center py-6">
                {completed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-12 h-12 text-white"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </motion.svg>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">
                      {t("wellbeing.done", "Done!")}
                    </span>
                  </motion.div>
                ) : isActive ? (
                  <div className="flex flex-col items-center gap-4">
                    <BreathingCircle phase={currentPhase} progress={phaseProgress} shouldReduceMotion={shouldReduceMotion} />
                    {/* Phase indicator */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < currentCycleNumber - 1
                              ? "bg-emerald-400"
                              : i === currentCycleNumber - 1
                                ? "bg-indigo-400"
                                : "bg-cm-slate-200"
                          }`}
                          animate={
                            i === currentCycleNumber - 1 ? { scale: [1, 1.3, 1] } : {}
                          }
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cm-slate-400">
                      <Timer className="w-3 h-3" />
                      <span>
                        {t("wellbeing.cycle_count", "Cycle {current} of {total}")
                          .replace("{current}", String(currentCycleNumber))
                          .replace("{total}", String(TOTAL_CYCLES))}
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center"
                  >
                    <Wind className="w-10 h-10 text-indigo-400" />
                  </motion.div>
                )}

                {/* Inactive CTA buttons */}
                {!isActive && !completed && (
                  <div className="flex items-center gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleStart}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-heading font-semibold text-sm transition-all cursor-pointer hover:from-sky-600 hover:to-indigo-600"
                    >
                      <Play className="w-4 h-4" />
                      {t("wellbeing.start_breathing", "Start Breathing")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onDismiss}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-cm-slate-100 text-cm-slate-600 font-medium text-sm hover:bg-cm-slate-200 transition-colors cursor-pointer"
                    >
                      {t("wellbeing.skip", "Skip")}
                    </motion.button>
                  </div>
                )}

                {/* Active stop button */}
                {isActive && !completed && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStop}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-cm-slate-100 text-cm-slate-500 font-medium text-sm hover:bg-cm-slate-200 transition-colors cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    {t("wellbeing.stop", "Stop")}
                  </motion.button>
                )}

                {/* Completed button */}
                {completed && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onDismiss}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-heading font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
                  >
                    {t("wellbeing.continue_test", "Continue Test")}
                  </motion.button>
                )}
              </div>

              {/* Quick tip */}
              {!isActive && !completed && (
                <p className="text-center text-xs text-cm-slate-400 mt-2">
                  {t("wellbeing.subtitle", "4-7-8 breathing • 3 cycles • 1 minute")}
                </p>
              )}
            </motion.div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
