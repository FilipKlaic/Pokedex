import Link from "next/link";
import type { PokemonSummary } from "@/lib/pokeapi";
import { PokemonTile } from "./pokemon-tile";

type PokemonGridProps = {
  pokemon: PokemonSummary[];
  caughtNames: string[];
};

export function PokemonGrid({ pokemon, caughtNames }: PokemonGridProps) {
  const caught = new Set(caughtNames);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {pokemon.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/pokemon/${name}`}>
            <PokemonTile id={id} name={name} caught={caught.has(name)} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
