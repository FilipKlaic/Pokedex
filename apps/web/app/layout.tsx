import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { HeaderNav, HeaderNavLinks } from "@/components/nav-link";
import { SearchBox } from "@/components/search-box";
import { theme } from "@/lib/theme";
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
  description: "A clean Pokédex: stats, type defenses and evolutions at a glance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:gap-4">
              <Link href="/" className="mr-1 flex items-center gap-2 font-semibold tracking-tight">
                <span aria-hidden className="h-5 w-5 rounded-full border-[5px] border-red-500" />
                <span className="hidden sm:inline">Pokédex</span>
              </Link>
              <Suspense fallback={<HeaderNavLinks pathname={null} />}>
                <HeaderNav />
              </Suspense>
              <SearchBox />
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
            Data from{" "}
            <a href="https://pokeapi.co" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white">
              PokéAPI
            </a>
            . A non-commercial fan project, not affiliated with Nintendo.
          </footer>
        </MantineProvider>
      </body>
    </html>
  );
}
