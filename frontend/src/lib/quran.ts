import type { SurahFull } from "./types";

const ALQURAN_API = "https://api.alquran.cloud/v1";

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
).replace(/\/+$/, "");

interface AlQuranResponse {
  data: Array<{
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Array<{ number: number; numberInSurah: number; text: string }>;
  }>;
}

function transform(json: AlQuranResponse, num: number): SurahFull {
  const [arabic, english] = json.data;
  if (!arabic || !english) throw new Error(`Bad data for surah ${num}`);
  return {
    number: arabic.number,
    name: arabic.name,
    englishName: arabic.englishName,
    englishNameTranslation: arabic.englishNameTranslation,
    revelationType: arabic.revelationType,
    numberOfAyahs: arabic.numberOfAyahs,
    ayahs: arabic.ayahs.map((a, i) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      arabic: a.text,
      english: english.ayahs[i]?.text ?? "",
    })),
  };
}

/**
 * Fetch a full surah. At build time, prefers local cached JSON
 * (populated by scripts/prefetch.ts). Falls back to AlQuran Cloud
 * with retry-with-backoff.
 */
/**
 * Fetch a full surah.
 * Order:
 *   1) Backend (so logs fire + central source)
 *   2) Local cache (for offline / build fallback)
 *   3) AlQuran Cloud (last resort)
 */
export async function fetchSurah(num: number): Promise<SurahFull> {
  // 1) Try backend first (works server + client)
  try {
    const res = await fetch(`${API_BASE}/api/surah/${num}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = (await res.json()) as { data: SurahFull };
      return json.data;
    }
  } catch {
    // fall through
  }

  // 2) Try local cached JSON (server-only)
  if (typeof window === "undefined") {
    try {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const path = join(process.cwd(), "data", "surahs", `${num}.json`);
      const raw = await readFile(path, "utf8");
      return transform(JSON.parse(raw) as AlQuranResponse, num);
    } catch {
      // fall through to network
    }
  }

  // 3) Final fallback: AlQuran Cloud direct
  const url = `${ALQURAN_API}/surah/${num}/editions/quran-uthmani,en.sahih`;
  const maxAttempts = 5;
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (res.status === 429 || res.status >= 500) {
        const wait = Math.min(12000, 800 * 2 ** (attempt - 1)) + Math.random() * 400;
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) throw new Error(`Failed to fetch surah ${num}: ${res.status}`);
      const json = (await res.json()) as AlQuranResponse;
      return transform(json, num);
    } catch (e) {
      lastErr = e;
      const wait = Math.min(12000, 800 * 2 ** (attempt - 1));
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr ?? new Error(`Failed to fetch surah ${num}`);
}

/**
 * Audio URL for a single ayah using EveryAyah CDN (Mishary Alafasy).
 * Format: 001001.mp3 (3-digit surah + 3-digit ayah)
 */
export function ayahAudioUrl(surah: number, ayah: number): string {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
}
