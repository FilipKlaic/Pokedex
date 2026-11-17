import { defensiveMultipliers, groupByMultiplier } from "@pokedex/core/logic/matchups";
import type { State } from "../state.js";

const GROUP_LABELS: [multiplier: number, label: string][] = [
  [4, "4× weak to:"],
  [2, "2× weak to:"],
  [0.5, "½× resists:"],
  [0.25, "¼× resists:"],
  [0, "Immune to:"],
];

export async function commandWeakness(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.log("Usage: weakness <pokemon>");
    return;
  }

  const pokemon = await state.pokeAPI.fetchPokemon(args[0]);
  const typeNames = pokemon.types.map((t) => t.type.name);

  const typeInfos = await Promise.all(
    typeNames.map((typeName) => state.pokeAPI.fetchType(typeName)),
  );

  const groups = groupByMultiplier(defensiveMultipliers(typeInfos));

  console.log(`${pokemon.name} (${typeNames.join(", ")})`);
  for (const [multiplier, label] of GROUP_LABELS) {
    const names = groups.get(multiplier);
    if (names) {
      console.log(`  ${label.padEnd(14)}${names.sort().join(", ")}`);
    }
  }
}
