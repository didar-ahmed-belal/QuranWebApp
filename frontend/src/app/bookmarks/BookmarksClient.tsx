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
    <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr_320px]">
      {/* Left tabs */}
      <aside className="space-y-1">
        <TabRow
          active={tab === "bookmark"}
          onClick={() => setTab("bookmark")}
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <rect x="6" y="5" width="12" height="14" rx="1" fill="var(--bg-soft)" />
            </svg>
          }
          label="Bookmark"
        />
        <TabRow
          active={tab === "pins"}
          onClick={() => setTab("pins")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 2v6M12 14v8M8 8h8l-2 6H10z" />
            </svg>
          }
          label="Pins"
        />
        <TabRow
          active={tab === "last"}
          onClick={() => setTab("last")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
          label="Last Reads"
        />
      </aside>

      {/* Center content */}
      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">
            {tab === "bookmark" ? "Bookmarks" : tab === "pins" ? "Pins" : "Last Reads"}
          </h1>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
            </button>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim">
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

        {tab === "bookmark" && (
          <>
            {/* Folder grid */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              <button className="card flex aspect-square flex-col items-center justify-center gap-2 hover:border-accent hover:bg-accent-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span className="text-sm text-text-muted">Create New Folder</span>
              </button>
              <div className="card flex aspect-square flex-col items-center justify-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center text-accent">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
                    <path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                  </svg>
                </span>
                <span className="text-sm font-medium">Favorites</span>
                <span className="text-xs text-text-muted">Total Ayah: {bookmarks.length}</span>
              </div>
            </div>

            {/* Bookmark list */}
            {filtered.length === 0 ? (
              <div className="card flex flex-col items-center justify-center gap-2 py-12 text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 opacity-40">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
                <p className="text-sm">No bookmarks yet.</p>
                <p className="text-xs">Tap the bookmark icon on any ayah to save it here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border-soft rounded-xl border border-border bg-bg-soft">
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
                      className="mt-1 flex h-9 w-9 items-center justify-center rounded text-text-muted opacity-0 hover:bg-bg hover:text-red-500 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
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
          <div className="card flex items-center justify-center py-16 text-sm text-text-muted">
            Coming soon.
          </div>
        )}
      </section>

      {/* Right promo */}
      <aside className="hidden lg:block">
        <div className="card p-4 text-center">
          <h3 className="mb-3 text-base font-semibold">Quran Mazid</h3>
          <div className="mx-auto h-56 w-32 rounded-2xl bg-gradient-to-b from-accent to-accent-strong p-1.5 shadow-md">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-bg-soft text-[10px] text-text-muted">
              <div className="font-semibold">QURAN MAZID</div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-5 w-5 rounded bg-bg-elevated" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4 p-4">
          <h4 className="mb-2 text-center text-sm font-semibold">Important Features</h4>
          <ul className="grid grid-cols-2 gap-y-1.5 text-xs text-text-muted">
            <li>• Bookmark</li>
            <li>• Jump To Ayah</li>
            <li>• Theme</li>
            <li>• Advanced Search</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <h4 className="mb-2 text-sm font-semibold">Download Mobile App</h4>
          <div className="grid grid-cols-2 gap-2">
            <a className="card flex items-center gap-2 px-2 py-1.5 text-left text-[10px] hover:border-accent" href="#">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3 3l18 9-18 9z" /></svg>
              <div><div className="text-text-dim">Download on</div><div className="text-text font-semibold text-[11px]">Play Store</div></div>
            </a>
            <a className="card flex items-center gap-2 px-2 py-1.5 text-left text-[10px] hover:border-accent" href="#">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17 12c0-3 2-4 2-4s-1-2-4-2c-2 0-3 1-4 1s-2-1-4-1c-3 0-5 3-5 7s3 9 5 9c1 0 2-1 4-1s3 1 4 1c2 0 4-3 4-3s-2-2-2-7z" /></svg>
              <div><div className="text-text-dim">Download on</div><div className="text-text font-semibold text-[11px]">App Store</div></div>
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
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
        active
          ? "bg-accent-soft text-accent"
          : "text-text hover:bg-bg-elevated"
      }`}
    >
      <span className={active ? "text-accent" : "text-text-muted"}>{icon}</span>
      {label}
    </button>
  );
}
