import Link from "next/link";
import { Suspense } from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { listCaughtPokemon } from "@/lib/pokedex";

export default function PokedexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Pokédex</h1>
      <Suspense fallback={<p className="text-zinc-500">Loading your Pokémon…</p>}>
        <CaughtPokemonGrid />
      </Suspense>
    </main>
  );
}

async function CaughtPokemonGrid() {
  const caught = await listCaughtPokemon();

  if (caught.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Your Pokédex is empty. Catch some Pokémon in the terminal with <code>npm run cli</code>.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {caught.map((pokemon) => (
        <li key={pokemon.id}>
          <Link href={`/pokemon/${pokemon.name}`}>
            <PokemonCard pokemon={pokemon} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
