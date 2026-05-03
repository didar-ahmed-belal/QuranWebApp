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
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();
  const { isBookmarked, toggle } = useBookmarks();
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bookmarked = isBookmarked(surahNumber, ayah.numberInSurah);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => {
      setPlaying(false);
      if (a.dataset.playAll === "1") {
        a.dataset.playAll = "";
        if (ayah.numberInSurah < totalAyahs) {
          window.dispatchEvent(
            new CustomEvent("quran:play-ayah", {
              detail: { ayah: ayah.numberInSurah + 1, playAll: true },
            })
          );
        }
      }
    };
    const onPlay = () => {
      document.querySelectorAll("audio").forEach((el) => {
        if (el !== a && !el.paused) el.pause();
      });
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
  }, [ayah.numberInSurah, totalAyahs]);

  useEffect(() => {
    const onPlayAyah = (e: Event) => {
      const detail = (e as CustomEvent).detail as { ayah: number; playAll?: boolean };
      if (detail.ayah !== ayah.numberInSurah) return;
      const a = audioRef.current;
      if (!a) return;
      if (detail.playAll) a.dataset.playAll = "1";
      document
        .getElementById(`ayah-${ayah.numberInSurah}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    const onStopAll = () => {
      const a = audioRef.current;
      if (!a) return;
      a.dataset.playAll = "";
      a.pause();
      a.currentTime = 0;
      setPlaying(false);
    };
    const onPlayAll = () => {
      if (ayah.numberInSurah !== 1) return;
      const a = audioRef.current;
      if (!a) return;
      a.dataset.playAll = "1";
      window.scrollTo({ top: 0, behavior: "smooth" });
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    window.addEventListener("quran:play-ayah", onPlayAyah);
    window.addEventListener("quran:stop-all", onStopAll);
    window.addEventListener("quran:play-all", onPlayAll);
    return () => {
      window.removeEventListener("quran:play-ayah", onPlayAyah);
      window.removeEventListener("quran:stop-all", onStopAll);
      window.removeEventListener("quran:play-all", onPlayAll);
    };
  }, [ayah.numberInSurah]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
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
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast("Ayah copied to clipboard");
    } catch {
      toast("Copy failed", "error");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${surahNumber}#ayah-${ayah.numberInSurah}`;
    const text = `${surahName} ${surahNumber}:${ayah.numberInSurah} — ${ayah.english}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: surahName, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast("Link copied to clipboard");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast("Share failed", "error");
      }
    }
  };

  return (
    <div className="border-b border-border-soft py-6 first:pt-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-bg-elevated px-2 text-sm font-medium text-text-muted">
          {surahNumber}:{ayah.numberInSurah}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleAudio}
            aria-label={playing ? "Pause ayah" : "Play ayah"}
            title={playing ? "Pause" : "Play"}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              playing
                ? "bg-accent/15 text-accent"
                : "text-text-muted hover:bg-bg-elevated hover:text-accent"
            }`}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <IconBtn
            label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            onClick={handleBookmark}
            active={bookmarked}
          >
            <svg
              viewBox="0 0 24 24"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
            </svg>
          </IconBtn>
          <IconBtn label="Copy ayah" onClick={handleCopy}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </IconBtn>
          <IconBtn label="Share ayah" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </IconBtn>
        </div>
      </div>

      <p
        className={`arabic ${arabicFontClass(arabicFont)} text-text leading-loose`}
        style={{ fontSize: `${arabicFontSize}px` }}
      >
        {ayah.arabic}
      </p>

      <div className="mt-5 text-xs font-semibold uppercase tracking-widest text-text-dim">
        Saheeh International
      </div>
      <p
        className="mt-2 text-text-muted leading-relaxed"
        style={{ fontSize: `${translationFontSize}px` }}
      >
        {ayah.english}
      </p>

      <audio
        ref={audioRef}
        src={ayahAudioUrl(surahNumber, ayah.numberInSurah)}
        preload="none"
      />
    </div>
  );
}

function IconBtn({
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
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        active
          ? "bg-accent/15 text-accent"
          : "text-text-muted hover:bg-bg-elevated hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
