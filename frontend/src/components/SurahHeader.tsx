"use client";

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
  const ayahLabel = String(numberOfAyahs).padStart(2, "0");

  return (
    <div className="relative mb-4 overflow-hidden">
      <svg
        viewBox="0 0 600 220"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-44 w-[480px] -translate-x-1/2 text-text-dim opacity-15 sm:h-52"
        fill="currentColor"
      >
        <path d="M298 18l4 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" opacity=".55" />
        <rect x="298" y="32" width="4" height="22" />
        <path d="M260 70c-18 0-30 14-30 32v50h60V102c0-18-12-32-30-32z" />
        <ellipse cx="260" cy="70" rx="28" ry="14" />
        <path d="M340 70c-18 0-30 14-30 32v50h60V102c0-18-12-32-30-32z" />
        <ellipse cx="340" cy="70" rx="28" ry="14" />
        <path d="M210 95c-12 0-20 9-20 22v35h40v-35c0-13-8-22-20-22z" />
        <ellipse cx="210" cy="95" rx="18" ry="9" />
        <path d="M390 95c-12 0-20 9-20 22v35h40v-35c0-13-8-22-20-22z" />
        <ellipse cx="390" cy="95" rx="18" ry="9" />
        <rect x="170" y="115" width="20" height="35" rx="4" />
        <rect x="410" y="115" width="20" height="35" rx="4" />
        <path d="M120 152h360v18h-360z" />
        <rect x="240" y="120" width="22" height="32" rx="11" opacity=".4" />
        <rect x="338" y="120" width="22" height="32" rx="11" opacity=".4" />
      </svg>

      <div className="relative flex flex-col items-center justify-center pt-12 pb-3 sm:pt-16 sm:pb-4">
        <div className="arabic font-uthmani text-2xl text-text-muted opacity-60 sm:text-3xl">
          {arabicName}
        </div>
        <h1 className="mt-2 text-center text-2xl font-bold sm:text-[26px]">
          Surah {englishName}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {englishNameTranslation} · Ayah {ayahLabel} - {isMakkah ? "Makkah" : "Madinah"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-border-soft py-3 text-center text-sm text-text-muted">
        <div>{englishName}</div>
        <div>Page: {String(Math.ceil((number / 114) * 604)).padStart(2, "0")}</div>
        <div>Juz: {String(Math.min(30, Math.ceil(number / 4))).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
