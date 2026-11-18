import Image from "next/image";
import Link from "next/link";
import type { ChainLink } from "@pokedex/core/api/types";
import { idFromResourceURL } from "@pokedex/core/api/urls";
import { describeCondition } from "@pokedex/core/logic/evolution";
import { artworkURL, formatName, formatNumber } from "@/lib/format";

/** The whole evolution family, left to right, with branches stacked vertically. */
export function EvolutionChain({ root, current }: { root: ChainLink; current: string }) {
  return (
    <div className="-mx-2 overflow-x-auto px-2 pb-2">
      <EvolutionNode link={root} current={current} />
    </div>
  );
}

// Recursive: one stage, then an arrow + node for everything it evolves into.
function EvolutionNode({ link, current }: { link: ChainLink; current: string }) {
  return (
    <div className="flex items-center gap-2">
      <Stage link={link} isCurrent={link.species.name === current} />
      {link.evolves_to.length > 0 && (
        <div className="flex flex-col gap-3">
          {link.evolves_to.map((child) => (
            <div key={child.species.name} className="flex items-center gap-2">
              <Arrow label={describeCondition(child.evolution_details)} />
              <EvolutionNode link={child} current={current} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stage({ link, isCurrent }: { link: ChainLink; isCurrent: boolean }) {
  const id = idFromResourceURL(link.species.url);
  const content = (
    <>
      <Image
        src={artworkURL(id)}
        alt=""
        width={80}
        height={80}
        className="h-16 w-16 object-contain transition group-hover:scale-110 sm:h-20 sm:w-20"
      />
      <span className="font-mono text-[10px] text-zinc-400">{formatNumber(id)}</span>
      <span className="text-sm font-medium leading-tight">{formatName(link.species.name)}</span>
    </>
  );

  const base = "group flex w-24 shrink-0 flex-col items-center rounded-2xl p-2 text-center sm:w-28";

  return isCurrent ? (
    <div
      aria-current="page"
      className={`${base} bg-zinc-100 ring-2 ring-zinc-900 dark:bg-zinc-800 dark:ring-white`}
    >
      {content}
    </div>
  ) : (
    <Link
      href={`/pokemon/${link.species.name}`}
      className={`${base} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
    >
      {content}
    </Link>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center text-center sm:w-24">
      <span className="text-[11px] leading-tight text-zinc-500">{label}</span>
      <span aria-hidden className="text-lg text-zinc-300 dark:text-zinc-600">
        →
      </span>
    </div>
  );
}
