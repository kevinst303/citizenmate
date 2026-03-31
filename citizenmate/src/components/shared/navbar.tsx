"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { UserMenu } from "@/components/shared/user-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Practice", href: "/practice" },
  { label: "Study", href: "/study" },
  { label: "Blog", href: "/blog" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 ease-out",
        scrolled
          ? "top-3 left-4 right-4 navbar-glass rounded-2xl border border-cm-slate-200/60"
          : "top-0 left-0 right-0 bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with hover spring */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy text-white font-heading font-bold text-lg"
            >
              CM
            </motion.div>
            <span className="font-heading text-xl font-bold text-foreground">
              Citizen
              <span className="text-cm-navy">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-cm-navy transition-colors duration-200 rounded-lg hover:bg-cm-navy-50 cursor-pointer"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA + User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/practice"
                className="inline-flex items-center justify-center bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold px-5 h-10 rounded-xl cursor-pointer transition-colors duration-200"
              >
                Start Free Practice
              </Link>
            </motion.div>
            <UserMenu />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex items-center justify-center size-10 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-cm-ice">
                <SheetTitle className="font-heading text-lg font-bold px-2">
                  Citizen<span className="text-cm-navy">Mate</span>
                </SheetTitle>
                <div className="flex flex-col gap-2 mt-8 px-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, type: "spring" as const, stiffness: 200, damping: 18 }}
                    >
                      <SheetClose
                        nativeButton={false}
                        render={
                          <a
                            href={link.href}
                            className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-cm-navy-50 rounded-xl transition-colors duration-200 cursor-pointer"
                            onClick={() => setOpen(false)}
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring" as const, stiffness: 150, damping: 16 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <SheetClose
                      render={
                        <button
                          className="w-full inline-flex items-center justify-center bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold h-12 rounded-xl cursor-pointer transition-all duration-200"
                          onClick={() => setOpen(false)}
                        />
                      }
                    >
                      Start Free Practice
                    </SheetClose>
                    <div className="mt-3 flex justify-center">
                      <UserMenu />
                    </div>
                  </motion.div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
