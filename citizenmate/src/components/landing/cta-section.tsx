"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background gradient — Australian navy to deep blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-cm-navy via-cm-navy-light to-cm-navy-lighter -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)] -z-10" />
      {/* Subtle Southern Cross stars */}
      <div className="absolute top-[20%] right-[15%] w-1.5 h-1.5 bg-white/30 rounded-full animate-star -z-5" />
      <div className="absolute top-[30%] right-[22%] w-1 h-1 bg-white/20 rounded-full animate-star [animation-delay:0.7s] -z-5" />
      <div className="absolute top-[40%] right-[12%] w-2 h-2 bg-white/25 rounded-full animate-star [animation-delay:1.4s] -z-5" />
      <div className="absolute bottom-[25%] left-[10%] w-1 h-1 bg-white/15 rounded-full animate-star [animation-delay:2.1s] -z-5" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to become an Australian citizen, mate?
          </h2>
          <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
            Start your free practice test now — no signup needed. See where you
            stand in 10 minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-cm-red hover:bg-cm-red-dark text-white font-heading font-semibold text-base px-8 h-13 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cm-red/30">
              Start Free Practice
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/50">
            No credit card required. Free tier available forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
