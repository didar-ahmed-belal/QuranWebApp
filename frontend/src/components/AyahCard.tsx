"use client";

import { useEffect, useRef, useState } from "react";
import type { Ayah } from "@/lib/types";
import { ayahAudioUrl } from "@/lib/quran";
import { useSettings, arabicFontClass } from "@/lib/settings";
import { useBookmarks } from "@/lib/bookmarks";
import { useToast } from "@/lib/toast";

export function AyahCard({
  ayah,
  surahNumber,
  surahName,
  totalAyahs,
}: {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  totalAyahs: number;
}) {
  const { arabicFont, arabicFontSize, translationFontSize, viewMode } = useSettings();
  const { isBookmarked, toggle } = useBookmarks();
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const bookmarked = isBookmarked(surahNumber, ayah.numberInSurah);
  const showTranslation = viewMode !== "reading";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => {
      setPlaying(false);
      // Default behavior: keep chaining to next ayah unless explicitly stopped
      if (a.dataset.playAll !== "0" && ayah.numberInSurah < totalAyahs) {
        a.dataset.playAll = "";
        window.dispatchEvent(
          new CustomEvent("quran:play-ayah", {
            detail: { ayah: ayah.numberInSurah + 1, playAll: true },
          })
        );
      }
    };
    const onPlay = () => {
      document.querySelectorAll("audio").forEach((el) => {
        if (el !== a && !el.paused) el.pause();
      });
      window.dispatchEvent(
        new CustomEvent("quran:now-playing", {
          detail: { surah: surahNumber, ayah: ayah.numberInSurah, surahName, totalAyahs },
        })
      );
    };
    const onPause = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [ayah.numberInSurah, totalAyahs, surahNumber, surahName]);

  useEffect(() => {
    const onPlayAyah = (e: Event) => {
      const detail = (e as CustomEvent).detail as { ayah: number; playAll?: boolean };
      if (detail.ayah !== ayah.numberInSurah) return;
      const a = audioRef.current;
      if (!a) return;
      a.dataset.playAll = ""; // re-enable auto-chain
      document
        .getElementById(`ayah-${ayah.numberInSurah}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    const onStopAll = () => {
      const a = audioRef.current;
      if (!a) return;
      a.dataset.playAll = "0"; // disable auto-chain
      a.pause();
      a.currentTime = 0;
      setPlaying(false);
    };
    window.addEventListener("quran:play-ayah", onPlayAyah);
    window.addEventListener("quran:stop-all", onStopAll);
    return () => {
      window.removeEventListener("quran:play-ayah", onPlayAyah);
      window.removeEventListener("quran:stop-all", onStopAll);
    };
  }, [ayah.numberInSurah]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.dataset.playAll = "0"; // user-initiated pause = stop chain
      a.pause();
    } else {
      a.dataset.playAll = ""; // re-enable chain
      a.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
        toast("Audio failed to load", "error");
      });
    }
  };

  const handleBookmark = () => {
    const added = toggle({
      surah: surahNumber,
      ayah: ayah.numberInSurah,
      surahName,
      arabic: ayah.arabic,
      english: ayah.english,
    });
    toast(added ? "Bookmark added" : "Bookmark removed", added ? "success" : "info");
  };

  const handleCopy = async () => {
    const text = `${surahName} ${surahNumber}:${ayah.numberInSurah}\n\n${ayah.arabic}\n\n${ayah.english}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast("Ayah copied");
    } catch {
      toast("Copy failed", "error");
    }
    setMenuOpen(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${surahNumber}#ayah-${ayah.numberInSurah}`;
    const text = `${surahName} ${surahNumber}:${ayah.numberInSurah} — ${ayah.english}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: surahName, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast("Link copied");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") toast("Share failed", "error");
    }
    setMenuOpen(false);
  };

  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      className={`group relative grid grid-cols-[44px_1fr] gap-3 border-b border-border-soft px-2 py-6 sm:gap-5 sm:px-4 ${
        playing ? "bg-accent-soft/40" : ""
      }`}
    >
      {/* Left vertical action rail */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <div className="mb-1 text-xs font-semibold text-accent">
          {surahNumber}:{ayah.numberInSurah}
        </div>
        <RailBtn
          label={playing ? "Pause" : "Play"}
          onClick={toggleAudio}
          active={playing}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </RailBtn>
        <RailBtn label="Translation" onClick={() => toast("Translation: Saheeh International", "info")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
            <path d="M2 5a2 2 0 012-2h6v15H4a2 2 0 00-2 2V5z" />
            <path d="M22 5a2 2 0 00-2-2h-6v15h6a2 2 0 012 2V5z" />
          </svg>
        </RailBtn>
        <RailBtn
          label={bookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={handleBookmark}
          active={bookmarked}
        >
          <svg viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
          </svg>
        </RailBtn>
        <div ref={menuRef} className="relative">
          <RailBtn label="More" onClick={() => setMenuOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </RailBtn>
          {menuOpen && (
            <div className="absolute left-10 top-0 z-20 w-36 overflow-hidden rounded-lg border border-border bg-bg-soft shadow-lg">
              <button onClick={handleCopy} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-bg-elevated">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </button>
              <button onClick={handleShare} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-bg-elevated">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                </svg>
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right content */}
      <div className="min-w-0">
        <p
          className={`arabic ${arabicFontClass(arabicFont)} text-text leading-loose`}
          style={{ fontSize: `${arabicFontSize}px` }}
        >
          {ayah.arabic}
          <span className="mx-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-text-dim/40 text-xs text-text-muted align-middle">
            {ayah.numberInSurah}
          </span>
        </p>

        {showTranslation && (
          <>
            <div className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-text-dim">
              Saheeh International
            </div>
            <p
              className="mt-1.5 text-text leading-relaxed"
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {ayah.english}
            </p>
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        src={ayahAudioUrl(surahNumber, ayah.numberInSurah)}
        preload="none"
      />
    </div>
  );
}

function RailBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ${
        active
          ? "bg-accent-soft text-accent scale-105"
          : "text-text-dim hover:bg-bg-elevated hover:text-text hover:scale-105"
      }`}
    >
      {children}
    </button>
  );
}
