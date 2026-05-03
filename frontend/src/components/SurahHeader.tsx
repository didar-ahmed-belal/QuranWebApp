"use client";

import Link from "next/link";

export function SurahHeader({
  number,
  englishName,
  englishNameTranslation,
  arabicName,
  numberOfAyahs,
  revelationType,
}: {
  number: number;
  englishName: string;
  englishNameTranslation: string;
  arabicName: string;
  numberOfAyahs: number;
  revelationType: string;
}) {
  const isMakkah = revelationType.toLowerCase().startsWith("mecc");
  return (
    <div className="mb-6 rounded-xl border border-border bg-gradient-to-b from-bg-elevated to-bg-soft p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-accent">
            Surah {number}
          </div>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Surah {englishName}
          </h1>
          <p className="mt-1 text-sm text-text-muted">{englishNameTranslation}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="rounded-full border border-border bg-bg px-2.5 py-1">
              {numberOfAyahs} Ayahs
            </span>
            <span
              className={[
                "rounded-full border px-2.5 py-1",
                isMakkah
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
              ].join(" ")}
            >
              {isMakkah ? "Makkah" : "Madinah"}
            </span>
          </div>
        </div>
        <div className="arabic font-uthmani text-3xl sm:text-4xl shrink-0 text-gold">
          {arabicName}
        </div>
      </div>

      {/* Bismillah */}
      {number !== 1 && number !== 9 && (
        <div className="arabic font-uthmani mt-6 border-t border-border pt-5 text-center text-2xl sm:text-3xl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* Prev/Next */}
      <div className="mt-5 flex items-center justify-between">
        {number > 1 ? (
          <Link
            href={`/${number - 1}`}
            className="flex items-center gap-1 rounded-md border border-border bg-bg px-3 py-1.5 text-sm hover:bg-bg-elevated"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </Link>
        ) : (
          <span />
        )}
        {number < 114 ? (
          <Link
            href={`/${number + 1}`}
            className="flex items-center gap-1 rounded-md border border-border bg-bg px-3 py-1.5 text-sm hover:bg-bg-elevated"
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
