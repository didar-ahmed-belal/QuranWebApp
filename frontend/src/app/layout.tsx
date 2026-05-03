import type { Metadata } from "next";
import { Amiri, Amiri_Quran, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { SettingsProvider } from "@/lib/settings";
import { UIProvider } from "@/lib/ui";
import { BookmarksProvider } from "@/lib/bookmarks";
import { ToastProvider, Toaster } from "@/lib/toast";
import { TopHeader } from "@/components/TopHeader";
import { AppShell } from "@/components/AppShell";
import { AudioPlayerBar } from "@/components/AudioPlayerBar";
import { SearchModal } from "@/components/SearchModal";

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
      data-theme="light"
      className={`${amiri.variable} ${amiriQuran.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <UIProvider>
            <SettingsProvider>
              <BookmarksProvider>
                <ToastProvider>
                  <div className="flex min-h-screen flex-col">
                    <TopHeader />
                    <AppShell>{children}</AppShell>
                  </div>
                  <SearchModal />
                  <AudioPlayerBar />
                  <Toaster />
                </ToastProvider>
              </BookmarksProvider>
            </SettingsProvider>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
