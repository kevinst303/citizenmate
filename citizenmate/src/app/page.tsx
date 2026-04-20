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
      {/* Inverted Arch divider — Conseil Pixfort style transition */}
      <div className="relative bg-white -mt-1 z-10">
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block drop-shadow-sm"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
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
