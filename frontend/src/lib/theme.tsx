"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "sepia" | "system";
export type ResolvedTheme = "light" | "dark" | "sepia";

interface ThemeCtx {
  theme: Theme;
  resolved: ResolvedTheme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = "quran:theme";

function getSystem(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolve(t: Theme): ResolvedTheme {
  return t === "system" ? getSystem() : t;
}

function apply(t: ResolvedTheme) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t === "dark" ? "dark" : "light";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    let saved: Theme = "light";
    try {
      const v = localStorage.getItem(KEY) as Theme | null;
      if (v === "light" || v === "dark" || v === "sepia" || v === "system") saved = v;
    } catch {}
    setThemeState(saved);
    const r = resolve(saved);
    setResolved(r);
    apply(r);
  }, []);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const r = getSystem();
      setResolved(r);
      apply(r);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    const r = resolve(t);
    setResolved(r);
    apply(r);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  };

  const order: Theme[] = ["light", "sepia", "dark", "system"];
  const toggle = () =>
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);

  return (
    <Ctx.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be inside ThemeProvider");
  return c;
}
