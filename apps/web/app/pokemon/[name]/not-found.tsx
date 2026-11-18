import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="font-mono text-sm text-zinc-400">404</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">Pokémon not found</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        There&apos;s no Pokémon by that name. Check the spelling, or try the search.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link
          href="/search"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900"
        >
          Search
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          Browse all
        </Link>
      </div>
    </div>
  );
}
