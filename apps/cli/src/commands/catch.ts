import { catchChance, rollCatch } from "@pokedex/core/logic/catching";
import type { State } from "../state.js";

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.log("Usage: catch <pokemon>");
    return;
  }

  const pokemonName = args[0];

  if (await state.pokedex.has(pokemonName)) {
    console.log(`You already caught ${pokemonName}!`);
    return;
  }

  const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);
  const species = await state.pokeAPI.fetchSpecies(pokemon.species.name);
  const chance = catchChance(species.capture_rate);

  console.log(`Throwing a Pokéball at ${pokemon.name}... (${Math.round(chance * 100)}% chance)`);

  if (rollCatch(chance)) {
    await state.pokedex.add(pokemon);
    console.log(`${pokemon.name} was caught!`);
  } else {
    console.log(`${pokemon.name} escaped!`);
  }
}
