import type { State } from "../state.js";

export async function commandExit(state: State): Promise<void> {
  console.log("Closing the Pokedex... Goodbye!");
  state.rl.close();
  await state.db.$disconnect();
  process.exit(0);
}
