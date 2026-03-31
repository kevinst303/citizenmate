import { gooeyToast } from "goey-toast";
import type { GooeyToastOptions } from "goey-toast";
import type { ReactNode } from "react";

/**
 * CitizenMate-branded toast helpers.
 *
 * Usage:
 *   import { toast } from "@/lib/toast"
 *   toast.success("Test date saved!", "We'll build your study plan around it.")
 *   toast.error("Oops!", "Something went wrong. Try again, mate.")
 *   toast.info("Heads up", "Your daily chat limit resets tomorrow.")
 *   toast.achievement("New milestone!", "You passed your first mock test! 🎉")
 */

// ─── Brand colors ────────────────────────────────────────────
const BRAND = {
  navy: "#0C2340",
  navyLight: "#1A3A5C",
  red: "#DC2626",
  gold: "#D97706",
  eucalyptus: "#059669",
  sky: "#0284C7",
  white: "#FFFFFF",
} as const;

// ─── Helpers ─────────────────────────────────────────────────

function withDescription(
  title: string,
  description?: string | ReactNode,
  opts?: Partial<GooeyToastOptions>
): GooeyToastOptions {
  return {
    ...(description ? { description } : {}),
    ...opts,
  };
}

// ─── Exported toast API ──────────────────────────────────────

export const toast = {
  /** Generic/neutral toast */
  default(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast(title, {
      fillColor: BRAND.navy,
      borderColor: BRAND.navyLight,
      borderWidth: 1.5,
      ...withDescription(title, description, opts),
    });
  },

  /** Success — green eucalyptus */
  success(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast.success(title, withDescription(title, description, opts));
  },

  /** Error — red */
  error(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast.error(title, withDescription(title, description, opts));
  },

  /** Warning — gold */
  warning(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast.warning(title, withDescription(title, description, opts));
  },

  /** Info — sky blue */
  info(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast.info(title, withDescription(title, description, opts));
  },

  /** Achievement — special success with gold border for milestones */
  achievement(title: string, description?: string | ReactNode, opts?: Partial<GooeyToastOptions>) {
    return gooeyToast.success(title, {
      fillColor: BRAND.gold,
      borderColor: BRAND.gold,
      borderWidth: 2,
      preset: "bouncy",
      ...withDescription(title, description, opts),
    });
  },

  /** Promise — loading → success/error morphing toast */
  promise<T>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string;
      error: string;
      successDescription?: string;
      errorDescription?: string;
    }
  ) {
    return gooeyToast.promise(promise, {
      loading: data.loading,
      success: data.success,
      error: data.error,
      description: {
        success: data.successDescription ?? undefined,
        error: data.errorDescription ?? undefined,
      },
    });
  },

  /** Dismiss all or by type */
  dismiss: gooeyToast.dismiss,

  /** Update an existing toast */
  update: gooeyToast.update,
};
