"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBookmarks } from "@/lib/bookmarks";
import { useToast } from "@/lib/toast";

type Tab = "bookmark" | "pins" | "last";

export function BookmarksClient() {
  const { bookmarks, remove } = useBookmarks();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("bookmark");
  const [q, setQ] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return bookmarks;
    return bookmarks.filter(
      (b) =>
        b.surahName.toLowerCase().includes(s) ||
        b.english.toLowerCase().includes(s) ||
        `${b.surah}:${b.ayah}`.includes(s)
    );
  }, [bookmarks, q]);

  return (
    <div className="grid grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[200px_1fr_300px] lg:gap-10 lg:px-10">
      {/* Left tabs */}
      <aside className="space-y-1">
        <TabRow
          active={tab === "bookmark"}
          onClick={() => {
            setTab("bookmark");
            setFolderOpen(false);
          }}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M9 8h6" />
            </svg>
          }
          label="Bookmark"
        />
        <TabRow
          active={tab === "pins"}
          onClick={() => setTab("pins")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M12 2v6M12 14v8M8 8h8l-2 6H10z" />
            </svg>
          }
          label="Pins"
        />
        <TabRow
          active={tab === "last"}
          onClick={() => setTab("last")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
          label="Last Reads"
        />
      </aside>

      {/* Center content */}
      <section className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-base font-semibold text-text">
            {folderOpen ? "Favorites" : tab === "bookmark" ? "Bookmarks" : tab === "pins" ? "Pins" : "Last Reads"}
          </h1>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated" aria-label="Filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
            </button>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-56 rounded-full border border-border bg-bg-soft py-2 pl-9 pr-3 text-sm placeholder:text-text-dim focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {tab === "bookmark" && !folderOpen && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {/* Create new folder */}
            <button className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-bg-soft transition-all hover:border-accent hover:bg-accent-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-elevated text-text-muted transition-colors group-hover:bg-accent group-hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="text-sm text-text-muted">Create New Folder</span>
            </button>

            {/* Favorites folder */}
            <button
              onClick={() => setFolderOpen(true)}
              className="group flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg-soft transition-all hover:border-accent hover:shadow-md"
            >
              <span className="flex items-center justify-center text-accent">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 drop-shadow-sm">
                  <path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                </svg>
              </span>
              <span className="text-sm font-medium text-text">Favorites</span>
              <span className="text-xs text-text-muted">Total Ayah: {bookmarks.length}</span>
            </button>
          </div>
        )}

        {tab === "bookmark" && folderOpen && (
          <>
            <button
              onClick={() => setFolderOpen(false)}
              className="mb-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to folders
            </button>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg-soft py-16 text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 opacity-40">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
                <p className="text-sm">No bookmarks yet.</p>
                <p className="text-xs">Tap the bookmark icon on any ayah to save it.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border-soft overflow-hidden rounded-xl border border-border bg-bg-soft">
                {filtered.map((b) => (
                  <li key={`${b.surah}:${b.ayah}`} className="group flex items-start gap-3 px-4 py-4 hover:bg-bg-elevated/50">
                    <Link href={`/${b.surah}#ayah-${b.ayah}`} className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-accent">{b.surahName}</span>
                        <span className="text-text-dim">{b.surah}:{b.ayah}</span>
                      </div>
                      <p className="arabic font-uthmani text-right text-xl leading-loose text-text">{b.arabic}</p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{b.english}</p>
                    </Link>
                    <button
                      onClick={() => {
                        remove(b.surah, b.ayah);
                        toast("Bookmark removed", "info");
                      }}
                      aria-label="Remove"
                      className="mt-1 flex h-9 w-9 items-center justify-center rounded text-text-muted opacity-0 transition-opacity hover:bg-bg hover:text-red-500 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab !== "bookmark" && (
          <div className="flex items-center justify-center rounded-xl border border-border bg-bg-soft py-20 text-sm text-text-muted">
            Coming soon.
          </div>
        )}
      </section>

      {/* Right promo */}
      <aside className="hidden lg:block">
        <div className="text-center">
          <h3 className="mb-3 text-base font-semibold">Quran Mazid</h3>
          <div className="mx-auto h-64 w-36 overflow-hidden rounded-3xl border-[6px] border-text/10 bg-gradient-to-b from-accent/90 to-accent-strong p-2 shadow-md">
            <div className="flex h-full w-full flex-col items-center gap-1.5 rounded-2xl bg-bg-soft px-2 py-3 text-[8px] text-text-muted">
              <div className="font-bold text-text">QURAN MAZID</div>
              <div className="grid w-full grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-bg-elevated" />
                ))}
              </div>
              <div className="mt-1 grid w-full grid-cols-4 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-bg-elevated" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-bg-soft p-4">
          <h4 className="mb-2.5 text-center text-sm font-semibold">Important Features</h4>
          <ul className="grid grid-cols-2 gap-y-1.5 text-xs text-text-muted">
            <li>• Bookmark</li>
            <li>• Jump To Ayah</li>
            <li>• Theme</li>
            <li>• Advanced Search</li>
          </ul>
        </div>

        <div className="mt-5">
          <h4 className="mb-2.5 text-center text-sm font-semibold">Download Mobile App</h4>
          <div className="grid grid-cols-2 gap-2">
            <a className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft px-2.5 py-2 text-left transition-colors hover:border-accent" href="#">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-accent">
                <path d="M3 3l18 9-18 9z" />
              </svg>
              <div className="leading-tight">
                <div className="text-[8px] text-text-dim">Download on</div>
                <div className="text-[10px] font-semibold text-text">Play Store</div>
              </div>
            </a>
            <a className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft px-2.5 py-2 text-left transition-colors hover:border-accent" href="#">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M16 1a4 4 0 00-4 4 4 4 0 00-4-4 5 5 0 00-5 5c0 5 5 8 9 13 4-5 9-8 9-13a5 5 0 00-5-5z" opacity="0" />
                <path d="M17.5 12.5c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.9zM15 4.5c.7-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.4-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.6 2.9-1.3z" />
              </svg>
              <div className="leading-tight">
                <div className="text-[8px] text-text-dim">Download on</div>
                <div className="text-[10px] font-semibold text-text">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TabRow({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
        active ? "bg-accent-soft text-accent" : "text-text hover:bg-bg-elevated"
      }`}
    >
      <span className={active ? "text-accent" : "text-text-muted"}>{icon}</span>
      {label}
    </button>
  );
}
