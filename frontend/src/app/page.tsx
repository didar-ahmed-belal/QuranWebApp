"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/1");
  }, [router]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <p className="text-text-muted">
        Redirecting to <Link href="/1" className="text-accent underline">Surah Al-Fatihah</Link>...
      </p>
    </div>
  );
}
