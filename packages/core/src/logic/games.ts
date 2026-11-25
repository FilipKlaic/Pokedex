import type { Pokemon } from "../api/types.js";

/** One version of a game, e.g. FireRed in "FireRed / LeafGreen". */
export type GameVersion = {
  name: string;
  /** Official artwork ID of the Pokémon on the box, e.g. 6 for Charizard. */
  mascot: number;
  /** The version's color, used for the card background. */
  color: string;
};

/** A game you can build teams for. Versions sold as a pair are one game. */
export type Game = {
  /** PokéAPI version group, e.g. "firered-leafgreen". Stored in Team.versionGroup. */
  id: string;
  name: string;
  generation: number;
  region: string;
  versions: GameVersion[];
  /**
   * Every version group whose data counts for this game: the game itself plus its
   * DLC, which PokéAPI lists separately (e.g. "the-isle-of-armor").
   */
  versionGroups: string[];
};

const game = (
  id: string,
  generation: number,
  region: string,
  versions: GameVersion[],
  dlcVersionGroups: string[] = [],
): Game => ({
  id,
  name: versions.map((version) => version.name).join(" / "),
  generation,
  region,
  versions,
  versionGroups: [id, ...dlcVersionGroups],
});

/** The main-series games, newest first. */
export const GAMES: readonly Game[] = [
  game("legends-za", 9, "Kalos", [{ name: "Legends: Z-A", mascot: 718, color: "#2FAE6B" }], [
    "mega-dimension",
  ]),
  game(
    "scarlet-violet",
    9,
    "Paldea",
    [
      { name: "Scarlet", mascot: 1007, color: "#E0352B" },
      { name: "Violet", mascot: 1008, color: "#7A3FB5" },
    ],
    ["the-teal-mask", "the-indigo-disk"],
  ),
  game("legends-arceus", 8, "Hisui", [{ name: "Legends: Arceus", mascot: 493, color: "#C9A66B" }]),
  game("brilliant-diamond-shining-pearl", 8, "Sinnoh", [
    { name: "Brilliant Diamond", mascot: 483, color: "#4F8FE0" },
    { name: "Shining Pearl", mascot: 484, color: "#E07AA8" },
  ]),
  game(
    "sword-shield",
    8,
    "Galar",
    [
      { name: "Sword", mascot: 888, color: "#0F9BD7" },
      { name: "Shield", mascot: 889, color: "#C21F6A" },
    ],
    ["the-isle-of-armor", "the-crown-tundra"],
  ),
  game("lets-go-pikachu-lets-go-eevee", 7, "Kanto", [
    { name: "Let's Go, Pikachu!", mascot: 25, color: "#F5C518" },
    { name: "Let's Go, Eevee!", mascot: 133, color: "#B07A44" },
  ]),
  game("ultra-sun-ultra-moon", 7, "Alola", [
    { name: "Ultra Sun", mascot: 10155, color: "#F26C1A" },
    { name: "Ultra Moon", mascot: 10156, color: "#5A3FA8" },
  ]),
  game("sun-moon", 7, "Alola", [
    { name: "Sun", mascot: 791, color: "#F28C28" },
    { name: "Moon", mascot: 792, color: "#6B4FBF" },
  ]),
  game("omega-ruby-alpha-sapphire", 6, "Hoenn", [
    { name: "Omega Ruby", mascot: 10078, color: "#B3182D" },
    { name: "Alpha Sapphire", mascot: 10077, color: "#1D4FA8" },
  ]),
  game("x-y", 6, "Kalos", [
    { name: "X", mascot: 716, color: "#1D5FB8" },
    { name: "Y", mascot: 717, color: "#C4243A" },
  ]),
  game("black-2-white-2", 5, "Unova", [
    { name: "Black 2", mascot: 10022, color: "#2F3B4C" },
    { name: "White 2", mascot: 10023, color: "#C9CED6" },
  ]),
  game("black-white", 5, "Unova", [
    { name: "Black", mascot: 643, color: "#2B2B2B" },
    { name: "White", mascot: 644, color: "#D9D9D9" },
  ]),
  game("heartgold-soulsilver", 4, "Johto", [
    { name: "HeartGold", mascot: 250, color: "#D4A72C" },
    { name: "SoulSilver", mascot: 249, color: "#A9B1BC" },
  ]),
  game("platinum", 4, "Sinnoh", [{ name: "Platinum", mascot: 10007, color: "#8E8F99" }]),
  game("diamond-pearl", 4, "Sinnoh", [
    { name: "Diamond", mascot: 483, color: "#6C8FD6" },
    { name: "Pearl", mascot: 484, color: "#E39AB8" },
  ]),
  game("firered-leafgreen", 3, "Kanto", [
    { name: "FireRed", mascot: 6, color: "#F05A28" },
    { name: "LeafGreen", mascot: 3, color: "#5BAE3A" },
  ]),
  game("emerald", 3, "Hoenn", [{ name: "Emerald", mascot: 384, color: "#1E9E5A" }]),
  game("ruby-sapphire", 3, "Hoenn", [
    { name: "Ruby", mascot: 383, color: "#C0182A" },
    { name: "Sapphire", mascot: 382, color: "#1F4FB4" },
  ]),
  game("crystal", 2, "Johto", [{ name: "Crystal", mascot: 245, color: "#5BC8DC" }]),
  game("gold-silver", 2, "Johto", [
    { name: "Gold", mascot: 250, color: "#C9A227" },
    { name: "Silver", mascot: 249, color: "#A7AFB8" },
  ]),
  game("yellow", 1, "Kanto", [{ name: "Yellow", mascot: 25, color: "#F5C518" }]),
  game("red-blue", 1, "Kanto", [
    { name: "Red", mascot: 6, color: "#E53935" },
    { name: "Blue", mascot: 9, color: "#1E63D6" },
  ]),
];

/** The game with this ID, or undefined if it isn't in GAMES. */
export function findGame(id: string): Game | undefined {
  return GAMES.find((entry) => entry.id === id);
}

/**
 * The IDs of the games this Pokémon appears in. PokéAPI lists the moves a Pokémon
 * learns per game, and only for games it's actually in, so that data doubles as
 * a precise "is it in this game?" check (e.g. Emboar isn't in Sword/Shield, and
 * Alolan Raichu only exists from Sun/Moon on).
 *
 * A few special forms have no move data at all. We can't tell for those, so they
 * count as being in every game.
 */
export function gamesWithPokemon(pokemon: Pick<Pokemon, "moves">): string[] {
  const versionGroups = new Set(
    pokemon.moves.flatMap((move) =>
      move.version_group_details.map((detail) => detail.version_group.name),
    ),
  );
  if (versionGroups.size === 0) {
    return GAMES.map((entry) => entry.id);
  }
  return GAMES.filter((entry) => entry.versionGroups.some((group) => versionGroups.has(group))).map(
    (entry) => entry.id,
  );
}
