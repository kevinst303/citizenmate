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
    <div className="relative w-full min-h-[400px] md:min-h-[500px] flex flex-col justify-center bg-cm-teal overflow-hidden border-b border-teal-900/30">
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-12 pb-20">
        
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

      {/* Straight Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"></div>
    </div>
  );
}
