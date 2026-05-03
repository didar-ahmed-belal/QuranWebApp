"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface Bookmark {
  surah: number;
  ayah: number;
  surahName: string;
  arabic: string;
  english: string;
  addedAt: number;
}

interface BookmarksCtx {
  bookmarks: Bookmark[];
  hydrated: boolean;
  isBookmarked: (surah: number, ayah: number) => boolean;
  toggle: (b: Omit<Bookmark, "addedAt">) => boolean; // returns new state (true = added)
  remove: (surah: number, ayah: number) => void;
  clear: () => void;
}

const Ctx = createContext<BookmarksCtx | null>(null);
const KEY = "quran:bookmarks";

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks, hydrated]);

  const isBookmarked = useCallback(
    (surah: number, ayah: number) =>
      bookmarks.some((b) => b.surah === surah && b.ayah === ayah),
    [bookmarks]
  );

  const toggle = useCallback(
    (b: Omit<Bookmark, "addedAt">) => {
      const exists = bookmarks.some(
        (x) => x.surah === b.surah && x.ayah === b.ayah
      );
      if (exists) {
        setBookmarks((s) =>
          s.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah))
        );
        return false;
      }
      setBookmarks((s) => [{ ...b, addedAt: Date.now() }, ...s]);
      return true;
    },
    [bookmarks]
  );

  const remove = useCallback((surah: number, ayah: number) => {
    setBookmarks((s) =>
      s.filter((x) => !(x.surah === surah && x.ayah === ayah))
    );
  }, []);

  const clear = useCallback(() => setBookmarks([]), []);

  const value = useMemo(
    () => ({ bookmarks, hydrated, isBookmarked, toggle, remove, clear }),
    [bookmarks, hydrated, isBookmarked, toggle, remove, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBookmarks() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBookmarks must be inside BookmarksProvider");
  return c;
}
