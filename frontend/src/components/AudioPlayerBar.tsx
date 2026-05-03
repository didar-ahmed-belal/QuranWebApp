"use client";

import { useEffect, useRef, useState } from "react";
import { ayahAudioUrl } from "@/lib/quran";

interface NowPlaying {
  surah: number;
  ayah: number;
  surahName: string;
  totalAyahs: number;
}

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayerBar() {
  const [np, setNp] = useState<NowPlaying | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Listen for ayah-cards reporting they started
  useEffect(() => {
    const onNow = (e: Event) => {
      const d = (e as CustomEvent).detail as NowPlaying;
      setNp(d);
      setPlaying(true);
    };
    window.addEventListener("quran:now-playing", onNow);
    return () => window.removeEventListener("quran:now-playing", onNow);
  }, []);

  // Mirror the playing state from any audio element on page
  useEffect(() => {
    const tick = () => {
      const audios = Array.from(document.querySelectorAll("audio"));
      const active = audios.find((a) => !a.paused) || audios.find((a) => a.currentTime > 0);
      if (active) {
        setCur(active.currentTime);
        setDur(active.duration || 0);
        setPlaying(!active.paused);
      }
    };
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  const togglePlay = () => {
    if (!np) return;
    window.dispatchEvent(
      new CustomEvent("quran:play-ayah", { detail: { ayah: np.ayah } })
    );
  };

  const next = () => {
    if (!np) return;
    if (np.ayah < np.totalAyahs) {
      window.dispatchEvent(
        new CustomEvent("quran:play-ayah", { detail: { ayah: np.ayah + 1 } })
      );
    }
  };
  const prev = () => {
    if (!np) return;
    if (np.ayah > 1) {
      window.dispatchEvent(
        new CustomEvent("quran:play-ayah", { detail: { ayah: np.ayah - 1 } })
      );
    }
  };
  const stop = () => {
    window.dispatchEvent(new CustomEvent("quran:stop-all"));
    setPlaying(false);
    setNp(null);
  };

  if (!np) return null;

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-bg-soft">
      <div className="h-0.5 w-full bg-bg-elevated">
        <div className="h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1 truncate text-sm font-medium">
          {np.surahName} : {np.ayah}
        </div>
        <span className="hidden text-xs tabular-nums text-text-muted sm:inline">{fmt(cur)}</span>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text" aria-label="Previous ayah">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M6 4h2v16H6zM20 4L9 12l11 8z" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-strong"
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
          <button onClick={next} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text" aria-label="Next ayah">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M16 4h2v16h-2zM4 4l11 8-11 8z" />
            </svg>
          </button>
          <button onClick={stop} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text" aria-label="Stop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <span className="hidden text-xs tabular-nums text-text-muted sm:inline">{fmt(dur)}</span>
        <audio ref={audioRef} src={ayahAudioUrl(np.surah, np.ayah)} preload="none" />
      </div>
    </div>
  );
}
