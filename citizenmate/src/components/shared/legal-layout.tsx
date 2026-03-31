"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-cm-ice">
      {/* Hero header */}
      <div className="bg-cm-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content body */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          {/* Table of contents — sticky sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 18 }}
            className="hidden lg:block"
          >
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-heading font-semibold uppercase tracking-wider text-cm-slate-400 mb-3">
                On this page
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-cm-slate-500 hover:text-cm-navy transition-colors py-1.5 pl-3 border-l-2 border-transparent hover:border-cm-navy"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </motion.aside>

          {/* Main content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 18 }}
            className="legal-content"
          >
            {children}
          </motion.article>
        </div>
      </div>
    </div>
  );
}
