"use client";

import { MotionConfig } from "framer-motion";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { useEffect, useState } from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children without MotionConfig on server/initial render to prevent hydration mismatch
    // Alternatively, we could default to user preference, but `always` vs `user` 
    // requires knowing the client's local storage state.
    return <>{children}</>;
  }

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
