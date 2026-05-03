# Quran Web Application

A modern, responsive clone of [quranmazid.com/1](https://quranmazid.com/1) built as a technical assessment.

Read the Holy Quran with Arabic (Uthmani script), English (Saheeh International) translation, per‑ayah audio recitation by Mishary Alafasy, full Arabic + English search, customizable Arabic fonts/sizes, dark theme, and full mobile responsiveness.

---

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | **Next.js 16** (App Router, **SSG** via `output: "export"`), **TypeScript**, **Tailwind CSS v4**, React 19 |
| Backend | **Node.js + Express 4**, TypeScript (run with `tsx`) |
| Data | Pre‑fetched JSON from [AlQuran Cloud](https://alquran.cloud) (114 surahs cached locally) |
| Audio | [EveryAyah CDN](https://everyayah.com) — Mishary Alafasy 128 kbps |
| Fonts | Amiri Quran (Uthmani), Amiri, Scheherazade New (via `next/font/google`) |

---

## 📁 Project Structure

```
QuranWebApp/
├── backend/                  # Express API on port 8000
│   ├── src/
│   │   ├── index.ts          # API routes
│   │   ├── quranIndex.ts     # In-memory search index (Arabic + English)
│   │   └── data/surahList.ts # 114 surah metadata
│   └── data/surahs/          # symlink → frontend/data/surahs
│
├── frontend/                 # Next.js SSG app
│   ├── src/
│   │   ├── app/              # App Router pages (layout, [surah], page)
│   │   ├── components/       # IconSidebar, SurahSidebar, AyahCard, …
│   │   └── lib/              # quran.ts, settings.tsx, ui.tsx, types.ts
│   ├── data/surahs/          # 114 pre-fetched JSON files
│   ├── scripts/prefetch.ts   # Prefetches all 114 surahs from AlQuran Cloud
│   └── .env                  # NEXT_PUBLIC_API_BASE=http://localhost:8000
│
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** ≥ 18 (recommended 20+)
- **npm** ≥ 9

Check with:
```bash
node -v
npm -v
```

---

## 🚀 How to Run

Open **two terminals** — one for the backend, one for the frontend.

### 1️⃣ Backend (Express API on port 8000)

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Loading Quran index from .../backend/data/surahs
Quran index loaded.
Quran backend running on http://localhost:8000
```

Quick health check:
```bash
curl http://localhost:8000/api/surahs | head -c 200
curl "http://localhost:8000/api/search?q=mercy" | head -c 200
```

### 2️⃣ Frontend (Next.js dev server on port 3000)

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser. It will redirect to `/1` (Surah Al‑Fatihah).

> If port 3000 is already in use, Next.js will pick 3001 automatically — check the terminal output.

---

## 🌐 Environment Variables

`frontend/.env`:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```
This tells the frontend where the backend lives. Change the URL if you deploy the backend elsewhere.

---

## 📦 Production Build (Static Export)

The frontend is configured for **full static export** — every surah page is pre‑rendered at build time.

```bash
# 1. Make sure backend is running (only needed for runtime search)
cd backend && npm run dev

# 2. In another terminal: build the static site
cd frontend
npm run build      # runs prefetch + next build
```

Output goes to `frontend/out/` — **115 static `.html` files** (114 surahs + index). You can host this folder on any static host (Vercel, Netlify, GitHub Pages, Nginx, etc.).

To preview locally:
```bash
cd frontend/out
npx serve .
```

> Note: search uses the backend at runtime via `NEXT_PUBLIC_API_BASE`, so the backend must be reachable from wherever you deploy the static site.

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/surahs` | List of all 114 surahs (metadata only) |
| GET | `/api/surah/:id` | Full surah (Arabic + English) for `id` 1–114 |
| GET | `/api/search?q=<text>&limit=50` | Search ayahs by Arabic **or** English (auto‑detected) |

---

## ✨ Features

- 📖 **Read all 114 surahs** with Arabic (Uthmani) + Saheeh International translation
- 🔍 **Search** — works in both **Arabic** (handles diacritics, alef variants, taa marbuta) and **English**
- 🔊 **Per‑ayah audio playback** (Mishary Alafasy 128 kbps, EveryAyah CDN)
- 🎨 **Font settings panel** — 3 Arabic fonts, adjustable Arabic + translation sizes, persisted to `localStorage`
- 🕌 **Surah header** — Makkah / Madinah pill, Bismillah, prev/next navigation
- 🌙 **Dark theme** with green/gold accent palette
- 📱 **Fully responsive** — desktop sidebars + mobile drawer & topbar
- ⚡ **SSG** — every surah page is prebuilt as a static `.html`

---

## 🛠 Scripts Reference

### Backend (`backend/package.json`)
| Script | Action |
|---|---|
| `npm run dev` | Start API in watch mode (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |

### Frontend (`frontend/package.json`)
| Script | Action |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run prefetch` | Re-fetch all 114 surahs to `data/surahs/` |
| `npm run build` | Prefetch + static export to `out/` |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

---

## 🧯 Troubleshooting

| Problem | Fix |
|---|---|
| Search returns "Search failed…" | Backend not running. Start it: `cd backend && npm run dev` |
| Port 8000 already in use | `PORT=9000 npm run dev` and update `frontend/.env` to match |
| Port 3000 already in use | Next.js auto‑selects 3001 — check terminal output |
| Audio doesn't play | Check internet — audio is streamed from `everyayah.com` |
| Fresh clone, no surah data | Run `cd frontend && npm run prefetch` |

---

## 📜 License

This project was built as an authorized technical assessment. Quran text © respective publishers; audio © EveryAyah / Mishary Alafasy.
