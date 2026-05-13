"use client";

import { useEffect, useRef } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { toast } from "@/lib/toast";
import { useT } from "@/i18n/i18n-context";

/**
 * Monitors network connectivity and shows toast notifications:
 * - When the user goes **offline** → info toast (data saved locally)
 * - When the user comes **back online** → success toast (data synced)
 *
 * Mount this once in the root layout (inside LayoutShell).
 */
export function OnlineStatusIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { t } = useT();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      // Going offline — show exactly one toast (don't stack on rapid flips)
      notifiedRef.current = true;
      toast.info(t("connectivity.offline"), t("connectivity.offline_desc"), {
        duration: 5000,
      });
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOnline && wasOffline.current) {
      // Coming back online after having been offline
      wasOffline.current = false;
      notifiedRef.current = false;

      toast.success(t("connectivity.online"), t("connectivity.online_desc"), {
        duration: 5000,
      });
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  // This component renders nothing — it's a pure behavior hook
  return null;
}
