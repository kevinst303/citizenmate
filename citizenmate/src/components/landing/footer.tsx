"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Mock Tests", href: "/practice" },
    { label: "Study Mode", href: "/study" },
  ],
  Support: [
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "mailto:hello@citizenmate.com.au" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

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
  return (
    <footer className="bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
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
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cm-teal text-white font-heading font-bold text-lg">
                CM
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Citizen<span className="text-cm-teal">Mate</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your mate for the citizenship test. Study in your language,
              practice with AI, and pass with confidence.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {["Facebook", "Twitter", "Instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-cm-teal flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label={social}
                >
                  {social.charAt(0)}
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
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-foreground transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
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
              CitizenMate is independent from the Australian Government. Not
              affiliated with or endorsed by the Department of Home Affairs.
            </p>
            <p className="text-xs text-zinc-400">
              Content based on &ldquo;Our Common Bond&rdquo; booklet — March
              2026 edition.
            </p>
          </div>
          <p className="text-xs text-zinc-400 shrink-0">
            © {new Date().getFullYear()} CitizenMate. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
