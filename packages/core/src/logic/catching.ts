const DEFAULT_BASE_EXPERIENCE = 100;
const MIN_CATCH_CHANCE = 0.05;
const MAX_CATCH_CHANCE = 0.9;

export function catchChance(baseExperience: number | null): number {
    const experience = baseExperience ?? DEFAULT_BASE_EXPERIENCE;
    const chance = 1 - experience / 400;
    return Math.min(MAX_CATCH_CHANCE, Math.max(MAX_CATCH_CHANCE, chance));
}

export function rollCatch(chance: number, random: () => number = Math.random): boolean {
    return random() < chance;
}