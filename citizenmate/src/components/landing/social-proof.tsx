"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Shield } from "lucide-react";

const stats = [
  {
    value: 183000,
    suffix: "+",
    label: "tests taken per year",
    format: true,
  },
  {
    value: 33,
    suffix: "%",
    label: "fail at least once",
    format: false,
  },
  {
    value: 75,
    suffix: "%",
    label: "pass score needed",
    format: false,
  },
];

function AnimatedCounter({
  value,
  suffix,
  format,
  inView,
}: {
  value: number;
  suffix: string;
  format: boolean;
  inView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return controls.stop;
  }, [value, inView]);

  const formatted = format
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span className="font-heading text-4xl sm:text-5xl font-bold text-gradient-navy">
      {formatted}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                format={stat.format}
                inView={isInView}
              />
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-cm-eucalyptus/5 border border-cm-eucalyptus/20 max-w-xl mx-auto"
        >
          <Shield className="size-5 text-cm-eucalyptus shrink-0" />
          <p className="text-sm text-muted-foreground text-center">
            All content sourced from the official{" "}
            <span className="font-semibold text-foreground">
              &ldquo;Our Common Bond&rdquo;
            </span>{" "}
            booklet published by the Department of Home Affairs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
