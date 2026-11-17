import Image from "next/image";
import type { Pokemon } from "@pokedex/core/api/types";
import { TypeBadge } from "./type-badge";

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const sprite = pokemon.sprites.front_default;

  return (
    <article className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {sprite ? (
        <Image
          src={sprite}
          alt={pokemon.name}
          width={96}
          height={96}
          className="[image-rendering:pixelated]"
        />
      ) : (
        <div className="h-24 w-24" />
      )}
      <p className="text-xs text-zinc-500">#{String(pokemon.id).padStart(4, "0")}</p>
      <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
      <div className="mt-2 flex gap-1">
        {pokemon.types.map(({ type }) => (
          <TypeBadge key={type.name} type={type.name} />
        ))}
      </div>
    </article>
  );
}
