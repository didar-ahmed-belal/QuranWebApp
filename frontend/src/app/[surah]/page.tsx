import { notFound } from "next/navigation";
import { fetchSurah } from "@/lib/quran";
import { SURAH_LIST } from "@/lib/surahList";
import { SurahHeader } from "@/components/SurahHeader";
import { AyahCard } from "@/components/AyahCard";

// SSG: pre-render all 114 surahs
export function generateStaticParams() {
  return SURAH_LIST.map((s) => ({ surah: String(s.number) }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ surah: string }>;
}) {
  const { surah } = await params;
  const meta = SURAH_LIST.find((s) => s.number === Number(surah));
  if (!meta) return {};
  return {
    title: `Surah ${meta.englishName} (${meta.englishNameTranslation}) — Quran Mazid`,
    description: `Read Surah ${meta.englishName} (${meta.englishNameTranslation}) — ${meta.numberOfAyahs} ayahs, revealed in ${meta.revelationType}.`,
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ surah: string }>;
}) {
  const { surah } = await params;
  const num = Number(surah);
  if (!num || num < 1 || num > 114) notFound();

  const data = await fetchSurah(num);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <SurahHeader
        number={data.number}
        englishName={data.englishName}
        englishNameTranslation={data.englishNameTranslation}
        arabicName={data.name}
        numberOfAyahs={data.numberOfAyahs}
        revelationType={data.revelationType}
      />

      <div>
        {data.ayahs.map((ayah) => (
          <div key={ayah.number} id={`ayah-${ayah.numberInSurah}`} className="scroll-mt-20">
            <AyahCard
              ayah={ayah}
              surahNumber={data.number}
              surahName={data.englishName}
              totalAyahs={data.numberOfAyahs}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
