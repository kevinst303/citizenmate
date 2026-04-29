import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline. Some features of CitizenMate may be unavailable.",
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
