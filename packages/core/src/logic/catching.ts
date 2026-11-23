const MAX_CAPTURE_RATE = 255;
const MIN_CATCH_CHANCE = 0.05;
const MAX_CATCH_CHANCE = 0.9;


export function catchChance(captureRate: number): number {
    const rate = Math.min(MAX_CAPTURE_RATE, Math.max(0, captureRate));
    return MIN_CATCH_CHANCE + (MAX_CATCH_CHANCE - MIN_CATCH_CHANCE) * (rate / MAX_CAPTURE_RATE);
}

export function rollCatch(chance: number, random: () => number = Math.random): boolean {
    return random() < chance;
}