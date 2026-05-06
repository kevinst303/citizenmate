"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/lib/use-localized-path";
import { useT } from "@/i18n/i18n-context";

// SOCP-01, SOCP-02, SOCP-03: verified
// SOCP-01: section-alt-bg on section wrapper
// SOCP-02: each card has initials avatar, name, star rating, and quote
// SOCP-03: badge-pill-teal + h2 heading above grid; dual CTA buttons at bottom
export function SocialProof() {
  const { getUrl } = useLocalizedPath();
  const { t } = useT();

  const testimonials = [
    {
      name: t("landing.testimonial_1_name"),
      role: t("landing.testimonial_1_role"),
      review: t("landing.testimonial_1_text"),
      rating: 5,
      avatar: "PS",
      gradient: "from-teal-400 to-teal-600",
    },
    {
      name: t("landing.testimonial_2_name"),
      role: t("landing.testimonial_2_role"),
      review: t("landing.testimonial_2_text"),
      rating: 5,
      avatar: "WC",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      name: t("landing.testimonial_3_name"),
      role: t("landing.testimonial_3_role"),
      review: t("landing.testimonial_3_text"),
      rating: 5,
      avatar: "AA",
      gradient: "from-violet-400 to-violet-600",
    },
    {
      name: t("landing.testimonial_4_name"),
      role: t("landing.testimonial_4_role"),
      review: t("landing.testimonial_4_text"),
      rating: 5,
      avatar: "ER",
      gradient: "from-rose-400 to-rose-600",
    },
    {
      name: t("landing.testimonial_5_name"),
      role: t("landing.testimonial_5_role"),
      review: t("landing.testimonial_5_text"),
      rating: 5,
      avatar: "KO",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: t("landing.testimonial_6_name"),
      role: t("landing.testimonial_6_role"),
      review: t("landing.testimonial_6_text"),
      rating: 4,
      avatar: "MS",
      gradient: "from-amber-400 to-amber-600",
    },
    {
      name: t("landing.testimonial_7_name"),
      role: t("landing.testimonial_7_role"),
      review: t("landing.testimonial_7_text"),
      rating: 5,
      avatar: "YT",
      gradient: "from-fuchsia-400 to-fuchsia-600",
    },
    {
      name: t("landing.testimonial_8_name"),
      role: t("landing.testimonial_8_role"),
      review: t("landing.testimonial_8_text"),
      rating: 5,
      avatar: "SP",
      gradient: "from-sky-400 to-sky-600",
    },
  ];

  return (
    <section className="py-20 sm:py-28 section-alt-bg overflow-hidden relative">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 relative mb-16">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <span className="badge-pill badge-pill-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
              {t("landing.testimonials_badge")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            {t("landing.testimonials_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            {t("landing.testimonials_subtitle")}
          </motion.p>
        </div>
      </div>

      {/* Testimonial marquee - Full Width */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group py-4"
      >
        {/* Gradient masks for infinite effect - Anchored to screen edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 lg:w-64 bg-gradient-to-r from-[#F4F4F5] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 lg:w-64 bg-gradient-to-l from-[#F4F4F5] to-transparent z-10" />

        <div className="flex w-max min-w-full animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="card-conseil flex flex-col w-[320px] sm:w-[350px] md:w-[400px] shrink-0 mr-6 lg:mr-8"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote icon */}
              <Quote className="size-8 text-cm-teal/15 mb-3 -scale-x-100" />

              {/* Review text */}
              <p className="text-foreground leading-relaxed text-[0.95rem] flex-1">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-cm-slate-100 mt-6 pt-5">
                {/* Reviewer info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 relative">
        {/* Summary stat row — elevated card style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-cm-teal-50 border border-cm-teal-100/50 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "4.9/5", label: t("landing.testimonials_rating") },
            { value: "10K+", label: t("landing.testimonials_students") },
            { value: "97%", label: t("landing.testimonials_pass_rate") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-heading text-3xl font-extrabold text-cm-teal">
                {stat.value}
              </span>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Dual CTA — Conseil pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button render={<a href={getUrl("/practice")} />}>
            {t("landing.testimonials_cta_practice")}
          </Button>
          <Button render={<a href="/#pricing" />} variant="outline">
            {t("landing.testimonials_cta_pricing")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
