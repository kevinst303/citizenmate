"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "New citizen from India",
    review:
      "The bilingual mode was a game-changer for me. I could study complex topics in Hindi first, then switch to English for the test. Passed on my first try!",
    rating: 5,
    avatar: "PS",
    gradient: "from-teal-400 to-teal-600",
  },
  {
    name: "Wei Chen",
    role: "New citizen from China",
    review:
      "The mock tests are exactly like the real thing. After my third practice test, I knew I was ready. The AI explanations helped me understand not just the answers, but the 'why'.",
    rating: 5,
    avatar: "WC",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Ahmed Al-Rashid",
    role: "New citizen from Iraq",
    review:
      "I was so nervous about the test. CitizenMate's progress tracking showed me exactly which chapters needed more work. By test day, I felt completely prepared.",
    rating: 5,
    avatar: "AA",
    gradient: "from-violet-400 to-violet-600",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      type: "spring" as const,
      stiffness: 100,
      damping: 16,
    },
  }),
};

export function SocialProof() {
  return (
    <section className="py-20 sm:py-28 section-alt-bg">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
              Testimonials
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            Loved by new Australians
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            Join thousands of people who passed their citizenship test with confidence.
          </motion.p>
        </div>

        {/* Testimonial cards — Conseil 3-column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="card-conseil flex flex-col"
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

        {/* Summary stat row — elevated card style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-cm-teal-50 border border-cm-teal-100/50 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "4.9/5", label: "Average rating" },
            { value: "10K+", label: "Students helped" },
            { value: "97%", label: "Pass rate" },
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
          <a href="/practice" className="btn-rounded btn-rounded-teal">
            Start Free Practice
          </a>
          <a href="/#pricing" className="btn-rounded btn-rounded-outline">
            View Pricing
          </a>
        </motion.div>
      </div>
    </section>
  );
}
