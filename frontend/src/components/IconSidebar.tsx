"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/lib/ui";
import { useBookmarks } from "@/lib/bookmarks";
import type { ReactNode } from "react";

function Icon({
  children,
  label,
  onClick,
  href,
  badge,
  active,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  active?: boolean;
}) {
  const cls = `group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
    active
      ? "bg-accent-soft text-accent shadow-sm"
      : "text-text-muted hover:bg-bg-elevated hover:text-text hover:scale-105"
  }`;
  const tip = (
    <span className="pointer-events-none absolute left-full ml-3 z-50 hidden whitespace-nowrap rounded-md bg-text px-2.5 py-1 text-xs font-medium text-bg-soft shadow-md group-hover:block">
      {label}
    </span>
  );
  const badgeEl =
    badge && badge > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-bg-soft">
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

export function IconSidebar() {
  const { setSearchOpen } = useUI();
  const { bookmarks } = useBookmarks();
  const pathname = usePathname() || "/";
  const onBookmarks = pathname.startsWith("/bookmarks");
  const onRead = pathname === "/" || /^\/[0-9]+/.test(pathname);

  return (
    <aside className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] w-14 shrink-0 flex-col items-center gap-1.5 border-r border-border bg-bg-soft py-4">
      <Icon href="/" label="Home" active={onRead}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2V11z" />
        </svg>
      </Icon>

      <Icon label="Send Feedback" onClick={() => window.open("mailto:feedback@quranmazid.com", "_blank")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4z" />
        </svg>
      </Icon>

      <Icon href="/bookmarks" label="Bookmarks" badge={bookmarks.length} active={onBookmarks}>
        <svg viewBox="0 0 24 24" fill={onBookmarks ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
        </svg>
      </Icon>

      <div className="mt-auto">
        <Icon label="Search" onClick={() => setSearchOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </Icon>
      </div>
    </aside>
  );
}
