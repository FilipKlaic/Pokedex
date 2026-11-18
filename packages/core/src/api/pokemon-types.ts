export const POKEMON_TYPES = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPES)[number];

export function isPokemonType(value: string): value is PokemonTypeName {
    return (POKEMON_TYPES as readonly string[]).includes(value);
}