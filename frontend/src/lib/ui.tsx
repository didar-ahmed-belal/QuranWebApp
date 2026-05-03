"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface UIState {
  surahDrawerOpen: boolean;
  settingsOpen: boolean;
  searchOpen: boolean;
  bookmarksOpen: boolean;
  audioOpen: boolean;
  setSurahDrawerOpen: (v: boolean) => void;
  setSettingsOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setBookmarksOpen: (v: boolean) => void;
  setAudioOpen: (v: boolean) => void;
}

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [surahDrawerOpen, setSurahDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  return (
    <Ctx.Provider
      value={{
        surahDrawerOpen,
        settingsOpen,
        searchOpen,
        bookmarksOpen,
        audioOpen,
        setSurahDrawerOpen,
        setSettingsOpen,
        setSearchOpen,
        setBookmarksOpen,
        setAudioOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be inside UIProvider");
  return c;
}
