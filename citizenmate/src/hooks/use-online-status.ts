"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Tracks navigator.onLine status via `online` / `offline` events.
 * Returns the current boolean state (true = online) plus a `wasOffline`
 * flag that stays true until explicitly cleared — useful for detecting
 * transitions *back* to online after a disconnect.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    // Set initial value (safe guard for SSR)
    setIsOnline(navigator.onLine);

    const goOnline = () => {
      setIsOnline(true);
      wasOfflineRef.current = true; // mark so callers can react
    };
    const goOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const clearWasOffline = useCallback(() => {
    wasOfflineRef.current = false;
  }, []);

  return { isOnline, wasOffline: wasOfflineRef, clearWasOffline };
}
