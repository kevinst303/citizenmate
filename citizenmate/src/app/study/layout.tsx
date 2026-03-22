import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Guide",
  description:
    "Study the official Our Common Bond content topic by topic. Track your mastery and prepare for the Australian citizenship test with bilingual support.",
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
