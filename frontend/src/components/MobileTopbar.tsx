"use client";

import Link from "next/link";
import { useUI } from "@/lib/ui";
import { useBookmarks } from "@/lib/bookmarks";

export function MobileTopbar() {
  const { setSurahDrawerOpen, setSearchOpen, setSettingsOpen, setBookmarksOpen } = useUI();
  const { bookmarks } = useBookmarks();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-bg-soft px-3 py-2 md:hidden">
      <button
        onClick={() => setSurahDrawerOpen(true)}
        aria-label="Open surah list"
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-bg-elevated"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
          </svg>
        </span>
        <span className="text-sm font-semibold">Quran Mazid</span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-bg-elevated"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
        <button
          onClick={() => setBookmarksOpen(true)}
          aria-label="Bookmarks"
          className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-bg-elevated"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
          </svg>
          {bookmarks.length > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg">
              {bookmarks.length > 99 ? "99+" : bookmarks.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-bg-elevated"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
