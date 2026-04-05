import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { StatsHero } from "@/components/landing/stats-hero";
import { SocialProof } from "@/components/landing/social-proof";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Wave divider — visual continuity from dark hero to white Features (HIOW-02) */}
      <div className="relative bg-white">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
      <Features />
      <HowItWorks />
      <InteractiveDemo />
      <StatsHero />
      <SocialProof />
      <PricingPreview />
      <FAQ />
      <CTASection />
    </>
  );
}
