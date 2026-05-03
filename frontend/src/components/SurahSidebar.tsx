"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SURAH_LIST } from "@/lib/surahList";
import { useUI } from "@/lib/ui";

export function SurahSidebarContent({ onPick }: { onPick?: () => void }) {
  const params = useParams<{ surah?: string }>();
  const active = Number(params?.surah) || 1;
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SURAH_LIST;
    return SURAH_LIST.filter(
      (x) =>
        x.englishName.toLowerCase().includes(s) ||
        x.englishNameTranslation.toLowerCase().includes(s) ||
        String(x.number) === s
    );
  }, [q]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Surah
        </h2>
        <div className="mt-2 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search surah..."
            className="w-full rounded-md border border-border bg-bg pl-8 pr-3 py-1.5 text-sm placeholder:text-text-dim focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto py-1">
        {filtered.map((s) => {
          const isActive = s.number === active;
          return (
            <li key={s.number}>
              <Link
                href={`/${s.number}`}
                onClick={onPick}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 transition-colors border-l-2",
                  isActive
                    ? "bg-accent/10 border-accent text-text"
                    : "border-transparent hover:bg-bg-elevated text-text-muted hover:text-text",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-medium",
                    isActive
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-muted",
                  ].join(" ")}
                >
                  {s.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {s.englishName}
                    </span>
                    <span className="arabic font-amiri text-base shrink-0">
                      {s.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-text-dim">
                    <span className="truncate">{s.englishNameTranslation}</span>
                    <span>{s.numberOfAyahs} ayahs</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SurahSidebar() {
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-80 shrink-0 flex-col border-r border-border bg-bg-soft">
      <SurahSidebarContent />
    </aside>
  );
}

export function MobileSurahDrawer() {
  const { surahDrawerOpen, setSurahDrawerOpen } = useUI();
  if (!surahDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setSurahDrawerOpen(false)}
      />
      <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-bg-soft shadow-xl">
        <SurahSidebarContent onPick={() => setSurahDrawerOpen(false)} />
      </div>
    </div>
  );
}
