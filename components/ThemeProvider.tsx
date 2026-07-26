import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'midnight' | 'slate' | 'warm' | 'light';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'teal';

interface ThemeMetadata {
  id: ThemePreset;
  label: string;
  description: string;
  preview: string;
}

interface AccentMetadata {
  id: AccentColor;
  label: string;
  hex: string;
}

interface ThemeContextValue {
  preset: ThemePreset;
  accent: AccentColor;
  setPreset: (preset: ThemePreset) => void;
  setAccent: (accent: AccentColor) => void;
  presets: ThemeMetadata[];
  accents: AccentMetadata[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'unipro-theme';

const PRESETS: ThemeMetadata[] = [
  { id: 'midnight', label: 'Midnight', description: 'Deep dark', preview: 'bg-[#0b0c10]' },
  { id: 'slate', label: 'Slate', description: 'Soft gray-blue', preview: 'bg-[#0f172a]' },
  { id: 'warm', label: 'Warm', description: 'Sepia dark', preview: 'bg-[#1a1714]' },
  { id: 'light', label: 'Light', description: 'Clean white', preview: 'bg-[#f8fafc]' },
];

const ACCENTS: AccentMetadata[] = [
  { id: 'indigo', label: 'Indigo', hex: '#4f6df7' },
  { id: 'emerald', label: 'Emerald', hex: '#10b981' },
  { id: 'rose', label: 'Rose', hex: '#f43f5e' },
  { id: 'amber', label: 'Amber', hex: '#f59e0b' },
  { id: 'violet', label: 'Violet', hex: '#8b5cf6' },
  { id: 'teal', label: 'Teal', hex: '#14b8a6' },
];

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    if (typeof window === 'undefined') return 'midnight';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (PRESETS.some(p => p.id === parsed.preset)) return parsed.preset as ThemePreset;
      } catch {
        // fallthrough
      }
    }
    return 'midnight';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    if (typeof window === 'undefined') return 'indigo';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (ACCENTS.some(a => a.id === parsed.accent)) return parsed.accent as AccentColor;
      } catch {
        // fallthrough
      }
    }
    return 'indigo';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preset);
    document.documentElement.setAttribute('data-accent', accent);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ preset, accent }));
  }, [preset, accent]);

  const setPreset = (newPreset: ThemePreset) => setPresetState(newPreset);
  const setAccent = (newAccent: AccentColor) => setAccentState(newAccent);

  return (
    <ThemeContext.Provider value={{ preset, accent, setPreset, setAccent, presets: PRESETS, accents: ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
