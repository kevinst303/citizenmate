"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useT();
  const { getUrl } = useLocalizedPath();

  return (
    <section className="py-[100px] relative overflow-hidden">
      <Image
        src="/images/conseil/cta-bg.webp"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Heading */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight text-balance"
            >
              {t("landing.cta_title", "Ready to become an Australian citizen, mate?")}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-6 text-lg text-white/80 max-w-xl mx-auto leading-relaxed"
          >
            {t("landing.cta_desc", "Start your free practice test now — no signup needed. See where you stand in 10 minutes.")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-10 flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                render={<a href={getUrl("/practice")} />}
                size="lg"
                className="bg-white text-cm-teal font-heading font-bold border-none shadow-lg shadow-black/10 hover:bg-white/95"
              >
                {t("landing.cta_button", "Start Free Practice")}
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-6 text-sm text-white/50"
          >
            {t("landing.cta_fineprint", "No credit card required. Free tier available forever.")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
