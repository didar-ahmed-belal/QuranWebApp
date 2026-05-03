"use client";

import { useUI } from "@/lib/ui";
import { useToast } from "@/lib/toast";

export function AudioModal() {
  const { audioOpen, setAudioOpen } = useUI();
  const { toast } = useToast();

  if (!audioOpen) return null;

  const playAll = () => {
    window.dispatchEvent(new CustomEvent("quran:play-all"));
    setAudioOpen(false);
    toast("Playing surah from beginning", "info");
  };

  const stopAll = () => {
    window.dispatchEvent(new CustomEvent("quran:stop-all"));
    setAudioOpen(false);
    toast("Audio stopped", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div className="absolute inset-0 bg-black/60" onClick={() => setAudioOpen(false)} />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg-soft shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-accent">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text">
              Recitation
            </h2>
          </div>
          <button
            onClick={() => setAudioOpen(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-bg-elevated hover:text-text"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-border-soft bg-bg p-3">
            <div className="text-xs uppercase tracking-wider text-text-dim">Reciter</div>
            <div className="mt-1 text-base font-semibold text-text">
              Mishary Rashid Alafasy
            </div>
            <div className="text-xs text-text-muted">128 kbps • EveryAyah CDN</div>
          </div>

          <button
            onClick={playAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent/90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play full surah from beginning
          </button>

          <button
            onClick={stopAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm text-text hover:bg-bg-elevated"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            Stop all audio
          </button>

          <p className="text-xs text-text-muted">
            Tip: tap the play icon on any ayah to listen to just that verse.
          </p>
        </div>
      </div>
    </div>
  );
}
