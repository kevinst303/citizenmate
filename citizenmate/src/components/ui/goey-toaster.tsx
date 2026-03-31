"use client";

import { GooeyToaster as BaseGooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

/**
 * CitizenMate GooeyToaster — renders the gooey toast container.
 * Place this once in the root layout (via LayoutShell).
 *
 * Uses dark theme with bouncy preset for that premium feel.
 * Position: bottom-right to avoid conflicting with the chat FAB.
 */
export function GooeyToaster() {
  return (
    <BaseGooeyToaster
      position="top-center"
      preset="bouncy"
      theme="light"
      bounce={0.5}
      offset="80px"
      showProgress
      closeOnEscape
      swipeToDismiss
    />
  );
}
