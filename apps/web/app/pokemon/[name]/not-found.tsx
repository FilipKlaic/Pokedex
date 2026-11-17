import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Pokémon not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        PokéAPI doesn&apos;t know a Pokémon by that name. Check the spelling and try again.
      </p>
      <Link href="/pokedex" className="text-blue-600 hover:underline dark:text-blue-400">
        ← Back to your Pokédex
      </Link>
    </div>
  );
}
