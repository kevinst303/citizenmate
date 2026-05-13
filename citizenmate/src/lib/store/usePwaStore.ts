import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "../storage/idb-storage";

const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface PwaState {
  isInstallable: boolean;
  isInstalled: boolean;
  dismissedAt: number | null;
  isOffline: boolean;
  installPromptEvent: Event | null;
  setInstallable: (isInstallable: boolean, event?: Event | null) => void;
  setInstalled: (isInstalled: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  dismissModal: () => void;
  shouldShowModal: () => boolean;
  clearPrompt: () => void;
  resetDismissal: () => void;
}

export const usePwaStore = create<PwaState>()(
  persist(
    (set, get) => ({
      isInstallable: false,
      isInstalled: false,
      dismissedAt: null,
      isOffline: false,
      installPromptEvent: null,

      setInstallable: (isInstallable, event = null) =>
        set({ isInstallable, installPromptEvent: event }),

      setInstalled: (isInstalled) =>
        set({
          isInstalled,
          isInstallable: false,
          installPromptEvent: null,
          dismissedAt: null,
        }),

      setOffline: (isOffline) => set({ isOffline }),

      dismissModal: () => set({ dismissedAt: Date.now() }),

      shouldShowModal: () => {
        const { dismissedAt } = get();
        if (dismissedAt === null) return true;
        return Date.now() - dismissedAt >= DISMISS_DURATION_MS;
      },

      clearPrompt: () => set({ installPromptEvent: null, isInstallable: false }),

      resetDismissal: () => set({ dismissedAt: null }),
    }),
    {
      name: "citizenmate-pwa-storage",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        dismissedAt: state.dismissedAt,
      }),
    }
  )
);
