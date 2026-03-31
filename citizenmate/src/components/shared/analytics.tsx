"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/components/shared/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Check on mount
    setConsented(hasAnalyticsConsent());

    // Listen for consent changes
    const handler = () => setConsented(hasAnalyticsConsent());
    window.addEventListener("cm-consent-update", handler);
    return () => window.removeEventListener("cm-consent-update", handler);
  }, []);

  // Don't render anything if GA ID is missing or consent not given
  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
