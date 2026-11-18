import Link from "next/link";
import { POKEMON_TYPES, type PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import { searchURL } from "@/lib/search-url";
import { TypeBadge } from "./type-badge";

type TypeFilterProps = {
  query: string;
  active: PokemonTypeName | null;
};

export function TypeFilter({ query, active }: TypeFilterProps) {
  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Filter by type">
      {POKEMON_TYPES.map((type) => {
        const isActive = type === active;
        return (
          <Link
            key={type}
            // Clicking the active type again turns the filter off.
            href={searchURL(query, isActive ? null : type)}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-md transition ${
              isActive
                ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-zinc-50 dark:ring-white dark:ring-offset-zinc-950"
                : active
                  ? "opacity-35 hover:opacity-100"
                  : "opacity-80 hover:opacity-100"
            }`}
          >
            <TypeBadge type={type} size="md" />
          </Link>
        );
      })}
    </nav>
  );
}
