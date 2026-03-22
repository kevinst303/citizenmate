"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/landing/footer";
import { TestDateBanner } from "@/components/shared/test-date-banner";
import { TestDateModal } from "@/components/shared/test-date-modal";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { ChatWidget } from "@/components/shared/chat-widget";
import { AuthModal } from "@/components/shared/auth-modal";

/**
 * Conditionally shows/hides the Navbar and Footer based on the current route.
 * Quiz pages (/practice/[testId]) use their own focused header and should not
 * show the standard Navbar and Footer.
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar/footer when user is actively taking a quiz
  // Match: /practice/mock-test-1, /practice/mock-test-2, etc.
  // Don't match: /practice (dashboard) or /practice/mock-test-1/results (results page)
  const isActiveQuiz =
    /^\/practice\/[^/]+$/.test(pathname) &&
    !pathname.endsWith("/results");

  // Show test-date banner on study, practice dashboard, and dashboard pages (not landing or active quiz)
  const showBanner =
    !isActiveQuiz &&
    pathname !== "/" &&
    !pathname.startsWith("/practice/");

  // Show chat widget on app pages (not landing, not active quiz)
  const showChat = !isActiveQuiz && pathname !== "/";

  return (
    <>
      {!isActiveQuiz && <Navbar />}
      {showBanner && <TestDateBanner />}
      <main className="flex-1">{children}</main>
      {!isActiveQuiz && <Footer />}
      <TestDateModal />
      <AuthModal />
      {!isActiveQuiz && <InstallPrompt />}
      {showChat && <ChatWidget />}
    </>
  );
}


