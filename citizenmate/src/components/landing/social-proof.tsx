"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Shield } from "lucide-react";
import Image from "next/image";

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
    // Overshoot by 8% then settle back — spring feel
    const overshoot = Math.round(value * 1.08);
    const controls = animate(0, overshoot, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      onComplete: () => {
        // Settle back to real value
        const settle = animate(overshoot, value, {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return settle.stop;
      },
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
    <section className="py-24 sm:py-32 section-divider-top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.15 * index,
                type: "spring",
                stiffness: 120,
                damping: 14,
              }}
              whileHover={{
                y: -4,
                scale: 1.03,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="text-center cursor-default"
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

        {/* Citizenship ceremony photo */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 14,
          }}
          className="relative w-full max-w-3xl mx-auto h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card mb-12"
        >
          <Image
            src="/generated/social-proof-people.webp"
            alt="Happy and proud new Australian citizens from diverse cultural backgrounds at a citizenship ceremony"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 14,
          }}
          whileHover={{
            y: -3,
            scale: 1.02,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl glass-card shadow-card max-w-xl mx-auto cursor-default"
        >
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={isInView ? { rotate: 0, scale: 1 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 12 }}
          >
            <Shield className="size-5 text-cm-eucalyptus shrink-0" />
          </motion.div>
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
