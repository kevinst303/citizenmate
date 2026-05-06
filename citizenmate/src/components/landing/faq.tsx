"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/lib/use-localized-path";
import { useT } from "@/i18n/i18n-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { getUrl } = useLocalizedPath();
  const { t } = useT();

  const faqs = [
    {
      question: t("landing.faq_q1"),
      answer: t("landing.faq_a1"),
    },
    {
      question: t("landing.faq_q2"),
      answer: t("landing.faq_a2"),
    },
    {
      question: t("landing.faq_q3"),
      answer: t("landing.faq_a3"),
    },
    {
      question: t("landing.faq_q4"),
      answer: t("landing.faq_a4"),
    },
    {
      question: t("landing.faq_q5"),
      answer: t("landing.faq_a5"),
    },
    {
      question: t("landing.faq_q6"),
      answer: t("landing.faq_a6"),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28">
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
              {t("landing.faq_badge")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight text-balance"
          >
            {t("landing.faq_heading")}
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
                className="border border-[#E9ECEF] rounded-[15px] px-6 data-open:border-cm-teal/20 data-open:shadow-sm transition-all duration-200 bg-white"
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
            <h3 className="font-heading font-bold text-lg">{t("landing.faq_contact_title")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("landing.faq_contact_desc")}
            </p>
          </div>
          <Button
            render={<Link href={getUrl("/about#contact")} />}
            className="shrink-0"
          >
            {t("landing.faq_contact_button")}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
