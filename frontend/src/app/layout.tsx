import type { Metadata } from "next";
import { Amiri, Amiri_Quran, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";
import { UIProvider } from "@/lib/ui";
import { BookmarksProvider } from "@/lib/bookmarks";
import { ToastProvider, Toaster } from "@/lib/toast";
import { IconSidebar } from "@/components/IconSidebar";
import { SurahSidebar, MobileSurahDrawer } from "@/components/SurahSidebar";
import { MobileTopbar } from "@/components/MobileTopbar";
import { FontSettingsPanel } from "@/components/FontSettingsPanel";
import { SearchModal } from "@/components/SearchModal";
import { BookmarksModal } from "@/components/BookmarksModal";
import { AudioModal } from "@/components/AudioModal";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  variable: "--font-amiri-quran",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quran Mazid — Read, Study, and Learn The Quran",
  description:
    "Read the Holy Quran with translations, audio recitation, and customizable Arabic fonts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${amiriQuran.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <UIProvider>
          <SettingsProvider>
            <BookmarksProvider>
              <ToastProvider>
                <div className="flex min-h-screen">
                  <IconSidebar />
                  <SurahSidebar />
                  <main className="flex min-w-0 flex-1 flex-col">
                    <MobileTopbar />
                    <div className="flex-1">{children}</div>
                  </main>
                </div>
                <MobileSurahDrawer />
                <FontSettingsPanel />
                <SearchModal />
                <BookmarksModal />
                <AudioModal />
                <Toaster />
              </ToastProvider>
            </BookmarksProvider>
          </SettingsProvider>
        </UIProvider>
      </body>
    </html>
  );
}
