/**
 * Pre-fetch all 114 surahs from AlQuran Cloud and save to data/surahs/*.json
 * Run with: npx tsx scripts/prefetch.ts
 *
 * This avoids hitting rate limits during parallel SSG builds.
 */
import { writeFile, mkdir, access } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "data", "surahs");
const API = "https://api.alquran.cloud/v1";

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchOne(num: number, attempt = 1): Promise<unknown> {
  const url = `${API}/surah/${num}/editions/quran-uthmani,en.sahih`;
  const res = await fetch(url);
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 8) throw new Error(`Surah ${num}: ${res.status} after retries`);
    const wait = Math.min(15000, 800 * 2 ** (attempt - 1));
    console.log(`  surah ${num}: ${res.status}, retry in ${wait}ms`);
    await new Promise((r) => setTimeout(r, wait));
    return fetchOne(num, attempt + 1);
  }
  if (!res.ok) throw new Error(`Surah ${num}: ${res.status}`);
  return res.json();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let done = 0;
  let skipped = 0;
  for (let i = 1; i <= 114; i++) {
    const out = join(OUT_DIR, `${i}.json`);
    if (await fileExists(out)) {
      skipped++;
      continue;
    }
    const data = await fetchOne(i);
    await writeFile(out, JSON.stringify(data));
    done++;
    process.stdout.write(`\r  fetched ${done}/${114 - skipped} (skipped ${skipped})    `);
    // gentle pacing to avoid 429
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`\nDone. New: ${done}, Cached: ${skipped}, Total: 114`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
