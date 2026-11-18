import Link from "next/link";
import { Suspense } from "react";
import { GRID_CLASSES } from "@/components/pokemon-grid";
import { PokemonTile } from "@/components/pokemon-tile";
import { GridSkeleton } from "@/components/skeletons";
import { listCaughtPokemon } from "@/lib/pokedex";

export default function PokedexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">My Pokémon</h1>
      <Suspense
        fallback={
          <>
            <div className="mb-6 mt-2 h-5 w-48 animate-pulse rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <GridSkeleton count={6} />
          </>
        }
      >
        <CaughtPokemonGrid />
      </Suspense>
    </main>
  );
}

async function CaughtPokemonGrid() {
  const caught = await listCaughtPokemon();

  if (caught.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="font-medium">Your Pokédex is empty</p>
        <p className="mt-1 text-sm text-zinc-500">
          Open any Pokémon and press <span className="font-medium">Catch</span> to add it here.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900"
        >
          Browse Pokémon
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 mt-1 text-zinc-500">
        {caught.length} Pokémon caught, in Pokédex order.
      </p>
      <ul className={GRID_CLASSES}>
        {caught.map((pokemon) => (
          <li key={pokemon.id}>
            <Link
              href={`/pokemon/${pokemon.name}`}
              className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              <PokemonTile
                id={pokemon.id}
                name={pokemon.name}
                caught
                types={pokemon.types.map((t) => t.type.name)}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
