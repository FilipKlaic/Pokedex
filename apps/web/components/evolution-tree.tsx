import Link from "next/link";
import type { ChainLink } from "@pokedex/core/api/types";
import { describeCondition } from "@pokedex/core/logic/evolution";

// Recursive: renders one stage, then an EvolutionTree for each thing it evolves into.
export function EvolutionTree({ link, current }: { link: ChainLink; current: string }) {
  const name = link.species.name;
  const condition = describeCondition(link.evolution_details);

  return (
    <div>
      <div className="flex items-baseline gap-2">
        {name === current ? (
          <span className="font-semibold capitalize">{name}</span>
        ) : (
          <Link
            href={`/pokemon/${name}`}
            className="capitalize text-blue-600 hover:underline dark:text-blue-400"
          >
            {name}
          </Link>
        )}
        {condition && <span className="text-xs text-zinc-500">{condition}</span>}
      </div>

      {link.evolves_to.length > 0 && (
        <ul className="ml-2 mt-1 space-y-1 border-l border-zinc-300 pl-4 dark:border-zinc-700">
          {link.evolves_to.map((child) => (
            <li key={child.species.name}>
              <EvolutionTree link={child} current={current} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
