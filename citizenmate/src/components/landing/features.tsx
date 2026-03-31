"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipboardCheck, Languages, BarChart3, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Smart Mock Tests",
    description:
      "20 questions, 45 minutes — just like the real test. With detailed explanations for every answer, referencing the official Our Common Bond booklet.",
    color: "text-cm-navy",
    bg: "bg-cm-navy/8",
    borderHover: "hover:border-cm-navy/30",
    shadowHover: "hover:shadow-cm-navy/5",
    cta: "Start Practising",
    href: "/practice",
    image: "/generated/feature-tests.webp",
    imageAlt: "Confident woman taking a practice citizenship test on a tablet",
  },
  {
    icon: Languages,
    title: "Bilingual Study Mode",
    description:
      "Study the official content in English alongside your native language. Understand concepts deeply, then answer confidently in English.",
    color: "text-cm-red",
    bg: "bg-cm-red/8",
    borderHover: "hover:border-cm-red/30",
    shadowHover: "hover:shadow-cm-red/5",
    cta: "Start Studying",
    href: "/study",
    image: "/generated/feature-bilingual.webp",
    imageAlt: "Man studying with bilingual books in multiple languages at an Australian cafe",
  },
  {
    icon: BarChart3,
    title: "Know When You're Ready",
    description:
      "Track your progress topic by topic. See your strengths, identify gaps, and know exactly when you're ready to sit the test.",
    color: "text-cm-eucalyptus",
    bg: "bg-cm-eucalyptus/8",
    borderHover: "hover:border-cm-eucalyptus/30",
    shadowHover: "hover:shadow-cm-eucalyptus/5",
    cta: "Track Progress",
    href: "/study",
    image: "/generated/feature-progress.webp",
    imageAlt: "Woman celebrating progress on her dashboard with achievement badges",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 * (i + 1),
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
    },
  }),
};

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Everything you need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Prepare with confidence, mate
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            More than a quiz app — CitizenMate is your personal study partner
            for the Australian citizenship test.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              <div className={`group relative h-full p-8 rounded-2xl feature-card-glass border-gradient-hover ${feature.borderHover} shadow-card hover:shadow-card-hover cursor-pointer`}>
                {/* Feature image */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6 -mt-2">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Icon with bounce on hover */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bg} mb-6`}
                >
                  <feature.icon className={`size-7 ${feature.color}`} />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className={`inline-flex items-center gap-1.5 mt-5 text-sm font-semibold ${feature.color} transition-all duration-200`}
                >
                  {feature.cta}
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
