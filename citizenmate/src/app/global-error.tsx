"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Next.js Global Error Boundary — Conseil-Branded Fallback UI
 *
 * Captures uncaught React rendering errors and reports them to Sentry
 * while displaying a premium, on-brand error page to users.
 *
 * Required by: Next.js error handling convention
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#F4F4F5] antialiased">
        <main className="w-full max-w-[520px] mx-auto px-6 py-16">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-cm-teal-50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-cm-teal"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>

          {/* Card */}
          <div className="card-conseil text-center">
            {/* Heading */}
            <h1
              className="mb-3 text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-family)", color: "#1a1a1a" }}
            >
              Something went wrong
            </h1>

            {/* Body */}
            <p className="mb-8 text-[15px] leading-relaxed text-cm-slate-500">
              We've been notified and are working on a fix.
              Please try again or return to the home page.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center h-11 px-6 rounded-[50px] text-[15px] font-medium text-white bg-cm-teal hover:bg-cm-teal-dark transition-colors duration-200"
              >
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center h-11 px-6 rounded-[50px] text-[15px] font-medium text-cm-slate-600 bg-white border border-cm-slate-100 hover:bg-cm-slate-50 transition-colors duration-200"
              >
                Return Home
              </a>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[13px] text-cm-slate-400">
            If this persists, please{" "}
            <a
              href="mailto:support@citizenmate.com.au"
              className="text-cm-teal hover:text-cm-teal-dark underline underline-offset-2 transition-colors"
            >
              contact support
            </a>
            .
          </p>
        </main>
      </body>
    </html>
  );
}
