import type { Pokemon } from "@pokedex/core/api/types";

// Bars are drawn relative to this, so 180 fills the whole bar. A few Pokémon go higher.
const BAR_MAX = 180;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// Low stats are red, high stats are green. Full class names so Tailwind finds them.
function barColor(value: number): string {
  if (value < 50) return "bg-red-400";
  if (value < 80) return "bg-orange-400";
  if (value < 100) return "bg-amber-400";
  if (value < 120) return "bg-lime-500";
  if (value < 150) return "bg-green-500";
  return "bg-teal-500";
}

export function StatBars({ stats }: { stats: Pokemon["stats"] }) {
  const total = stats.reduce((sum, { base_stat }) => sum + base_stat, 0);

  return (
    <dl className="space-y-2.5">
      {stats.map(({ stat, base_stat }) => (
        <div key={stat.name} className="grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-3 text-sm">
          <dt className="text-zinc-500">{STAT_LABELS[stat.name] ?? stat.name}</dt>
          <dd className="text-right font-semibold tabular-nums">{base_stat}</dd>
          <dd className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full ${barColor(base_stat)}`}
              style={{ width: `${Math.min(100, (base_stat / BAR_MAX) * 100)}%` }}
            />
          </dd>
        </div>
      ))}
      <div className="grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-3 border-t border-zinc-100 pt-2.5 text-sm dark:border-zinc-800">
        <dt className="font-medium text-zinc-500">Total</dt>
        <dd className="text-right font-bold tabular-nums">{total}</dd>
        <dd />
      </div>
    </dl>
  );
}
