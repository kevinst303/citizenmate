"use client";

import { motion } from "framer-motion";
import { SubpageHero } from "@/components/shared/subpage-hero";

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
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero header */}
      <SubpageHero
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: title },
        ]}
        description={`Last updated: ${lastUpdated}`}
        bgImage=""
        curveColorClass="text-slate-50"
      />

      {/* Content body */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          {/* Table of contents — sticky sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 18 }}
            className="hidden lg:block"
          >
            <nav className="sticky top-24 space-y-1 bg-white p-6 rounded-[10px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-conseil-teal mb-4">
                On this page
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-gray-500 hover:text-conseil-teal transition-colors py-2 pl-3 border-l-2 border-transparent hover:border-conseil-teal"
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
            className="legal-content bg-white p-8 md:p-12 rounded-[10px] shadow-card"
          >
            {children}
          </motion.article>
        </div>
      </div>
    </div>
  );
}
