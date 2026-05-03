"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SURAH_LIST } from "@/lib/surahList";
import { useUI } from "@/lib/ui";

type Tab = "surah" | "juz" | "page";

// Map of juz -> first surah (approx for navigation)
const JUZ_TO_SURAH: Record<number, number> = {
  1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
  11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
  21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78,
};

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-bg-soft text-text shadow-sm" : "text-text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

export function SurahSidebarContent({ onPick }: { onPick?: () => void }) {
  const params = useParams<{ surah?: string }>();
  const active = Number(params?.surah) || 1;
  const [tab, setTab] = useState<Tab>("surah");
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
      <div className="px-4 pt-4">
        <div className="flex gap-1 rounded-full bg-bg-elevated p-1">
          <TabBtn active={tab === "surah"} onClick={() => setTab("surah")}>Surah</TabBtn>
          <TabBtn active={tab === "juz"} onClick={() => setTab("juz")}>Juz</TabBtn>
          <TabBtn active={tab === "page"} onClick={() => setTab("page")}>Page</TabBtn>
        </div>
        <div className="relative mt-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${tab === "surah" ? "Surah" : tab === "juz" ? "Juz" : "Page"}`}
            className="w-full rounded-full border border-border bg-bg-soft py-2 pl-9 pr-3 text-sm placeholder:text-text-dim focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <ul className="mt-2 flex-1 overflow-y-auto px-2 pb-4">
        {tab === "surah" &&
          filtered.map((s) => {
            const isActive = s.number === active;
            return (
              <li key={s.number}>
                <Link
                  href={`/${s.number}`}
                  onClick={onPick}
                  className={[
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 my-0.5 transition-colors",
                    isActive
                      ? "bg-gold-soft ring-1 ring-gold/40 text-text"
                      : "hover:bg-bg-elevated text-text",
                  ].join(" ")}
                >
                  {isActive ? (
                    <span className="diamond flex h-8 w-8 shrink-0 items-center justify-center bg-gold text-white text-xs font-semibold shadow-sm">
                      <span>{s.number}</span>
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-medium text-text-muted">
                      {s.number}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[15px] font-semibold leading-tight">
                      {s.englishName}
                    </div>
                    <div className="truncate text-xs text-text-muted">
                      {s.englishNameTranslation}
                    </div>
                  </div>
                  <span className="arabic font-amiri text-lg shrink-0 text-text-muted">
                    {s.name}
                  </span>
                </Link>
              </li>
            );
          })}

        {tab === "juz" &&
          Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
            <li key={j}>
              <Link
                href={`/${JUZ_TO_SURAH[j] || 1}`}
                onClick={onPick}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 my-0.5 hover:bg-bg-elevated"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-bg-elevated text-xs font-medium text-text-muted">
                  {j}
                </div>
                <div className="flex-1 text-sm">Juz {j}</div>
              </Link>
            </li>
          ))}

        {tab === "page" && (
          <li className="px-3 py-6 text-center text-sm text-text-muted">
            Page-by-page mushaf coming soon.
          </li>
        )}
      </ul>
    </div>
  );
}

export function SurahSidebar() {
  return (
    <aside className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] w-72 shrink-0 flex-col border-r border-border bg-bg">
      <SurahSidebarContent />
    </aside>
  );
}

export function MobileSurahDrawer() {
  const { surahDrawerOpen, setSurahDrawerOpen } = useUI();
  if (!surahDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setSurahDrawerOpen(false)} />
      <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-bg shadow-xl">
        <SurahSidebarContent onPick={() => setSurahDrawerOpen(false)} />
      </div>
    </div>
  );
}
