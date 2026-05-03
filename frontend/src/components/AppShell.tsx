"use client";

import { usePathname } from "next/navigation";
import { IconSidebar } from "@/components/IconSidebar";
import { SurahSidebar, MobileSurahDrawer } from "@/components/SurahSidebar";
import { SettingsRail } from "@/components/SettingsRail";

/**
 * Decides which sidebars to mount based on the current route.
 *  - Reading pages (`/`, `/:surah`)  → IconSidebar + SurahSidebar + main + SettingsRail
 *  - Other pages   (`/bookmarks` …)  → IconSidebar + main only
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isReading = pathname === "/" || /^\/[0-9]+/.test(pathname);

  return (
    <div className="flex flex-1">
      <IconSidebar />
      {isReading && <SurahSidebar />}
      <main className="min-w-0 flex-1">{children}</main>
      {isReading && <SettingsRail />}
      <MobileSurahDrawer />
    </div>
  );
}
