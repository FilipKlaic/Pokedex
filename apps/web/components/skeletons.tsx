import { GRID_CLASSES } from "./pokemon-grid";

/** Grey placeholder tiles, shown while a grid of Pokémon loads. */
export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <ul className={GRID_CLASSES} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="flex h-44 animate-pulse flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="h-3 w-10 self-start rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
        </li>
      ))}
    </ul>
  );
}

/** Placeholder for the detail page while it loads. */
export function DetailSkeleton() {
  const block = "animate-pulse rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-8" />
      <div className={`${block} h-80`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${block} h-72`} />
        <div className={`${block} h-72`} />
      </div>
    </div>
  );
}
