import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { StatsHero } from "@/components/landing/stats-hero";
import { SocialProof } from "@/components/landing/social-proof";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { InlineCTA } from "@/components/landing/inline-cta";

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
