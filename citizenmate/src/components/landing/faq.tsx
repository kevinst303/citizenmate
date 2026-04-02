"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header — Conseil style */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <span className="badge-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
              FAQ
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        {/* FAQ items — Conseil clean accordion */}
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
                className="border border-cm-slate-100 rounded-[15px] px-6 data-open:border-cm-teal/20 data-open:shadow-sm transition-all duration-200 bg-white"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-base py-5 hover:no-underline hover:text-cm-teal transition-colors cursor-pointer aria-expanded:text-cm-teal">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        {/* CTA bar — "Still have questions?" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-cm-teal-50 border border-cm-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h3 className="font-heading font-bold text-lg">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;re here to help you on your citizenship journey.
            </p>
          </div>
          <a
            href="mailto:hello@citizenmate.com.au"
            className="btn-rounded btn-rounded-teal text-sm shrink-0"
          >
            Contact Us
            <ArrowRight className="size-4 ml-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
