"use server";

import { refresh } from "next/cache";
import { catchChance, rollCatch } from "@pokedex/core/logic/catching";
import { formatName } from "./format";
import { getPokemon } from "./pokeapi";
import { addToPokedex, isCaught } from "./pokedex";

export type CatchResult = {
  outcome: "caught" | "escaped" | "error";
  message: string;
} | null;

/**
 * Server Action: throws a Pokéball at a Pokémon. Runs on the server when the
 * catch button's form is submitted, and returns a message for the button to show.
 */
export async function throwPokeball(
  pokemonName: string,
  _previous: CatchResult,
  _formData: FormData,
): Promise<CatchResult> {
  // Anyone can call a Server Action with any input, so check it on the server.
  const pokemon = await getPokemon(pokemonName);
  if (!pokemon) {
    return { outcome: "error", message: `There's no Pokémon called "${pokemonName}".` };
  }
  const displayName = formatName(pokemon.name);

  if (await isCaught(pokemon.name)) {
    refresh();
    return { outcome: "caught", message: `${displayName} is already in your Pokédex.` };
  }

  if (!rollCatch(catchChance(pokemon.base_experience))) {
    return { outcome: "escaped", message: `Oh no! ${displayName} broke free. Try again!` };
  }

  await addToPokedex(pokemon);
  refresh();
  return { outcome: "caught", message: `Gotcha! ${displayName} was caught!` };
}
