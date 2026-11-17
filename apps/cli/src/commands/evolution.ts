import type { ChainLink } from "@pokedex/core/api/types";
import { describeCondition } from "@pokedex/core/logic/evolution";
import type { State } from "../state.js";

export async function commandEvolution(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.log("Usage: evolution <pokemon>");
    return;
  }

  const species = await state.pokeAPI.fetchSpecies(args[0]);

  if (!species.evolution_chain) {
    console.log(`${species.name} has no evolution data.`);
    return;
  }

  const evolution = await state.pokeAPI.fetchEvolutionChain(species.evolution_chain.url);
  const root = evolution.chain;

  if (root.evolves_to.length === 0) {
    console.log(`${species.name} does not evolve.`);
    return;
  }

  const rootMarker = root.species.name === species.name ? " ◀" : "";
  console.log(`${root.species.name}${rootMarker}`);
  printEvolutions(root, species.name, "");
}

function printEvolutions(link: ChainLink, highlight: string, indent: string): void {
  link.evolves_to.forEach((child, index) => {
    const isLast = index === link.evolves_to.length - 1;
    const branch = isLast ? "└─ " : "├─ ";
    const name = child.species.name;
    const condition = describeCondition(child.evolution_details);
    const conditionText = condition ? ` (${condition})` : "";
    const marker = name === highlight ? " ◀" : "";

    console.log(`${indent}${branch}${name}${conditionText}${marker}`);

    const childIndent = indent + (isLast ? "   " : "│  ");
    printEvolutions(child, highlight, childIndent);
  });
}
