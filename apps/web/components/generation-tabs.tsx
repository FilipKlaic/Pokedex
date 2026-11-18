import Link from "next/link";
import type { GenerationSummary } from "@/lib/pokeapi";

type GenerationTabsProps = {
  generations: GenerationSummary[];
  active: number;
};

export function GenerationTabs({ generations, active }: GenerationTabsProps) {
  return (
    <nav
      aria-label="Generations"
      className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
    >
      <div className="inline-flex gap-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {generations.map(({ id, label, region }) => {
          const isActive = id === active;
          return (
            <Link
              key={id}
              href={`/?gen=${id}`}
              aria-current={isActive ? "page" : undefined}
              title={`${label} · ${region}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-900 font-medium text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              {region}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
