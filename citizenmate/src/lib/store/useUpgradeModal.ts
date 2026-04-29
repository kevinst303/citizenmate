import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  triggerSource: string | null;
  openUpgradeModal: (source?: string) => void;
  closeUpgradeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set) => ({
  isOpen: false,
  triggerSource: null,
  openUpgradeModal: (source?: string) => set({ isOpen: true, triggerSource: source ?? null }),
  closeUpgradeModal: () => set({ isOpen: false, triggerSource: null }),
}));
