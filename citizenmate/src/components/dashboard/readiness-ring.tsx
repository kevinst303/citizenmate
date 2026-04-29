import { motion } from "framer-motion";

export function ReadinessRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const filled = (score / 100) * circumference;

  const outerCircumference = 2 * Math.PI * 58;
  const outerFilled = (score / 100) * outerCircumference;

  const color =
    score >= 75
      ? "stroke-cm-eucalyptus"
      : score >= 50
        ? "stroke-cm-gold"
        : score >= 25
          ? "stroke-orange-400"
          : "stroke-cm-red";

  const outerColor =
    score >= 75
      ? "stroke-cm-eucalyptus/30"
      : score >= 50
        ? "stroke-cm-gold/30"
        : score >= 25
          ? "stroke-orange-400/30"
          : "stroke-cm-red/30";

  return (
    <div className="relative inline-flex items-center justify-center w-40 h-40 animate-glow">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
        {/* Outer track (subtle) */}
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          strokeWidth="3"
          className="stroke-cm-slate-100/50"
        />
        {/* Outer progress ring (subtle accent) */}
        <motion.circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={outerColor}
          initial={{ strokeDasharray: `0 ${outerCircumference}` }}
          animate={{
            strokeDasharray: `${outerFilled} ${outerCircumference - outerFilled}`,
          }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        />
        {/* Inner track */}
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-cm-slate-100"
        />
        {/* Inner progress ring (main) */}
        <motion.circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          className={color}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{
            strokeDasharray: `${filled} ${circumference - filled}`,
          }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="text-4xl font-heading font-extrabold text-cm-slate-900"
        >
          {score}%
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-cm-slate-500 font-semibold tracking-wide uppercase"
        >
          Ready
        </motion.span>
      </div>
    </div>
  );
}
