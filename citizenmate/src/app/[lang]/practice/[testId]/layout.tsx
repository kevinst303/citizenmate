"use client";

import { QuizProvider } from "@/lib/quiz-context";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuizProvider>{children}</QuizProvider>;
}
