import Image from "next/image";

// PokéAPI's sprite files are named by Pokédex number, so we can build the URL
// from the id alone, without fetching each Pokémon's full data.
function spriteURL(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

type PokemonTileProps = {
  id: number;
  name: string;
  caught: boolean;
};

export function PokemonTile({ id, name, caught }: PokemonTileProps) {
  return (
    <article className="relative flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {caught && (
        <span
          className="absolute right-2 top-2 rounded-full bg-emerald-500 px-1.5 text-xs font-bold text-white"
          title="In your Pokédex"
        >
          ✓
        </span>
      )}
      <Image
        src={spriteURL(id)}
        alt={name}
        width={96}
        height={96}
        className="[image-rendering:pixelated]"
      />
      <p className="text-xs text-zinc-500">#{String(id).padStart(4, "0")}</p>
      <h2 className="text-sm font-semibold capitalize">{name}</h2>
    </article>
  );
}
