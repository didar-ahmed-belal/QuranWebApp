import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface IndexedAyah {
  surahNumber: number;
  surahArabicName: string;
  surahEnglishName: string;
  numberInSurah: number;
  arabic: string;        // original (with diacritics)
  arabicNormalized: string;
  english: string;
  englishLower: string;
}

interface AlQuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Array<{ number: number; numberInSurah: number; text: string }>;
}

// Strip Arabic diacritics + tatweel + unify letter variants for search.
// We also drop ALL alef variants (ا ٱ آ أ إ) because in Quranic text the long-a
// is often written as superscript alef (U+0670) which we strip, while users
// usually type a normal alef. Dropping alef entirely makes both sides match.
export function normalizeArabic(s: string): string {
  return s
    .normalize("NFKC")
    // remove diacritics (tashkeel) + dagger alef + tatweel + small letters + hamza variants on letters
    .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED\u08F0-\u08FF\u0610-\u061A]/g, "")
    // drop ALL alef forms (handles superscript-alef vs regular-alef mismatch)
    .replace(/[\u0622\u0623\u0625\u0627\u0671\u0672\u0673]/g, "")
    // unify yaa
    .replace(/[\u0649]/g, "\u064A")
    // taa marbuta -> haa
    .replace(/\u0629/g, "\u0647")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

let cache: IndexedAyah[] | null = null;

export function loadIndex(dataDir: string): IndexedAyah[] {
  if (cache) return cache;
  const out: IndexedAyah[] = [];
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const raw = JSON.parse(readFileSync(join(dataDir, f), "utf8")) as {
      data: AlQuranSurah[];
    };
    const [arabic, english] = raw.data;
    if (!arabic || !english) continue;
    for (let i = 0; i < arabic.ayahs.length; i++) {
      const a = arabic.ayahs[i]!;
      const e = english.ayahs[i];
      out.push({
        surahNumber: arabic.number,
        surahArabicName: arabic.name,
        surahEnglishName: arabic.englishName,
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        arabicNormalized: normalizeArabic(a.text),
        english: e?.text ?? "",
        englishLower: (e?.text ?? "").toLowerCase(),
      });
    }
  }
  out.sort((a, b) =>
    a.surahNumber === b.surahNumber
      ? a.numberInSurah - b.numberInSurah
      : a.surahNumber - b.surahNumber
  );
  cache = out;
  return cache;
}

export function searchAyahs(q: string, limit = 50): {
  results: Array<{
    surahNumber: number;
    surahName: string;
    surahArabic: string;
    numberInSurah: number;
    text: string;
    isArabic: boolean;
  }>;
} {
  if (!cache) throw new Error("Index not loaded");
  const trimmed = q.trim();
  if (!trimmed) return { results: [] };
  const isArabic = /[\u0600-\u06FF]/.test(trimmed);
  const out = [];
  if (isArabic) {
    const needle = normalizeArabic(trimmed);
    for (const a of cache) {
      if (a.arabicNormalized.includes(needle)) {
        out.push({
          surahNumber: a.surahNumber,
          surahName: a.surahEnglishName,
          surahArabic: a.surahArabicName,
          numberInSurah: a.numberInSurah,
          text: a.arabic,
          isArabic: true,
        });
        if (out.length >= limit) break;
      }
    }
  } else {
    const needle = trimmed.toLowerCase();
    for (const a of cache) {
      if (a.englishLower.includes(needle)) {
        out.push({
          surahNumber: a.surahNumber,
          surahName: a.surahEnglishName,
          surahArabic: a.surahArabicName,
          numberInSurah: a.numberInSurah,
          text: a.english,
          isArabic: false,
        });
        if (out.length >= limit) break;
      }
    }
  }
  return { results: out };
}
