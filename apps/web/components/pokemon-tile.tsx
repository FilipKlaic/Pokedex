import Image from "next/image";
import { artworkURL, formatName, formatNumber } from "@/lib/format";
import { TypeBadge } from "./type-badge";

type PokemonTileProps = {
  id: number;
  name: string;
  caught: boolean;
  /** Shown under the name when known (e.g. on My Pokémon). */
  types?: string[];
};

export function PokemonTile({ id, name, caught, types }: PokemonTileProps) {
  return (
    <article className="group relative flex h-full flex-col items-center rounded-2xl border border-zinc-200 bg-white p-3 pb-4 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex w-full items-center justify-between">
        <span className="font-mono text-[11px] text-zinc-400">{formatNumber(id)}</span>
        {caught && (
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
            title="In your Pokédex"
          >
            ✓<span className="sr-only">In your Pokédex</span>
          </span>
        )}
      </div>
      <div className="my-1 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800/60">
        <Image
          src={artworkURL(id)}
          alt=""
          width={96}
          height={96}
          className="h-20 w-20 object-contain transition duration-200 group-hover:scale-110"
        />
      </div>
      <h2 className="text-center text-sm font-medium leading-tight">{formatName(name)}</h2>
      {types && types.length > 0 && (
        <div className="mt-2 flex gap-1">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      )}
    </article>
  );
}
