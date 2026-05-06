"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ClipboardCheck,
  Languages,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useT } from "@/i18n/i18n-context";

interface TabData {
  icon: LucideIcon;
  label: string;
  badge: string;
  heading: string;
  description: string;
  cta: string;
  href: string;
  featureBadge: string;
  checklist: string[];
  image: string;
  imageAlt: string;
}



export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useT();

  const tabs: TabData[] = [
    {
      icon: ClipboardCheck,
      label: t("landing.demo_tab_1_label"),
      badge: t("landing.demo_tab_1_badge"),
      heading: t("landing.demo_tab_1_title"),
      description: t("landing.demo_tab_1_desc"),
      cta: t("landing.demo_tab_1_cta"),
      href: "/practice",
      featureBadge: t("landing.demo_tab_1_feature_badge"),
      checklist: [
        t("landing.demo_tab_1_check_1"),
        t("landing.demo_tab_1_check_2"),
        t("landing.demo_tab_1_check_3"),
      ],
      image: "/generated/feature-tests.webp",
      imageAlt: t("landing.demo_tab_1_image_alt"),
    },
    {
      icon: Languages,
      label: t("landing.demo_tab_2_label"),
      badge: t("landing.demo_tab_2_badge"),
      heading: t("landing.demo_tab_2_title"),
      description: t("landing.demo_tab_2_desc"),
      cta: t("landing.demo_tab_2_cta"),
      href: "/study",
      featureBadge: t("landing.demo_tab_2_feature_badge"),
      checklist: [
        t("landing.demo_tab_2_check_1"),
        t("landing.demo_tab_2_check_2"),
        t("landing.demo_tab_2_check_3"),
      ],
      image: "/generated/feature-bilingual.webp",
      imageAlt: t("landing.demo_tab_2_image_alt"),
    },
    {
      icon: BarChart3,
      label: t("landing.demo_tab_3_label"),
      badge: t("landing.demo_tab_3_badge"),
      heading: t("landing.demo_tab_3_title"),
      description: t("landing.demo_tab_3_desc"),
      cta: t("landing.demo_tab_3_cta"),
      href: "/practice",
      featureBadge: t("landing.demo_tab_3_feature_badge"),
      checklist: [
        t("landing.demo_tab_3_check_1"),
        t("landing.demo_tab_3_check_2"),
        t("landing.demo_tab_3_check_3"),
      ],
      image: "/generated/feature-progress.webp",
      imageAlt: t("landing.demo_tab_3_image_alt"),
    },
  ];

  const active = tabs[activeTab];

  return (
    <section className="py-20 sm:py-28 section-alt-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-14 items-start">
          {/* Left Column — Heading + Vertical Tabs */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-heading text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold tracking-tight leading-[1.1] text-balance"
            >
              {t("landing.demo_heading")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              {t("landing.demo_subtitle")}
            </motion.p>

            {/* Tab buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
            >
              {tabs.map((tab, index) => {
                const isActive = index === activeTab;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink lg:w-full ${
                      isActive
                        ? "bg-cm-teal text-white shadow-md shadow-cm-teal/20"
                        : "text-muted-foreground hover:bg-cm-teal/5 border-b lg:border-b border-cm-slate-100/60 last:border-b-0"
                    }`}
                  >
                    <Icon
                      className={`size-5 shrink-0 ${
                        isActive ? "text-white" : "text-cm-teal/50"
                      }`}
                    />
                    <span
                      className={`text-[0.95rem] ${
                        isActive ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column — Content that switches per tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Content Card (white) */}
              <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-cm-slate-100/50 flex flex-col">
                <span className="inline-flex items-center self-start px-3.5 py-1 rounded-full bg-cm-teal/8 text-cm-teal text-xs font-bold mb-5">
                  {active.badge}
                </span>
                <h3 className="font-heading text-2xl sm:text-[1.7rem] font-bold tracking-tight leading-tight">
                  {active.heading}
                </h3>
                <p className="mt-3 text-muted-foreground text-[0.95rem] leading-relaxed flex-1">
                  {active.description}
                </p>
                <motion.a
                  href={active.href}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-cm-teal text-white font-heading font-semibold text-sm hover:bg-cm-teal-dark transition-colors self-start"
                >
                  {active.cta}
                  <ArrowRight className="size-4" />
                </motion.a>
              </div>

              {/* Feature Card (image overlay) */}
              <div className="relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-0">
                <Image
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
                />
                {/* Teal overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#004a50]/80 via-[#006d77]/75 to-[#008a93]/70" />
                {/* Content on overlay */}
                <div className="relative z-10 p-7 sm:p-8 flex flex-col justify-end h-full">
                  <span className="inline-flex items-center self-start px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold mb-5">
                    {active.featureBadge}
                  </span>
                  <ul className="space-y-3">
                    {active.checklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-white font-medium text-[0.95rem]"
                      >
                        <CheckCircle2 className="size-5 text-emerald-300 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
