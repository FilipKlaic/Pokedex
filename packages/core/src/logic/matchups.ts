import type { TypeInfo } from "../api/types.js";

// How each damage relation changes the multiplier.
const RELATION_FACTORS = [
  ["double_damage_from", 2],
  ["half_damage_from", 0.5],
  ["no_damage_from", 0],
] as const;

/**
 * For a Pokémon with the given types, returns how much damage it takes
 * from each attacking type. Attacking types that deal normal (1×) damage
 * against every defending type are not included.
 */
export function defensiveMultipliers(defendingTypes: TypeInfo[]): Map<string, number> {
  const multipliers = new Map<string, number>();

  for (const typeInfo of defendingTypes) {
    for (const [relation, factor] of RELATION_FACTORS) {
      for (const attacker of typeInfo.damage_relations[relation]) {
        const current = multipliers.get(attacker.name) ?? 1;
        multipliers.set(attacker.name, current * factor);
      }
    }
  }

  return multipliers;
}

/**
 * Groups attacking types by multiplier, e.g. 2 → ["electric", "water"].
 * Neutral (1×) matchups are left out.
 */
export function groupByMultiplier(multipliers: Map<string, number>): Map<number, string[]> {
  return [...multipliers].reduce((groups, [typeName, multiplier]) => {
    if (multiplier === 1) {
      return groups;
    }
    const names = groups.get(multiplier) ?? [];
    names.push(typeName);
    groups.set(multiplier, names);
    return groups;
  }, new Map<number, string[]>());
}