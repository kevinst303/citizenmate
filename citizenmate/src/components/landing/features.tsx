"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipboardCheck, Languages, BarChart3, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

const features = [
  {
    icon: ClipboardCheck,
    titleKey: "landing.features_smart_title",
    titleFallback: "Smart Mock Tests",
    descKey: "landing.features_smart_desc",
    descFallback: "20 questions, 45 minutes — just like the real test. Detailed explanations referencing the official Our Common Bond booklet.",
    ctaKey: "landing.features_smart_cta",
    ctaFallback: "Start Practising",
    href: "/practice",
    image: "/generated/feature-tests.webp",
    imageAltKey: "landing.features_smart_image_alt",
    imageAlt: "Confident woman taking a practice citizenship test on a tablet",
  },
  {
    icon: Languages,
    titleKey: "landing.features_bilingual_title",
    titleFallback: "Bilingual Study Mode",
    descKey: "landing.features_bilingual_desc",
    descFallback: "Study official content in English alongside your native language. Understand concepts deeply, then answer confidently.",
    ctaKey: "landing.features_bilingual_cta",
    ctaFallback: "Start Studying",
    href: "/study",
    image: "/generated/feature-bilingual.webp",
    imageAltKey: "landing.features_bilingual_image_alt",
    imageAlt: "Man studying with bilingual books in multiple languages at an Australian cafe",
    badgeKey: "landing.features_popular",
    badgeFallback: "Popular",
  },
  {
    icon: BarChart3,
    titleKey: "landing.features_ready_title",
    titleFallback: "Know When You're Ready",
    descKey: "landing.features_ready_desc",
    descFallback: "Track progress topic by topic. See your strengths, identify gaps, and know exactly when you're ready to sit the test.",
    ctaKey: "landing.features_ready_cta",
    ctaFallback: "Track Progress",
    href: "/study",
    image: "/generated/feature-progress.webp",
    imageAltKey: "landing.features_ready_image_alt",
    imageAlt: "Woman celebrating progress on her dashboard with achievement badges",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * (i + 1),
      type: "spring" as const,
      stiffness: 100,
      damping: 16,
    },
  }),
};

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useT();

  return (
    <section id="features" className="pt-[140px] pb-[100px]">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        {/* Section header — Conseil style with badge pill */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <span className="badge-pill badge-pill-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
              {t("landing.features_badge", "Why CitizenMate")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            {t("landing.features_title", "Prepare with confidence, mate")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            {t("landing.features_desc", "More than a quiz app — CitizenMate is your personal study partner for the Australian citizenship test.")}
          </motion.p>
        </div>

        {/* Feature cards — Conseil 3-column grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              <div className="group relative h-full card-conseil cursor-pointer">
                {/* Feature image */}
                <div className="relative w-full h-44 rounded-[16px] overflow-hidden mb-6 -mt-0.5">
                  <Image
                    src={feature.image}
                    alt={t(feature.imageAltKey, feature.imageAlt)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent pointer-events-none" />
                  {/* Badge on image */}
                  {feature.badgeKey && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-pill-dark text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1"
                        style={{ background: '#1a1a1a', color: '#fff', fontSize: '0.75rem' }}
                      >
                        {t(feature.badgeKey, feature.badgeFallback || "")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Icon — teal circle */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-teal/8 mb-5">
                  <feature.icon className="size-6 text-cm-teal" />
                </div>

                <h3 className="font-heading text-xl font-bold mb-3">
                  {t(feature.titleKey, feature.titleFallback || "")}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
                  {t(feature.descKey, feature.descFallback || "")}
                </p>

                {/* CTA link — Conseil "Explore →" style */}
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-cm-teal hover:text-cm-teal-dark transition-colors duration-200 group/link"
                >
                  {t(feature.ctaKey, feature.ctaFallback || "")}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
