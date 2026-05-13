import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "../storage/idb-storage";

interface PwaState {
  isInstallable: boolean;
  isInstalled: boolean;
  hasDismissedModal: boolean;
  isOffline: boolean;
  installPromptEvent: Event | null;
  setInstallable: (isInstallable: boolean, event?: Event | null) => void;
  setInstalled: (isInstalled: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  dismissModal: () => void;
  clearPrompt: () => void;
  resetDismissal: () => void;
}

export const usePwaStore = create<PwaState>()(
  persist(
    (set) => ({
      isInstallable: false,
      isInstalled: false,
      hasDismissedModal: false,
      isOffline: false,
      installPromptEvent: null,

      setInstallable: (isInstallable, event = null) =>
        set({ isInstallable, installPromptEvent: event }),

      setInstalled: (isInstalled) =>
        set({
          isInstalled,
          isInstallable: false,
          installPromptEvent: null,
          hasDismissedModal: false,
        }),

      setOffline: (isOffline) => set({ isOffline }),

      dismissModal: () => set({ hasDismissedModal: true }),

      clearPrompt: () => set({ installPromptEvent: null, isInstallable: false }),

      resetDismissal: () => set({ hasDismissedModal: false }),
    }),
    {
      name: "citizenmate-pwa-storage",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        hasDismissedModal: state.hasDismissedModal,
      }),
    }
  )
);
