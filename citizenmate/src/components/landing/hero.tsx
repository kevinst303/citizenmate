"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

const trustBadges = [
  "500+ practice questions",
  "Bilingual study mode",
  "Real test format",
  "Free to start",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// Word-by-word animation variants
const wordContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const wordItem = {
  hidden: { opacity: 0, y: 30, rotateX: 40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

// 3D tilt card component
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Split text into words for animation
const headingParts = [
  { text: "Pass", gradient: false },
  { text: "your", gradient: false },
  { text: "Australian", gradient: false },
  { text: "Citizenship", gradient: true },
  { text: "Test", gradient: true },
  { text: "—", gradient: false },
  { text: "guaranteed.", gradient: false },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 noise-overlay">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cm-navy-50 via-white to-cm-sky-light animate-mesh opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cm-red-light/30 via-transparent to-cm-gold-light/20 animate-mesh [animation-delay:5s]" />

        {/* Animated blobs */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-cm-navy/6 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-cm-red/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cm-sky/4 rounded-full blur-3xl"
        />

        {/* Southern Cross star constellation */}
        {[
          { top: "12%", right: "18%", size: "w-2.5 h-2.5", opacity: "bg-cm-navy/35", delay: "0s" },
          { top: "22%", right: "24%", size: "w-2 h-2", opacity: "bg-cm-navy/30", delay: "0.5s" },
          { top: "32%", right: "16%", size: "w-3 h-3", opacity: "bg-cm-navy/25", delay: "1s" },
          { top: "18%", right: "14%", size: "w-1.5 h-1.5", opacity: "bg-cm-navy/40", delay: "1.5s" },
          { top: "28%", right: "22%", size: "w-1 h-1", opacity: "bg-cm-navy/20", delay: "2s" },
          { top: "8%", right: "30%", size: "w-1.5 h-1.5", opacity: "bg-cm-navy/15", delay: "0.8s" },
          { top: "40%", right: "12%", size: "w-2 h-2", opacity: "bg-cm-navy/18", delay: "1.2s" },
        ].map((star, i) => (
          <div
            key={i}
            className={`absolute ${star.size} ${star.opacity} rounded-full animate-star`}
            style={{ top: star.top, right: star.right, animationDelay: star.delay }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Badge with shimmer */}
          <motion.div variants={item}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cm-navy/8 text-cm-navy text-sm font-medium mb-8 border border-cm-navy/10 overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 animate-shimmer" />
              <Sparkles className="size-4 relative z-10" />
              <span className="relative z-10">AI-powered citizenship test prep</span>
            </motion.div>
          </motion.div>

          {/* Heading — word-by-word spring animation */}
          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]"
            style={{ perspective: 600 }}
          >
            {headingParts.map((part, i) => (
              <motion.span
                key={i}
                variants={wordItem}
                className={`inline-block mr-[0.25em] ${part.gradient ? "text-gradient-aussie" : ""}`}
                style={{ transformOrigin: "bottom center" }}
              >
                {part.text}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Your mate for the journey. Study in your language. Practice with AI.
            Know when you&apos;re ready.
          </motion.p>

          {/* CTAs — magnetic hover */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                className="relative bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold text-base px-8 h-13 rounded-xl cursor-pointer transition-colors duration-200 shadow-lg shadow-cm-red/20 overflow-hidden group"
              >
                <span className="relative z-10">Start Free Practice</span>
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-xl animate-cta-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center justify-center font-heading font-medium text-base px-8 h-13 rounded-xl cursor-pointer border border-cm-navy/20 text-cm-navy hover:bg-cm-navy-50 transition-colors duration-200"
            >
              See How It Works
            </motion.a>
          </motion.div>

          {/* Trust Badges — individual spring entrances */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.8 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 14,
                }}
                whileHover={{ y: -2, scale: 1.05 }}
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-default"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 400, damping: 12 }}
                >
                  <CheckCircle className="size-4 text-cm-eucalyptus" />
                </motion.div>
                <span>{badge}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof stat — 3D tilt glass card */}
          <motion.div
            variants={item}
            className="mt-16"
          >
            <TiltCard className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl glass-card shadow-card cursor-default">
              <div className="flex -space-x-2">
                {[
                  "from-cm-navy to-cm-navy-lighter",
                  "from-cm-red to-cm-red-dark",
                  "from-cm-eucalyptus to-emerald-600",
                  "from-cm-sky to-blue-600",
                ].map((gradient, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 300, damping: 12 }}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-white`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1 in 3</span>{" "}
                people fail the citizenship test.{" "}
                <span className="font-semibold text-cm-eucalyptus">
                  CitizenMate users don&apos;t.
                </span>
              </p>
            </TiltCard>
          </motion.div>

          {/* Hero illustration — multicultural study group */}
          <motion.div
            variants={item}
            className="mt-16 w-full max-w-4xl"
          >
            <TiltCard className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cm-navy/10 border border-white/40">
              <Image
                src="/generated/hero-study.webp"
                alt="Diverse group of people from many cultures studying together for the Australian citizenship test"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Subtle gradient overlay at bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-cm-navy/10 via-transparent to-transparent pointer-events-none" />
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
