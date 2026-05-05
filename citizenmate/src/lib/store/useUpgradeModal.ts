import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  triggerSource: string | null;
  openModal: (source?: string) => void;
  closeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set, get) => ({
  isOpen: false,
  triggerSource: null,
  openModal: (source?: string) => {
    const trigger = source ?? null;
    set({ isOpen: true, triggerSource: trigger });
    if (typeof window !== 'undefined' && trigger) {
      import('posthog-js').then((m) => {
        m.default.capture('upgrade_modal_opened', { trigger_source: trigger });
      });
    }
  },
  closeModal: () => set({ isOpen: false, triggerSource: null }),
}));
