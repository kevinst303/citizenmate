import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  triggerSource: string | null;
  openModal: (source?: string) => void;
  closeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set) => ({
  isOpen: false,
  triggerSource: null,
  openModal: (source = null) => set({ isOpen: true, triggerSource: source }),
  closeModal: () => set({ isOpen: false, triggerSource: null }),
}));
