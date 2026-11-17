import { Suspense } from "react";
import { searchByName } from "@pokedex/core/logic/search";
import { PokemonGrid } from "@/components/pokemon-grid";
import { getAllPokemon } from "@/lib/pokeapi";
import { listCaughtNames } from "@/lib/pokedex";

const MAX_RESULTS = 60;

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<p className="text-zinc-500">Searching…</p>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  if (query === "") {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Type a name in the search box at the top, for example &quot;char&quot;.
      </p>
    );
  }

  const [allPokemon, caughtNames] = await Promise.all([getAllPokemon(), listCaughtNames()]);
  const results = searchByName(allPokemon, query, MAX_RESULTS);

  return (
    <>
      <h1 className="mb-1 text-3xl font-bold">Results for &ldquo;{query}&rdquo;</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {results.length === MAX_RESULTS
          ? `Showing the first ${MAX_RESULTS} matches. Type more letters to narrow it down.`
          : `${results.length} ${results.length === 1 ? "match" : "matches"}`}
      </p>
      {results.length > 0 ? (
        <PokemonGrid pokemon={results} caughtNames={caughtNames} />
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">No Pokémon has a name like that.</p>
      )}
    </>
  );
}
