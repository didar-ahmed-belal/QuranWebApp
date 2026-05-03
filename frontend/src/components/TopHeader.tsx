"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/lib/ui";
import { useTheme, type Theme } from "@/lib/theme";

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  {
    value: "sepia",
    label: "Sepia",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 3a9 9 0 100 18 4.5 4.5 0 010-9 4.5 4.5 0 010-9z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

export function TopHeader() {
  const { setSearchOpen, setSurahDrawerOpen } = useUI();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-soft">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => setSurahDrawerOpen(true)}
          aria-label="Open surah list"
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-accent-strong">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
              <path d="M4 19.5A2.5 2.5 0 016.5 22H20" />
              <path d="M9 7h7M9 11h7" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-[17px] font-bold text-text">Quran Mazid</div>
            <div className="hidden text-[11px] text-text-muted sm:block">
              Read, Study, and Learn The Quran
            </div>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>

          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Theme"
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text"
            >
              {THEMES.find((t) => t.value === theme)?.icon}
            </button>
            {open && (
              <div className="absolute right-0 top-12 w-40 overflow-hidden rounded-lg border border-border bg-bg-soft shadow-lg">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                      theme === t.value
                        ? "bg-accent-soft text-accent"
                        : "text-text hover:bg-bg-elevated"
                    }`}
                  >
                    <span className="text-text-muted">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://quranmazid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-strong"
          >
            <span className="hidden sm:inline">Support Us</span>
            <span aria-hidden>🤝</span>
          </a>
        </div>
      </div>
    </header>
  );
}
