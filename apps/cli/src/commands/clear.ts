import type { State } from "../state.js"

export async function commandClear(state: State): Promise<void> {
    console.clear();
}