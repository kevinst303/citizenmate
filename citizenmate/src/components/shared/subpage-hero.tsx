import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface SubpageHeroProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  description?: string;
  badge?: string;
  bgImage?: string; // Optional background image
  curveColorClass?: string; // Optional class to match the background color below the curve
}

export function SubpageHero({ title, breadcrumbs, description, badge, bgImage = '/images/conseil/subpage-hero-bg.webp', curveColorClass = 'text-white' }: SubpageHeroProps) {
  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] flex flex-col justify-center bg-cm-teal overflow-hidden">
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={bgImage}
              alt="Subpage background"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          {/* Teal Gradient Overlay - Conseil style */}
          <div className="absolute inset-0 bg-gradient-to-b from-cm-teal/95 to-cm-teal/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-cm-teal via-transparent to-transparent opacity-90" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-12 pb-24">
        
        {/* Badge (Optional) */}
        {badge && (
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {badge}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight mb-6">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="max-w-2xl text-lg md:text-xl text-teal-50/90 mb-8">
            {description}
          </p>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center justify-center space-x-2 text-sm font-medium text-teal-100/70">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                {crumb.href && !isLast ? (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white" : ""}>
                    {crumb.label}
                  </span>
                )}
                
                {!isLast && (
                  <ChevronRight className="w-4 h-4 text-teal-100/40" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Bottom Arched Curve (Conseil Signature) */}
      <div className="absolute bottom-0 left-0 w-full z-20 translate-y-[2px]">
        <svg
          viewBox="0 0 1920 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-auto ${curveColorClass}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: 'auto', minHeight: '60px', maxHeight: '150px' }}
        >
          {/* An elegant arch/wave that matches the original Conseil styling */}
          <path
            d="M0 150H1920V0C1920 0 1500 150 960 150C420 150 0 0 0 0V150Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
