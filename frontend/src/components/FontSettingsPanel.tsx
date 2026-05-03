"use client";

import { useSettings, type ArabicFont } from "@/lib/settings";
import { useUI } from "@/lib/ui";

const FONT_OPTIONS: { value: ArabicFont; label: string; sample: string }[] = [
  { value: "uthmani", label: "Uthmani (Amiri Quran)", sample: "بِسْمِ ٱللَّهِ" },
  { value: "amiri", label: "Amiri", sample: "بِسْمِ ٱللَّهِ" },
  { value: "scheherazade", label: "Scheherazade New", sample: "بِسْمِ ٱللَّهِ" },
];

export function FontSettingsPanel() {
  const { settingsOpen, setSettingsOpen } = useUI();
  const {
    arabicFont,
    arabicFontSize,
    translationFontSize,
    setArabicFont,
    setArabicFontSize,
    setTranslationFontSize,
    reset,
  } = useSettings();

  if (!settingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setSettingsOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-bg-soft border-l border-border shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-soft px-5 py-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-bg-elevated"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-7 px-5 py-5">
          {/* Arabic font */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Arabic Font
            </h3>
            <div className="space-y-2">
              {FONT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                    arabicFont === opt.value
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg hover:border-border-soft",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="arabic-font"
                    value={opt.value}
                    checked={arabicFont === opt.value}
                    onChange={() => setArabicFont(opt.value)}
                    className="accent-accent"
                  />
                  <div className="flex-1">
                    <div className="text-sm">{opt.label}</div>
                    <div
                      className={`arabic mt-1 font-${opt.value === "uthmani" ? "uthmani" : opt.value} text-2xl`}
                    >
                      {opt.sample}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Arabic size */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Arabic Font Size
              </h3>
              <span className="text-sm tabular-nums text-text-muted">
                {arabicFontSize}px
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              step={1}
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </section>

          {/* Translation size */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Translation Font Size
              </h3>
              <span className="text-sm tabular-nums text-text-muted">
                {translationFontSize}px
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={28}
              step={1}
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </section>

          <button
            onClick={reset}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm hover:bg-bg-elevated"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
