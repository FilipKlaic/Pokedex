import type { State } from "../state.js";

export async function commandPokedex(state: State): Promise<void> {
  const names = await state.pokedex.listNames();

  if (names.length === 0) {
    console.log("Your Pokédex is empty. Go catch some Pokémon!");
    return;
  }

  console.log(`Your Pokédex (${names.length}):`);
  for (const name of names) {
    console.log(` - ${name}`);
  }
}
