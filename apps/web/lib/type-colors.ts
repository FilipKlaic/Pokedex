import type { PokemonTypeName } from "@pokedex/core/api/pokemon-types";

// One color per type. Used for badges, the detail page tint and the defense chart.
const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const FALLBACK_COLOR = "#9CA3AF";

export function typeColor(type: string): string {
  return (TYPE_COLORS as Record<string, string>)[type] ?? FALLBACK_COLOR;
}

/** Dark text on light colors, white text on dark ones, so badges stay readable. */
export function textColorOn(hex: string): string {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return brightness > 0.62 ? "#18181b" : "#ffffff";
}
