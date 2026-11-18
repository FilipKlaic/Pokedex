import { formatMultiplier } from "@/lib/format";
import type { TypeDefense } from "@/lib/pokeapi";
import { TypeBadge } from "./type-badge";

type Group = {
  label: string;
  defenses: TypeDefense[];
  /** Style for the multiplier next to each badge. */
  multiplierStyle: string;
};

/** Only the types that matter: weaknesses, resistances and immunities. Neutral (1×) is left out. */
export function TypeDefenseChart({ defenses }: { defenses: TypeDefense[] }) {
  // Strongest effect first: 4× before 2×, ¼× before ½×.
  const weaknesses = defenses
    .filter((d) => d.multiplier > 1)
    .sort((a, b) => b.multiplier - a.multiplier);
  const resistances = defenses
    .filter((d) => d.multiplier > 0 && d.multiplier < 1)
    .sort((a, b) => a.multiplier - b.multiplier);
  const immunities = defenses.filter((d) => d.multiplier === 0);

  const groups: Group[] = [
    { label: "Weak to", defenses: weaknesses, multiplierStyle: "text-red-600 dark:text-red-400" },
    { label: "Resists", defenses: resistances, multiplierStyle: "text-green-600 dark:text-green-400" },
    { label: "Immune to", defenses: immunities, multiplierStyle: "" },
  ];

  return (
    <dl className="space-y-5">
      {groups
        .filter((group) => group.defenses.length > 0)
        .map((group) => (
          <div key={group.label}>
            <dt className="mb-2 text-sm font-medium">{group.label}</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-2">
              {group.defenses.map(({ type, multiplier }) => (
                <span key={type} className="inline-flex items-center gap-1.5">
                  <TypeBadge type={type} size="md" />
                  {multiplier > 0 && (
                    <span className={`text-sm font-semibold tabular-nums ${group.multiplierStyle}`}>
                      {formatMultiplier(multiplier)}×
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
    </dl>
  );
}
