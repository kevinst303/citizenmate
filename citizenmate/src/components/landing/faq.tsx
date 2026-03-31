"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is CitizenMate an official government app?",
    answer:
      "No. CitizenMate is an independent study tool and is not affiliated with or endorsed by the Australian Government or the Department of Home Affairs. All our practice content is based on the official 'Our Common Bond' booklet, but we always recommend referring to the official materials as the definitive source.",
  },
  {
    question: "How is the real citizenship test structured?",
    answer:
      "The Australian citizenship test consists of 20 multiple-choice questions drawn from the 'Our Common Bond' booklet. You have 45 minutes to complete it. You need to answer at least 15 questions correctly (75%) to pass, AND you must answer all 5 Australian values questions correctly. The test is conducted only in English.",
  },
  {
    question: "What languages does CitizenMate support?",
    answer:
      "We currently support English and Simplified Chinese in our bilingual study mode. This means you can read the study content side-by-side in English and Chinese, helping you understand concepts deeply before answering in English. We're adding more languages soon — including Arabic, Hindi, Vietnamese, and Tagalog.",
  },
  {
    question: "How is CitizenMate different from other practice test sites?",
    answer:
      "Most citizenship test prep tools are basic quiz apps with outdated questions and no learning support. CitizenMate offers smart mock tests that mirror the real test experience, bilingual study mode, AI-powered explanations, a readiness score that tells you when you're actually prepared, and a study plan anchored to your test date.",
  },
  {
    question: "What's included in the free tier?",
    answer:
      "The free tier includes 1 full mock test with results and explanations, access to the basic Australian Values study content, 3 AI tutor questions per day, and a topic mastery overview. It's enough to see where you stand and decide if you need more support.",
  },
  {
    question: "What is the Exam Sprint Pass?",
    answer:
      "The Exam Sprint Pass ($29.99) gives you full CitizenMate Pro access for 60 days — designed to match the typical 2-3 month study window before the test. It includes all 500+ practice questions, complete bilingual study mode, unlimited AI tutor, readiness score, spaced repetition, and a personalised test-date study plan.",
  },
];

const faqItem = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      type: "spring" as const,
      stiffness: 120,
      damping: 16,
    },
  }),
};

export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 section-divider-top">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header — spring entrance */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="text-cm-navy font-heading font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Questions?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        {/* FAQ items — staggered entrance */}
        <Accordion className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={faqItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              <AccordionItem
                className="border border-border rounded-xl px-6 data-open:border-cm-navy/25 data-open:shadow-sm transition-all duration-200"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-base py-5 hover:no-underline hover:text-cm-navy transition-colors cursor-pointer aria-expanded:text-cm-navy">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
