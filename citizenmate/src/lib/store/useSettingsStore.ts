import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  reduceMotion: boolean;
  setReduceMotion: (reduceMotion: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reduceMotion: false,
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    {
      name: 'citizenmate-settings', // unique name for local storage
    }
  )
);
