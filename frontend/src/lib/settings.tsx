"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ArabicFont = "uthmani" | "amiri" | "scheherazade";
export type ViewMode = "translation" | "reading";

export interface Settings {
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
  viewMode: ViewMode;
}

const DEFAULTS: Settings = {
  arabicFont: "uthmani",
  arabicFontSize: 30,
  translationFontSize: 17,
  viewMode: "translation",
};

const STORAGE_KEY = "quran:settings";

interface SettingsContextValue extends Settings {
  setArabicFont: (f: ArabicFont) => void;
  setArabicFontSize: (n: number) => void;
  setTranslationFontSize: (n: number) => void;
  setViewMode: (m: ViewMode) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, hydrated]);

  const setArabicFont = useCallback((f: ArabicFont) => setSettings((s) => ({ ...s, arabicFont: f })), []);
  const setArabicFontSize = useCallback((n: number) => setSettings((s) => ({ ...s, arabicFontSize: n })), []);
  const setTranslationFontSize = useCallback((n: number) => setSettings((s) => ({ ...s, translationFontSize: n })), []);
  const setViewMode = useCallback((m: ViewMode) => setSettings((s) => ({ ...s, viewMode: m })), []);
  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setArabicFont,
      setArabicFontSize,
      setTranslationFontSize,
      setViewMode,
      reset,
    }),
    [settings, setArabicFont, setArabicFontSize, setTranslationFontSize, setViewMode, reset]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function arabicFontClass(f: ArabicFont): string {
  switch (f) {
    case "amiri":
      return "font-amiri";
    case "scheherazade":
      return "font-scheherazade";
    case "uthmani":
    default:
      return "font-uthmani";
  }
}
