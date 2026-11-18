import Link from "next/link";
import type { PokemonSummary } from "@/lib/pokeapi";
import { PokemonTile } from "./pokemon-tile";

export const GRID_CLASSES = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

type PokemonGridProps = {
  pokemon: PokemonSummary[];
  caughtNames: string[];
};

export function PokemonGrid({ pokemon, caughtNames }: PokemonGridProps) {
  const caught = new Set(caughtNames);

  return (
    <ul className={GRID_CLASSES}>
      {pokemon.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/pokemon/${name}`} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
            <PokemonTile id={id} name={name} caught={caught.has(name)} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
