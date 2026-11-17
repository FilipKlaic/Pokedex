import type { State } from "../state.js";

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.log("Usage: explore <location-area>");
    return;
  }

  const areaName = args[0];
  console.log(`Exploring ${areaName}...`);

  const area = await state.pokeAPI.fetchLocationArea(areaName);

  if (area.pokemon_encounters.length === 0) {
    console.log("No Pokémon found here.");
    return;
  }

  console.log("Found Pokémon:");
  for (const encounter of area.pokemon_encounters) {
    console.log(` - ${encounter.pokemon.name}`);
  }
}
