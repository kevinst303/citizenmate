"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, ChevronRight, LayoutDashboard, PenTool, 
  BookOpen, Sparkles, Zap, HelpCircle, FileText
} from "lucide-react";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const DesktopMenuItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-[0.95rem] font-medium text-muted-foreground hover:text-cm-teal transition-colors">
        {label}
        <ChevronRight className={cn("size-3.5 transition-transform duration-200", isHovered ? "rotate-90 text-cm-teal" : "")} />
      </button>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 pt-3"
          >
            <div className="w-[300px] p-2.5 bg-white border border-cm-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.08)] rounded-2xl flex flex-col gap-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MegaMenuLink = ({ href, icon: Icon, title, desc }: any) => (
  <Link href={href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-cm-teal-50 group/link transition-colors cursor-pointer">
    <div className="mt-0.5 flex shrink-0 items-center justify-center size-9 rounded-lg bg-cm-teal/10 text-cm-teal group-hover/link:bg-cm-teal group-hover/link:text-white transition-colors shadow-sm">
      <Icon className="size-4" />
    </div>
    <div>
      <div className="text-[0.95rem] font-semibold text-foreground group-hover/link:text-cm-teal transition-colors leading-none mb-1">{title}</div>
      <div className="text-[0.8rem] text-muted-foreground leading-snug">{desc}</div>
    </div>
  </Link>
);

const MobileMenuLink = ({ href, label, setOpen }: { href: string, label: string, setOpen: (open: boolean) => void }) => (
  <SheetClose
    nativeButton={false}
    render={
      <a
        href={href}
        className="flex items-center px-4 py-2.5 text-[0.95rem] font-medium text-foreground hover:bg-cm-teal-50 hover:text-cm-teal rounded-xl transition-colors duration-200 cursor-pointer"
        onClick={() => setOpen(false)}
      />
    }
  >
    {label}
  </SheetClose>
);

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
    <>
      {/* Top utility bar — Australian branding message */}
      <div 
        className={cn(
          "hidden md:block bg-cm-dark text-white/80 text-xs fixed top-0 inset-x-0 z-[60] transition-transform duration-500 ease-in-out",
          scrolled ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            🇦🇺 Australia&apos;s #1 AI-Powered Citizenship Test Prep
          </span>
          <div className="flex items-center gap-4 font-medium tracking-wide">
            <Link href="/about#contact" className="hover:text-white transition-colors text-white/80">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation — NAV-01, NAV-02: solid white fixed 66px bar; scroll transition cubic-bezier(0.165,0.84,0.44,1) 0.2s, no shadow on scroll */}
      <header
        className={cn(
          "fixed inset-x-0 z-[6050] bg-white border-b border-border",
          scrolled ? "top-0" : "top-0 md:top-9"
        )}
        style={{ transition: 'top 0.2s cubic-bezier(0.165,0.84,0.44,1)' }}
      >
        <nav
          className="w-full flex h-[66px] items-center px-4 sm:px-6 lg:px-8"
        >
          {/* Inner container to constrain content to 1140px */}
          <div className="mx-auto w-full max-w-[1140px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-cm-teal text-white font-heading font-bold text-lg shadow-sm"
            >
              CM
            </motion.div>
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">
              Citizen<span className="text-cm-teal">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2">
            <DesktopMenuItem label="Study Tools">
              <MegaMenuLink 
                href="/dashboard" icon={LayoutDashboard} 
                title="Dashboard" desc="Track your progress and stats" 
              />
              <MegaMenuLink 
                href="/practice" icon={PenTool} 
                title="Practice Tests" desc="Real exam format simulations" 
              />
              <MegaMenuLink 
                href="/study" icon={BookOpen} 
                title="Study Material" desc="Our Common Bond in 5 languages" 
              />
            </DesktopMenuItem>

            <DesktopMenuItem label="Platform">
              <MegaMenuLink 
                href="/#features" icon={Sparkles} 
                title="Features" desc="AI analytics and smart reviews" 
              />
              <MegaMenuLink 
                href="/#how-it-works" icon={Zap} 
                title="How It Works" desc="The proven 3-step learning path" 
              />
              <MegaMenuLink 
                href="/#faq" icon={HelpCircle} 
                title="FAQ" desc="Common questions answered" 
              />
            </DesktopMenuItem>

            <Link href="/#pricing" className="px-3 py-2 text-[0.95rem] font-medium text-muted-foreground hover:text-cm-teal transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="px-3 py-2 text-[0.95rem] font-medium text-muted-foreground hover:text-cm-teal transition-colors">
              Blog
            </Link>
          </div>

          {/* Desktop CTAs + User Menu */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="hidden xl:block"
            >
              <Button
                render={<Link href="/practice" />}
                variant="outline"
                size="sm"
                className="px-5 font-semibold"
              >
                Start Free
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                render={<Link href="/#pricing" />}
                size="sm"
                className="px-5 font-semibold"
              >
                Get Sprint Pass
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </motion.div>
            <div className="ml-2 pl-3 border-l border-border h-6 flex items-center">
              <UserMenu />
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <UserMenu />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex items-center justify-center size-10 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="size-5 text-foreground" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] bg-white flex flex-col p-0">
                <div className="p-4 border-b border-border shadow-sm">
                  <SheetTitle className="font-heading text-xl font-bold flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cm-teal text-white font-heading font-bold text-sm">
                      CM
                    </div>
                    <span>Citizen<span className="text-cm-teal">Mate</span></span>
                  </SheetTitle>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2 py-4">
                  <div className="text-[0.7rem] font-bold text-muted-foreground/70 uppercase tracking-widest px-4 mb-1">Study Tools</div>
                  <MobileMenuLink href="/dashboard" label="Dashboard" setOpen={setOpen} />
                  <MobileMenuLink href="/practice" label="Practice" setOpen={setOpen} />
                  <MobileMenuLink href="/study" label="Study" setOpen={setOpen} />
                  
                  <div className="text-[0.7rem] font-bold text-muted-foreground/70 uppercase tracking-widest px-4 mt-5 mb-1">Platform</div>
                  <MobileMenuLink href="/#features" label="Features" setOpen={setOpen} />
                  <MobileMenuLink href="/#how-it-works" label="How It Works" setOpen={setOpen} />
                  <MobileMenuLink href="/#faq" label="FAQ" setOpen={setOpen} />

                  <div className="text-[0.7rem] font-bold text-muted-foreground/70 uppercase tracking-widest px-4 mt-5 mb-1">Resources</div>
                  <MobileMenuLink href="/#pricing" label="Pricing" setOpen={setOpen} />
                  <MobileMenuLink href="/blog" label="Blog" setOpen={setOpen} />
                </div>

                <div className="mt-auto p-4 border-t border-border bg-cm-slate-50">
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Button
                        render={<Link href="/#pricing" />}
                        className="w-full h-12 text-[0.95rem]"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    Get Sprint Pass
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Button
                        render={<Link href="/practice" />}
                        variant="outline"
                        className="w-full h-12 text-[0.95rem] bg-white mt-2.5"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    Start Free Practice
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </nav>
      </header>
    </>
  );
}

