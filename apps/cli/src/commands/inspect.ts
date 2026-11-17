import type { Pokemon } from "@pokedex/core/api/types";
import type { State } from "../state.js";

export async function commandInspect(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.log("Usage: inspect <pokemon>");
    return;
  }

  const pokemonName = args[0];
  const pokemon = await state.pokedex.get(pokemonName);

  if (!pokemon) {
    console.log(`You haven't caught ${pokemonName} yet.`);
    return;
  }

  printPokemon(pokemon);
}

function printPokemon(pokemon: Pokemon): void {
  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height / 10} m`);
  console.log(`Weight: ${pokemon.weight / 10} kg`);

  console.log("Stats:");
  for (const { stat, base_stat } of pokemon.stats) {
    console.log(`  - ${stat.name}: ${base_stat}`);
  }

  console.log("Types:");
  const typeNames = pokemon.types.map((t) => t.type.name);
  console.log(`  ${typeNames.join(", ")}`);
}
