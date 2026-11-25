import Image from "next/image";
import type { Game } from "@pokedex/core/logic/games";
import { artworkURL } from "@/lib/format";

type GameArtProps = {
  game: Game;
  /** Sets the size, e.g. "aspect-[16/10] w-full" or "h-14 w-24". */
  className?: string;
  /** Pixel size to load the artwork at. */
  imageSize?: number;
};

/**
 * A game's "cover": the Pokémon on its box, on a gradient of the version colors
 * (e.g. Charizard and Venusaur on red → green for FireRed / LeafGreen).
 */
export function GameArt({ game, className = "", imageSize = 160 }: GameArtProps) {
  const [first, second] = game.versions.map((version) => version.color);
  const background = second
    ? `linear-gradient(120deg, ${first} 25%, ${second} 75%)`
    : `linear-gradient(120deg, ${first}, color-mix(in srgb, ${first} 55%, black))`;

  return (
    <div aria-hidden className={`relative overflow-hidden ${className}`} style={{ background }}>
      {/* A soft light from the top, so the artwork stands out from the gradient. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.35),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 top-[8%] flex items-end justify-center">
        {game.versions.map((version) => (
          <Image
            key={version.name}
            src={artworkURL(version.mascot)}
            alt=""
            width={imageSize}
            height={imageSize}
            className="h-full w-auto max-w-[50%] object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
          />
        ))}
      </div>
    </div>
  );
}
