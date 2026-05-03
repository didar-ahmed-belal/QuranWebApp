import express, { Request, Response } from "express";
import cors from "cors";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { surahList } from "./data/surahList";
import { loadIndex, searchAyahs } from "./quranIndex";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const DATA_DIR = join(__dirname, "..", "data", "surahs");

console.log("Loading Quran index from", DATA_DIR);
loadIndex(DATA_DIR);
console.log("Quran index loaded.");

// GET /api/surahs -> list of all 114 surahs
app.get("/api/surahs", (_req: Request, res: Response) => {
  res.json({ data: surahList });
});

// GET /api/surah/:id -> arabic + english from local cache
app.get("/api/surah/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || id < 1 || id > 114) {
    return res.status(400).json({ error: "Invalid surah id" });
  }
  try {
    const path = join(DATA_DIR, `${id}.json`);
    const raw = JSON.parse(readFileSync(path, "utf8")) as {
      data: Array<{
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
        numberOfAyahs: number;
        ayahs: Array<{ number: number; numberInSurah: number; text: string }>;
      }>;
    };
    const [arabic, english] = raw.data;
    if (!arabic || !english) return res.status(502).json({ error: "Bad data" });
    res.json({
      data: {
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
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load surah" });
  }
});

// GET /api/search?q=text -> local search (auto-detects Arabic vs English)
app.get("/api/search", (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();
  const limit = Math.min(100, Number(req.query.limit) || 50);
  if (!q) return res.json({ data: [] });
  try {
    const { results } = searchAyahs(q, limit);
    res.json({ data: results });
  } catch (e) {
    console.error("search error:", e);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/", (_req, res) => res.json({ ok: true, service: "quran-backend" }));

app.listen(PORT, () => {
  console.log(`Quran backend running on http://localhost:${PORT}`);
});
