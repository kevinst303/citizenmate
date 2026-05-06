"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/i18n/i18n-context";

const columnVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      type: "spring" as const,
      stiffness: 100,
      damping: 16,
    },
  }),
};

export function Footer() {
  const { t } = useT();

  const footerLinks = {
    [t("landing.footer_product", "Product")]: [
      { label: t("landing.footer_features", "Features"), href: "#features" },
      { label: t("landing.footer_pricing", "Pricing"), href: "#pricing" },
      { label: t("landing.footer_mock_tests", "Mock Tests"), href: "/practice" },
      { label: t("landing.footer_study_mode", "Study Mode"), href: "/study" },
    ],
    [t("landing.footer_company", "Company")]: [
      { label: t("landing.footer_faq", "FAQ"), href: "#faq" },
      { label: t("landing.footer_about", "About & Contact"), href: "/about" },
      { label: t("landing.footer_blog", "Blog"), href: "/blog" },
      { label: t("landing.footer_privacy", "Privacy Policy"), href: "/privacy" },
      { label: t("landing.footer_terms", "Terms of Service"), href: "/terms" },
    ],
    [t("landing.footer_australia", "Australia")]: [
      { label: t("landing.footer_home_affairs", "Dept. of Home Affairs"), href: "https://immi.homeaffairs.gov.au" },
      { label: t("landing.footer_ielts", "IELTS Australia"), href: "https://www.ielts.org/en-au" },
      { label: t("landing.footer_common_bond", "Our Common Bond"), href: "https://immi.homeaffairs.gov.au/citizenship-subsite/files/our-common-bond.pdf" },
      { label: t("landing.footer_test_info", "Citizenship Test Info"), href: "https://immi.homeaffairs.gov.au/citizenship-subsite/pages/prepare-for-test" },
    ],
  };

  return (
    <footer className="bg-white border-t border-border">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center">
                <Image src="/logo.svg" alt={t("landing.footer_logo_alt")} width={36} height={36} />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Citizen<span className="text-cm-teal">Mate</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("landing.footer_desc", "Your mate for the citizenship test. Study in your language, practice with AI, and pass with confidence.")}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { key: "landing.footer_social_facebook", label: "Facebook" },
                { key: "landing.footer_social_twitter", label: "Twitter" },
                { key: "landing.footer_social_instagram", label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.key}
                  href="#"
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-cm-teal flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label={t(social.key, social.label)}
                >
                  {t(social.key, social.label).charAt(0)}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div
              key={title}
              custom={colIdx + 1}
              variants={columnVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isPdf = link.href.endsWith(".pdf");
                  
                  if (isPdf) {
                    return (
                      <li key={link.label} suppressHydrationWarning>
                        <a
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-foreground transition-colors duration-200 cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                          suppressHydrationWarning
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-foreground transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-10" />

        {/* Copyright bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">
              {t("landing.footer_disclaimer", "CitizenMate is independent from the Australian Government. Not affiliated with or endorsed by the Department of Home Affairs.")}
            </p>
            <p className="text-xs text-zinc-400">
              {t("landing.footer_content_note", 'Content based on "Our Common Bond" booklet — March 2026 edition.')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {[
                { key: "landing.footer_social_facebook", label: "Facebook" },
                { key: "landing.footer_social_twitter", label: "Twitter" },
                { key: "landing.footer_social_instagram", label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.key}
                  href="#"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-cm-teal flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label={t(social.key, social.label)}
                >
                  {t(social.key, social.label).charAt(0)}
                </a>
              ))}
            </div>
            <p className="text-xs text-zinc-400" suppressHydrationWarning>
              {t("landing.footer_copyright", "© {year} CitizenMate. All rights reserved.").replace("{year}", String(new Date().getFullYear()))}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
