import type { MatchupGroup } from "@/lib/pokeapi";
import { TypeBadge } from "./type-badge";

const GROUP_LABELS: Record<number, string> = {
  4: "4× weak",
  2: "2× weak",
  0.5: "½× resists",
  0.25: "¼× resists",
  0: "Immune",
};

export function DefensiveMatchups({ groups }: { groups: MatchupGroup[] }) {
  return (
    <dl className="space-y-2">
      {groups.map(({ multiplier, types }) => (
        <div key={multiplier} className="flex items-start gap-3">
          <dt className="w-24 shrink-0 pt-0.5 text-sm text-zinc-500">
            {GROUP_LABELS[multiplier] ?? `${multiplier}×`}
          </dt>
          <dd className="flex flex-wrap gap-1">
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
