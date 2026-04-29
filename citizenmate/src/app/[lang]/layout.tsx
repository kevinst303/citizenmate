import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { LayoutShell } from "@/components/shared/layout-shell";
import { StudyProvider } from "@/lib/study-context";
import { TestDateProvider } from "@/lib/test-date-context";
import { AuthProvider } from "@/lib/auth-context";
import { SRSProvider } from "@/lib/srs-context";
import { ReferralTracker } from "@/components/shared/referral-tracker";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { locales } from "@/i18n/config";
import "../globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CitizenMate",
  "url": "https://citizenmate.com.au",
  "description": "Your mate for the citizenship test. Free practice tests, bilingual study, AI-powered learning."
};

const poppinsHeading = Poppins({
  variable: "--font-heading-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const interBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CitizenMate — Pass Your Australian Citizenship Test | Free Practice",
    template: "%s | CitizenMate",
  },
  description:
    "Free practice tests for the Australian citizenship test. Study in your language with AI-powered learning. 500+ questions from Our Common Bond. Know when you're ready, mate.",
  keywords: [
    "Australian citizenship test",
    "citizenship test practice",
    "Australian citizenship test questions",
    "citizenship test 2026",
    "Our Common Bond",
    "Australian citizenship practice test free",
    "citizenship test preparation",
  ],
  authors: [{ name: "CitizenMate" }],
  creator: "CitizenMate",
  metadataBase: new URL("https://citizenmate.com.au"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://citizenmate.com.au",
    siteName: "CitizenMate",
    title: "CitizenMate — Pass Your Australian Citizenship Test",
    description:
      "Your mate for the citizenship test. Free practice tests, bilingual study mode, and AI-powered learning.",
    images: [
      {
        url: "/generated/og-image.webp",
        width: 1200,
        height: 630,
        alt: "CitizenMate — Your mate for the citizenship test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CitizenMate — Pass Your Australian Citizenship Test",
    description:
      "Your mate for the citizenship test. Free practice tests, bilingual study, AI-powered learning.",
    images: ["/generated/og-image.webp"],
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CitizenMate",
  },
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${poppinsHeading.variable} ${interBody.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#006d77" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <TestDateProvider>
            <StudyProvider>
              <SRSProvider>
                <LayoutShell>{children}</LayoutShell>
                <Suspense fallback={null}>
                  <ReferralTracker />
                </Suspense>
                <Analytics />
              </SRSProvider>
            </StudyProvider>
          </TestDateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
