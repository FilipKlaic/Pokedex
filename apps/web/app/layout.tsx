import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SearchBox } from "@/components/search-box";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Your personal Pokédex",
};

const NAV_LINK_STYLE =
  "text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              Pokédex
            </Link>
            <Link href="/" className={NAV_LINK_STYLE}>
              All Pokémon
            </Link>
            <Link href="/pokedex" className={NAV_LINK_STYLE}>
              My Pokémon
            </Link>
            <SearchBox />
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
