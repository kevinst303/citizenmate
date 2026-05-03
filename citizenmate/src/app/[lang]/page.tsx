import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";

// Below-the-fold sections: lazy-loaded to reduce initial bundle size
const InteractiveDemo = dynamic(
  () => import("@/components/landing/interactive-demo").then((mod) => ({ default: mod.InteractiveDemo })),
  { ssr: true }
);
const StatsHero = dynamic(
  () => import("@/components/landing/stats-hero").then((mod) => ({ default: mod.StatsHero })),
  { ssr: true }
);
const SocialProof = dynamic(
  () => import("@/components/landing/social-proof").then((mod) => ({ default: mod.SocialProof })),
  { ssr: true }
);
const PricingPreview = dynamic(
  () => import("@/components/landing/pricing-preview").then((mod) => ({ default: mod.PricingPreview })),
  { ssr: true }
);
const FAQ = dynamic(
  () => import("@/components/landing/faq").then((mod) => ({ default: mod.FAQ })),
  { ssr: true }
);
const CTASection = dynamic(
  () => import("@/components/landing/cta-section").then((mod) => ({ default: mod.CTASection })),
  { ssr: true }
);
const InlineCTA = dynamic(
  () => import("@/components/landing/inline-cta").then((mod) => ({ default: mod.InlineCTA })),
  { ssr: true }
);

export default function Home() {
  return (
    <>
      <Hero />

      <Features />
      <HowItWorks />
      <InteractiveDemo />
      <StatsHero />
      <SocialProof />
      <InlineCTA />
      <CTASection />
      <PricingPreview />
      <FAQ />
    </>
  );
}
