import Link from "next/link";
import type { GenerationSummary } from "@/lib/pokeapi";

const ACTIVE_STYLE = "bg-black text-white dark:bg-white dark:text-black";
const INACTIVE_STYLE =
  "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

type GenerationTabsProps = {
  generations: GenerationSummary[];
  active: number;
};

export function GenerationTabs({ generations, active }: GenerationTabsProps) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Generations">
      {generations.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={`/?gen=${id}`}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-sm ${isActive ? ACTIVE_STYLE : INACTIVE_STYLE}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
