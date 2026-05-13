"use client";

import { useEffect, type ReactNode } from "react";
import { usePwaStore } from "@/lib/store/usePwaStore";

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const setInstallable = usePwaStore((s) => s.setInstallable);
  const setInstalled = usePwaStore((s) => s.setInstalled);
  const setOffline = usePwaStore((s) => s.setOffline);

  useEffect(() => {
    // Intercept the browser's beforeinstallprompt event
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallable(true, event);
    };

    // Track when the PWA is successfully installed
    const handleAppInstalled = () => {
      setInstalled(true);
    };

    // Track online/offline connectivity status
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    // Set initial connectivity state
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);

    // Check if already installed (matches standalone display mode)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setInstallable, setInstalled, setOffline]);

  return <>{children}</>;
}
