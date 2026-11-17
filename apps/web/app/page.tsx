import Link from "next/link";
import { Suspense } from "react";
import { GenerationTabs } from "@/components/generation-tabs";
import { PokemonGrid } from "@/components/pokemon-grid";
import { getGenerationPokemon, getGenerations } from "@/lib/pokeapi";
import { listCaughtNames } from "@/lib/pokedex";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">All Pokémon</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Pick a generation, then click any Pokémon for its stats, type matchups and evolutions. A ✓
        means it&apos;s in your Pokédex.
      </p>
      <Suspense fallback={<p className="text-zinc-500">Loading Pokémon…</p>}>
        <GenerationBrowser searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function GenerationBrowser({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { gen } = await searchParams;
  const generation = parseGeneration(gen);

  const [generations, pokemon, caughtNames] = await Promise.all([
    getGenerations(),
    getGenerationPokemon(generation),
    listCaughtNames(),
  ]);

  return (
    <>
      <GenerationTabs generations={generations} active={generation} />
      {pokemon ? (
        <>
          <p className="mb-4 text-sm text-zinc-500">{pokemon.length} Pokémon</p>
          <PokemonGrid pokemon={pokemon} caughtNames={caughtNames} />
        </>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">
          There&apos;s no generation {generation}.{" "}
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Gen I
          </Link>
        </p>
      )}
    </>
  );
}

// "?gen=3" → 3. Anything missing or invalid ("?gen=abc", "?gen=-1") → 1.
function parseGeneration(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const generation = Number(raw);
  return Number.isInteger(generation) && generation >= 1 ? generation : 1;
}
