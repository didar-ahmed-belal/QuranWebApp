"use client";

import Link from "next/link";
import { useUI } from "@/lib/ui";
import { useBookmarks } from "@/lib/bookmarks";
import { useToast } from "@/lib/toast";

export function BookmarksModal() {
  const { bookmarksOpen, setBookmarksOpen } = useUI();
  const { bookmarks, remove, clear } = useBookmarks();
  const { toast } = useToast();

  if (!bookmarksOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setBookmarksOpen(false)}
      />
      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-bg-soft shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-accent">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
            </svg>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text">
              Bookmarks ({bookmarks.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={() => {
                  clear();
                  toast("All bookmarks cleared", "info");
                }}
                className="rounded px-2 py-1 text-xs text-text-muted hover:bg-bg-elevated hover:text-red-400"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setBookmarksOpen(false)}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-text-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 opacity-50">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
              <p className="text-sm">No bookmarks yet.</p>
              <p className="text-xs">Tap the bookmark icon on any ayah to save it.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border-soft">
              {bookmarks.map((b) => (
                <li
                  key={`${b.surah}:${b.ayah}`}
                  className="group flex items-start gap-3 px-4 py-3 hover:bg-bg-elevated/40"
                >
                  <Link
                    href={`/${b.surah}#ayah-${b.ayah}`}
                    onClick={() => setBookmarksOpen(false)}
                    className="flex-1 min-w-0"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-accent">
                      <span className="font-semibold">{b.surahName}</span>
                      <span className="text-text-dim">
                        {b.surah}:{b.ayah}
                      </span>
                    </div>
                    <p className="arabic font-uthmani text-right text-lg text-text">
                      {b.arabic}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                      {b.english}
                    </p>
                  </Link>
                  <button
                    onClick={() => {
                      remove(b.surah, b.ayah);
                      toast("Bookmark removed", "info");
                    }}
                    aria-label="Remove bookmark"
                    className="mt-1 hidden h-8 w-8 items-center justify-center rounded text-text-muted hover:bg-bg hover:text-red-400 group-hover:flex"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
