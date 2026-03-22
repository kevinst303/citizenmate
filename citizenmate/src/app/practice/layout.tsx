import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Tests",
  description:
    "Take a full-length mock Australian citizenship test. 20 questions, 45 minutes, just like the real thing. Track your progress and know when you're ready.",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
