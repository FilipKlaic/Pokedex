import type { State } from "../state.js";

export async function commandMap(state: State): Promise<void> {
  await showLocations(state, state.nextLocationsURL);
}

export async function commandMapBack(state: State): Promise<void> {
  if (!state.prevLocationsURL) {
    console.log("You're on the first page.");
    return;
  }
  await showLocations(state, state.prevLocationsURL);
}

async function showLocations(state: State, pageURL: string | null): Promise<void> {
  const locations = await state.pokeAPI.fetchLocations(pageURL);

  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;

  for (const location of locations.results) {
    console.log(location.name);
  }
}
