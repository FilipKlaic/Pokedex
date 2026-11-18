import Form from "next/form";
import { Suspense } from "react";
import { isPokemonType, type PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import { searchByName } from "@pokedex/core/logic/search";
import { PokemonGrid } from "@/components/pokemon-grid";
import { TypeFilter } from "@/components/type-filter";
import { getAllPokemon, getPokemonOfType } from "@/lib/pokeapi";
import { listCaughtNames } from "@/lib/pokedex";

const MAX_RESULTS = 200;

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Search</h1>
      <Suspense fallback={<p className="text-zinc-500">Searching…</p>}>
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
      <Form action="/search" className="mb-4 flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Name, e.g. char"
          aria-label="Pokémon name"
          className="w-full max-w-sm rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400"
        />
        {/* Keeps the type filter when you search for a new name. */}
        {activeType && <input type="hidden" name="type" value={activeType} />}
        <button
          type="submit"
          className="rounded-full bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Search
        </button>
      </Form>

      <TypeFilter query={query} active={activeType} />

      <div className="mt-6">
        {query === "" && activeType === null ? (
          <p className="text-zinc-600 dark:text-zinc-400">
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
        <p className="text-zinc-600 dark:text-zinc-400">No Pokémon match these filters.</p>
      )}
    </>
  );
}
