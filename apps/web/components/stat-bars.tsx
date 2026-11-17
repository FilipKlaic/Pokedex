import type { Pokemon } from "@pokedex/core/api/types";

// The highest base stat any Pokémon has, so a full bar means "maximum".
const MAX_STAT = 255;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export function StatBars({ stats }: { stats: Pokemon["stats"] }) {
  const total = stats.reduce((sum, { base_stat }) => sum + base_stat, 0);

  return (
    <table className="w-full text-sm">
      <tbody>
        {stats.map(({ stat, base_stat }) => (
          <tr key={stat.name}>
            <th className="w-20 py-1 pr-3 text-left font-medium text-zinc-500">
              {STAT_LABELS[stat.name] ?? stat.name}
            </th>
            <td className="w-10 py-1 pr-3 text-right tabular-nums">{base_stat}</td>
            <td className="py-1">
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${(base_stat / MAX_STAT) * 100}%` }}
                />
              </div>
            </td>
          </tr>
        ))}
        <tr className="border-t border-zinc-200 dark:border-zinc-800">
          <th className="py-1 pr-3 text-left font-medium text-zinc-500">Total</th>
          <td className="py-1 pr-3 text-right font-semibold tabular-nums">{total}</td>
          <td />
        </tr>
      </tbody>
    </table>
  );
}
