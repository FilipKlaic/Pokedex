"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Browse" },
  { href: "/pokedex", label: "My Pokémon" },
];

/** The header links, with the current page highlighted. */
export function HeaderNav() {
  return <HeaderNavLinks pathname={usePathname()} />;
}

/**
 * The links themselves. Rendered without a pathname (nothing highlighted) as the
 * Suspense fallback, because the pathname of dynamic pages is only known per request.
 */
export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map(({ href, label }) => {
        const isActive =
          pathname !== null && (href === "/" ? pathname === "/" : pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
