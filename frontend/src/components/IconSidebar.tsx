"use client";

import Link from "next/link";
import { useUI } from "@/lib/ui";
import { useBookmarks } from "@/lib/bookmarks";

function Icon({ children, label, onClick, href, badge }: { children: ReactNode; label: string; onClick?: () => void; href?: string; badge?: number }) {
  const cls =
    "group relative flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text transition-colors";
  const tip = (
    <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded bg-bg-elevated px-2 py-1 text-xs text-text shadow-md group-hover:block">
      {label}
    </span>
  );
  const badgeEl = badge && badge > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg">
      {badge > 99 ? "99+" : badge}
    </span>
  ) : null;
  if (href)
    return (
      <Link href={href} className={cls} aria-label={label}>
        {children}
        {badgeEl}
        {tip}
      </Link>
    );
  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      {children}
      {badgeEl}
      {tip}
    </button>
  );
}

import type { ReactNode } from "react";

export function IconSidebar() {
  const { setSearchOpen, setSettingsOpen, setBookmarksOpen, setAudioOpen } = useUI();
  const { bookmarks } = useBookmarks();

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-16 shrink-0 flex-col items-center gap-1 border-r border-border bg-bg-soft py-3 z-30">
      {/* Logo */}
      <Link
        href="/"
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
        aria-label="Home"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.27l7 3.5v7.46l-7-3.5V9.27zm9 10.96v-7.46l7-3.5v7.46l-7 3.5z" />
        </svg>
      </Link>

      <Icon href="/" label="Read Quran">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M4 4h7a4 4 0 014 4v12a3 3 0 00-3-3H4V4z" />
          <path d="M20 4h-7a4 4 0 00-4 4v12a3 3 0 013-3h8V4z" />
        </svg>
      </Icon>

      <Icon label="Search" onClick={() => setSearchOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </Icon>

      <Icon label="Bookmarks" onClick={() => setBookmarksOpen(true)} badge={bookmarks.length}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
        </svg>
      </Icon>

      <Icon label="Audio" onClick={() => setAudioOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </Icon>

      <div className="mt-auto flex flex-col gap-1">
        <Icon label="Settings" onClick={() => setSettingsOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </Icon>
      </div>
    </aside>
  );
}
