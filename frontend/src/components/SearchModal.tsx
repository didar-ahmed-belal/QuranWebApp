"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/lib/ui";
import { API_BASE } from "@/lib/quran";

interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  numberInSurah: number;
  text: string;
  isArabic?: boolean;
}

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setResults([]);
      setError(null);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/api/search?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { data: SearchResult[] };
        setResults(data.data || []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Search failed. Make sure backend is running on " + API_BASE);
        }
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [q]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div className="absolute inset-0 bg-black/60" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-bg-soft shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ayahs (English or Arabic)..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-text-dim"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close"
            className="rounded px-2 py-1 text-xs text-text-muted hover:bg-bg-elevated"
          >
            ESC
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-text-muted">Searching...</div>
          )}
          {error && (
            <div className="px-4 py-6 text-center text-sm text-red-400">{error}</div>
          )}
          {!loading && !error && q && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-text-muted">No results.</div>
          )}
          <ul>
            {results.map((r, i) => (
              <li key={`${r.surahNumber}-${r.numberInSurah}-${i}`}>
                <Link
                  href={`/${r.surahNumber}#ayah-${r.numberInSurah}`}
                  onClick={() => setSearchOpen(false)}
                  className="block border-b border-border-soft px-4 py-3 hover:bg-bg-elevated"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-accent">
                    <span>{r.surahName}</span>
                    <span className="text-text-dim">•</span>
                    <span className="text-text-muted">
                      {r.surahNumber}:{r.numberInSurah}
                    </span>
                  </div>
                  {r.isArabic ? (
                    <p className="arabic font-uthmani text-lg text-text line-clamp-2">
                      {r.text}
                    </p>
                  ) : (
                    <p className="text-sm text-text-muted line-clamp-2">{r.text}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
