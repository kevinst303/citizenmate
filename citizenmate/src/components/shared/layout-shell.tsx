"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/landing/footer";
import { TestDateBanner } from "@/components/shared/test-date-banner";
import { TestDateModal } from "@/components/shared/test-date-modal";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { ChatWidget } from "@/components/shared/chat-widget";
import { AuthModal } from "@/components/shared/auth-modal";
import { GooeyToaster } from "@/components/ui/goey-toaster";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { Analytics } from "@/components/shared/analytics";
import { Suspense } from "react";

/**
 * Conditionally shows/hides the Navbar and Footer based on the current route.
 * Quiz pages (/practice/[testId]) use their own focused header and should not
 * show the standard Navbar and Footer.
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar/footer when user is actively taking a quiz or in the admin dashboard
  // Match: /practice/mock-test-1, /practice/mock-test-2, etc.
  // Don't match: /practice (dashboard) or /practice/mock-test-1/results (results page)
  const isActiveQuiz =
    /^\/practice\/[^/]+$/.test(pathname) &&
    !pathname.endsWith("/results");

  const isAdminRoute = pathname.startsWith("/admin") || /^\/[a-zA-Z-]+\/admin/.test(pathname);
  const hideShellUI = isActiveQuiz || isAdminRoute;

  // Show test-date banner on study, practice dashboard, and dashboard pages (not landing or active quiz)
  const showBanner =
    !isActiveQuiz &&
    pathname !== "/" &&
    !pathname.startsWith("/practice/");

  // Show chat widget on app pages (not landing, not active quiz)
  const showChat = !isActiveQuiz && pathname !== "/";

  return (
    <>
      {/* Skip-to-content for keyboard / screen-reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-cm-navy focus:text-white focus:rounded-lg focus:font-heading focus:font-semibold focus:text-sm focus:shadow-lg"
      >
        Skip to main content
      </a>
      {!hideShellUI && <Navbar />}
      {/* Spacer for fixed navbar height (landing page hero handles its own spacing) — NAV-03: verified pt-[66px] */}
      {!hideShellUI && pathname !== "/" && <div className="pt-[66px]" />}
      {showBanner && <TestDateBanner />}
      <main id="main-content" className="flex-1">{children}</main>
      {!hideShellUI && <Footer />}
      <TestDateModal />
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
      <GooeyToaster />
      {!hideShellUI && <InstallPrompt />}
      {showChat && <ChatWidget />}
      <CookieConsent />
      <Analytics />
    </>
  );
}


