import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Practice",
  description:
    "AI-powered spaced repetition practice for the Australian citizenship test. Questions are ordered by your weak areas for maximum learning efficiency.",
};

export default function SmartPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
