import Link from "next/link";
import { Suspense } from "react";
import { GenerationTabs } from "@/components/generation-tabs";
import { PokemonGrid } from "@/components/pokemon-grid";
import { GridSkeleton } from "@/components/skeletons";
import { getGenerationPokemon, getGenerations } from "@/lib/pokeapi";
import { listCaughtNames } from "@/lib/pokedex";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Browse</h1>
      <p className="mb-6 mt-1 text-zinc-500">
        Every Pokémon, one region at a time. Pick one for stats, type defenses and evolutions.
      </p>
      <Suspense
        fallback={
          <>
            <div className="mb-6 h-11 w-full max-w-2xl animate-pulse rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
            <GridSkeleton />
          </>
        }
      >
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

  if (!pokemon) {
    return (
      <>
        <GenerationTabs generations={generations} active={generation} />
        <p className="text-zinc-600 dark:text-zinc-400">
          There&apos;s no generation {generation}.{" "}
          <Link href="/" className="font-medium underline underline-offset-2">
            Back to the first one
          </Link>
        </p>
      </>
    );
  }

  const current = generations.find((entry) => entry.id === generation);
  const caught = new Set(caughtNames);
  const caughtHere = pokemon.filter((entry) => caught.has(entry.name)).length;

  return (
    <>
      <GenerationTabs generations={generations} active={generation} />
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {current?.region}{" "}
          <span className="text-sm font-normal text-zinc-500">{current?.label}</span>
        </h2>
        <p className="text-sm text-zinc-500">
          <span className="font-medium text-zinc-900 dark:text-white">{caughtHere}</span> /{" "}
          {pokemon.length} caught
        </p>
      </div>
      <PokemonGrid pokemon={pokemon} caughtNames={caughtNames} />
    </>
  );
}

// "?gen=3" → 3. Anything missing or invalid ("?gen=abc", "?gen=-1") → 1.
function parseGeneration(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const generation = Number(raw);
  return Number.isInteger(generation) && generation >= 1 ? generation : 1;
}
