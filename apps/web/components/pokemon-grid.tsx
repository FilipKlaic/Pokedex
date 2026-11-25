import Link from "next/link";
import type { PokemonSummary } from "@/lib/pokeapi";
import { PokemonTile } from "./pokemon-tile";

export const GRID_CLASSES = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

type PokemonGridProps = {
  pokemon: PokemonSummary[];
  /** Pokédex numbers of the Pokémon on the visitor's teams; their tiles get a ✓. */
  teamPokemonIds: number[];
};

export function PokemonGrid({ pokemon, teamPokemonIds }: PokemonGridProps) {
  const onTeams = new Set(teamPokemonIds);

  return (
    <ul className={GRID_CLASSES}>
      {pokemon.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/pokemon/${name}`} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
            <PokemonTile id={id} name={name} onTeam={onTeams.has(id)} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
