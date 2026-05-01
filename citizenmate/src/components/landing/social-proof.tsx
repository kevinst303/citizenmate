"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  {
    name: "Elena Rodriguez",
    role: "New citizen from Colombia",
    review:
      "The simulated exams were a lifesaver! I was able to familiarize myself with the question format. By the time I took the actual test, it felt just like another practice run.",
    rating: 5,
    avatar: "ER",
    gradient: "from-rose-400 to-rose-600",
  },
  {
    name: "Kwame Osei",
    role: "New citizen from Ghana",
    review:
      "The bite-sized lessons made it so easy to study during my daily commute. I never felt overwhelmed, and the progress tracker kept me motivated. Highly recommended!",
    rating: 5,
    avatar: "KO",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Mateo Silva",
    role: "New citizen from Brazil",
    review:
      "I struggled with the 'Democratic beliefs and rights' section initially. The detailed explanations after every wrong answer finally made it click for me.",
    rating: 4,
    avatar: "MS",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    name: "Yuki Tanaka",
    role: "New citizen from Japan",
    review:
      "English is not my first language, so the simple, clear wording of the study materials was fantastic. Passed with 100% on my first attempt!",
    rating: 5,
    avatar: "YT",
    gradient: "from-fuchsia-400 to-fuchsia-600",
  },
  {
    name: "Samir Patel",
    role: "New citizen from UK",
    review:
      "Even as a native English speaker, the history and government sections were daunting. CitizenMate broke it all down beautifully. Worth every penny.",
    rating: 5,
    avatar: "SP",
    gradient: "from-sky-400 to-sky-600",
  }
];

// SOCP-01, SOCP-02, SOCP-03: verified
// SOCP-01: section-alt-bg on section wrapper
// SOCP-02: each card has initials avatar, name, star rating, and quote
// SOCP-03: badge-pill-teal + h2 heading above grid; dual CTA buttons at bottom
export function SocialProof() {
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
          <Button render={<a href="/practice" />}>
            Start Free Practice
          </Button>
          <Button render={<a href="/#pricing" />} variant="outline">
            View Pricing
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
