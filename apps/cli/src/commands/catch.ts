import type { State } from "../state.js";

const DEFAULT_BASE_EXPERIENCE = 100;
const MIN_CATCH_CHANCE = 0.05;
const MAX_CATCH_CHANCE = 0.9;

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
  const chance = catchChance(pokemon.base_experience ?? DEFAULT_BASE_EXPERIENCE);

  console.log(`Throwing a Pokéball at ${pokemon.name}... (${Math.round(chance * 100)}% chance)`);

  if (Math.random() < chance) {
    await state.pokedex.add(pokemon);
    console.log(`${pokemon.name} was caught!`);
  } else {
    console.log(`${pokemon.name} escaped!`);
  }
}

function catchChance(baseExperience: number): number {
  const chance = 1 - baseExperience / 400;
  return Math.min(MAX_CATCH_CHANCE, Math.max(MIN_CATCH_CHANCE, chance));
}
