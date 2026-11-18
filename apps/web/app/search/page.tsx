import Form from "next/form";
import { Suspense } from "react";
import { isPokemonType, type PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import { searchByName } from "@pokedex/core/logic/search";
import { PokemonGrid } from "@/components/pokemon-grid";
import { GridSkeleton } from "@/components/skeletons";
import { TypeFilter } from "@/components/type-filter";
import { getAllPokemon, getPokemonOfType } from "@/lib/pokeapi";
import { listCaughtNames } from "@/lib/pokedex";

const MAX_RESULTS = 200;

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <p className="mb-6 mt-1 text-zinc-500">Find Pokémon by name, by type, or both.</p>
      <Suspense fallback={<GridSkeleton count={12} />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q, type } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const activeType: PokemonTypeName | null =
    typeof type === "string" && isPokemonType(type) ? type : null;

  return (
    <>
      <Form action="/search" className="mb-4 flex max-w-lg gap-2">
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Name, e.g. char"
          aria-label="Pokémon name"
          className="h-11 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600"
        />
        {/* Keeps the type filter when you search for a new name. */}
        {activeType && <input type="hidden" name="type" value={activeType} />}
        <button
          type="submit"
          className="h-11 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          Search
        </button>
      </Form>

      <TypeFilter query={query} active={activeType} />

      <div className="mt-8">
        {query === "" && activeType === null ? (
          <p className="text-sm text-zinc-500">
            Type a name, pick a type, or both. For example &quot;char&quot; + fire.
          </p>
        ) : (
          <Results query={query} type={activeType} />
        )}
      </div>
    </>
  );
}

async function Results({ query, type }: { query: string; type: PokemonTypeName | null }) {
  const [allPokemon, ofType, caughtNames] = await Promise.all([
    getAllPokemon(),
    type ? getPokemonOfType(type) : null,
    listCaughtNames(),
  ]);

  // Start with every Pokémon, then narrow it down by each active filter.
  let candidates = allPokemon;
  if (ofType) {
    const namesOfType = new Set(ofType.map((pokemon) => pokemon.name));
    candidates = candidates.filter((pokemon) => namesOfType.has(pokemon.name));
  }

  const results =
    query === "" ? candidates.slice(0, MAX_RESULTS) : searchByName(candidates, query, MAX_RESULTS);

  return (
    <>
      <p className="mb-4 text-sm text-zinc-500">
        {results.length === MAX_RESULTS
          ? `Showing the first ${MAX_RESULTS} matches. Narrow it down with a name or a type.`
          : `${results.length} ${results.length === 1 ? "match" : "matches"}`}
      </p>
      {results.length > 0 ? (
        <PokemonGrid pokemon={results} caughtNames={caughtNames} />
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No Pokémon match these filters.
        </div>
      )}
    </>
  );
}
