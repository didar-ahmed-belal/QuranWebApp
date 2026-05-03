import type { Metadata } from "next";
import { BookmarksClient } from "./BookmarksClient";

export const metadata: Metadata = {
  title: "Bookmarks — Quran Mazid",
  description: "Your saved ayahs and folders.",
};

export default function BookmarksPage() {
  return <BookmarksClient />;
}
