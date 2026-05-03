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

export interface Settings {
  arabicFont: ArabicFont;
  arabicFontSize: number; // px
  translationFontSize: number; // px
}

const DEFAULTS: Settings = {
  arabicFont: "uthmani",
  arabicFontSize: 32,
  translationFontSize: 16,
};

const STORAGE_KEY = "quran:settings";

interface SettingsContextValue extends Settings {
  setArabicFont: (f: ArabicFont) => void;
  setArabicFontSize: (n: number) => void;
  setTranslationFontSize: (n: number) => void;
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
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings, hydrated]);

  const setArabicFont = useCallback(
    (f: ArabicFont) => setSettings((s) => ({ ...s, arabicFont: f })),
    []
  );
  const setArabicFontSize = useCallback(
    (n: number) => setSettings((s) => ({ ...s, arabicFontSize: n })),
    []
  );
  const setTranslationFontSize = useCallback(
    (n: number) => setSettings((s) => ({ ...s, translationFontSize: n })),
    []
  );
  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setArabicFont,
      setArabicFontSize,
      setTranslationFontSize,
      reset,
    }),
    [settings, setArabicFont, setArabicFontSize, setTranslationFontSize, reset]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
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
