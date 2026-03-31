"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// Star particle data
const stars = [
  { top: "15%", left: "12%", size: 1.5, delay: 0, duration: 4 },
  { top: "25%", right: "18%", size: 2, delay: 1.2, duration: 5 },
  { top: "60%", left: "8%", size: 1, delay: 2.5, duration: 3.5 },
  { top: "45%", right: "10%", size: 2.5, delay: 0.8, duration: 6 },
  { top: "75%", left: "20%", size: 1, delay: 3, duration: 4.5 },
  { top: "35%", right: "25%", size: 1.5, delay: 1.8, duration: 5.5 },
  { top: "80%", right: "15%", size: 1, delay: 0.5, duration: 3.8 },
  { top: "10%", left: "35%", size: 1, delay: 2, duration: 4.2 },
];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background gradient — Australian navy to deep blue */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/generated/cta-australia.webp"
          alt="Sydney Harbour at golden hour with family silhouette"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-cm-navy/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      {/* Animated star particles with Framer Motion */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/25"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            width: `${star.size * 4}px`,
            height: `${star.size * 4}px`,
          }}
          animate={{
            y: [0, -15, 5, -10, 0],
            x: [0, 8, -5, 3, 0],
            opacity: [0.15, 0.5, 0.2, 0.6, 0.15],
            scale: [1, 1.3, 0.9, 1.15, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Text reveal with clip mask */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight"
            >
              Ready to become an Australian citizen, mate?
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-6 text-lg text-white/80 max-w-xl mx-auto"
          >
            Start your free practice test now — no signup needed. See where you
            stand in 10 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* CTA with pulsing glow */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Pulsing glow ring behind button */}
              <div className="absolute -inset-1 rounded-xl bg-cm-red/40 blur-lg animate-cta-glow" />
              <Button className="relative bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold text-base px-8 h-13 rounded-xl cursor-pointer transition-colors duration-200 shadow-lg shadow-cm-red/30">
                Start Free Practice
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-6 text-sm text-white/50"
          >
            No credit card required. Free tier available forever.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
