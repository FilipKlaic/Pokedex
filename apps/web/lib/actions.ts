"use server";

import { refresh } from "next/cache";
import { catchChance, rollCatch } from "@pokedex/core/logic/catching";
import { getPokemon } from "./pokeapi";
import { addToPokedex, isCaught } from "./pokedex";

export type CatchResult = {
  outcome: "caught" | "escaped" | "error";
  message: string;
} | null;

export async function throwPokeball(
  pokemonName: string,
  _previous: CatchResult,
  _formData: FormData,
): Promise<CatchResult> {
  const pokemon = await getPokemon(pokemonName);
  if (!pokemon) {
    return { outcome: "error", message: `There's no Pokémon called "${pokemonName}".` };
  }

  if (await isCaught(pokemon.name)) {
    refresh();
    return { outcome: "caught", message: `${pokemon.name} is already in your Pokédex.` };
  }

  if (!rollCatch(catchChance(pokemon.base_experience))) {
    return { outcome: "escaped", message: `Oh no! ${pokemon.name} broke free. Try again!` };
  }

  await addToPokedex(pokemon);
  refresh();
  return { outcome: "caught", message: `Gotcha! ${pokemon.name} was caught!` };
}
