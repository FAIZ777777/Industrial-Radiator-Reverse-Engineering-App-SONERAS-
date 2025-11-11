import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  engineerName: string;
  companyName: string;
  decimalPrecision: number;
  defaultGravity: number;
  theme: 'light' | 'dark';
}

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  engineerName: '',
  companyName: 'Soneras',
  decimalPrecision: 4,
  defaultGravity: 9.81,
  theme: 'light',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'soneras-settings',
    }
  )
);
