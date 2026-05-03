"use client";

import { useState } from "react";
import { useSettings, arabicFontClass, type ArabicFont } from "@/lib/settings";

const FONT_OPTIONS: { value: ArabicFont; label: string }[] = [
  { value: "uthmani", label: "KFGQ (Uthmani)" },
  { value: "amiri", label: "Amiri" },
  { value: "scheherazade", label: "Scheherazade New" },
];

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-1 py-3 text-left"
      >
        <span className={`flex items-center gap-2 text-sm font-semibold ${open ? "text-accent" : "text-text"}`}>
          {open && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M5 4h11l3 3v13H5z" />
            </svg>
          )}
          {title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function SettingsRail() {
  const {
    arabicFont,
    arabicFontSize,
    translationFontSize,
    viewMode,
    setArabicFont,
    setArabicFontSize,
    setTranslationFontSize,
    setViewMode,
  } = useSettings();
  const [fontOpen, setFontOpen] = useState(false);

  return (
    <aside className="hidden lg:flex sticky top-16 h-[calc(100vh-4rem)] w-72 shrink-0 flex-col overflow-y-auto border-l border-border bg-bg px-4 pt-4 pb-24">
      {/* Translation/Reading toggle */}
      <div className="mb-3 flex gap-1 rounded-full bg-bg-elevated p-1">
        <button
          onClick={() => setViewMode("translation")}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            viewMode === "translation" ? "bg-bg-soft text-text shadow-sm" : "text-text-muted hover:text-text"
          }`}
        >
          Translation
        </button>
        <button
          onClick={() => setViewMode("reading")}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            viewMode === "reading" ? "bg-bg-soft text-text shadow-sm" : "text-text-muted hover:text-text"
          }`}
        >
          Reading
        </button>
      </div>

      <Section title="Reading Settings" defaultOpen={false}>
        <div className="px-1 text-sm text-text-muted">
          Choose your preferred reading view above. More options coming soon.
        </div>
      </Section>

      <Section title="Font Settings" defaultOpen>
        <div className="space-y-5 px-1">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-text">Arabic Font Size</span>
              <span className="text-sm tabular-nums text-text-muted">{arabicFontSize}</span>
            </div>
            <input
              type="range"
              min={20}
              max={56}
              step={1}
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-text">Translation Font Size</span>
              <span className="text-sm tabular-nums text-text-muted">{translationFontSize}</span>
            </div>
            <input
              type="range"
              min={12}
              max={28}
              step={1}
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="mb-1.5 text-sm text-text">Arabic Font Face</div>
            <div className="relative">
              <button
                onClick={() => setFontOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-bg-soft px-3 py-2.5 text-left text-sm hover:border-accent"
              >
                <span>{FONT_OPTIONS.find((o) => o.value === arabicFont)?.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-text-muted">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              {fontOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border bg-bg-soft shadow-lg">
                  {FONT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setArabicFont(o.value);
                        setFontOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-bg-elevated ${
                        arabicFont === o.value ? "text-accent" : ""
                      }`}
                    >
                      <span>{o.label}</span>
                      <span className={`arabic ${arabicFontClass(o.value)} text-base`}>أ</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Support card */}
      <div className="mt-5 rounded-xl border border-border bg-bg-soft p-4">
        <div className="text-sm font-semibold leading-snug">
          Help spread the knowledge of Islam
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
          Your regular support helps us reach our religious brothers and sisters
          with the message of Islam. Join our mission and be part of the big change.
        </p>
        <a
          href="https://quranmazid.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-strong"
        >
          Support Us
        </a>
      </div>
    </aside>
  );
}
