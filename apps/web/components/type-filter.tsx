import Link from "next/link";
import { POKEMON_TYPES, type PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import { searchURL } from "@/lib/search-url";
import { TypeBadge } from "./type-badge";

type TypeFilterProps = {
    query: string;
    active: PokemonTypeName | null;
}

export function TypeFilter({ query, active }: TypeFilterProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filter by type">
      {POKEMON_TYPES.map((type) => {
        const isActive = type === active;
        return (
          <Link
            key={type}
            href={searchURL(query, isActive ? null : type)}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full ${
              isActive
                ? "ring-2 ring-black ring-offset-2 dark:ring-white dark:ring-offset-black"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <TypeBadge type={type} />
          </Link>
        );
      })}
    </nav>
  );
}
