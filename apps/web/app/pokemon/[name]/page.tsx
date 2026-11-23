import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import type { Pokemon } from "@pokedex/core/api/types";
import { idFromResourceURL } from "@pokedex/core/api/urls";
import { catchChance } from "@pokedex/core/logic/catching";
import { CatchPanel } from "@/components/catch-panel";
import { EvolutionChain } from "@/components/evolution-chain";
import { DetailSkeleton } from "@/components/skeletons";
import { StatBars } from "@/components/stat-bars";
import { TypeBadge } from "@/components/type-badge";
import { TypeDefenseChart } from "@/components/type-defense-chart";
import { throwPokeball } from "@/lib/actions";
import { formatName, formatNumber } from "@/lib/format";
import {
  getNeighbors,
  getPokemon,
  getSpeciesDetails,
  getTypeDefenses,
  type PokemonSummary,
} from "@/lib/pokeapi";
import { isCaught } from "@/lib/pokedex";
import { typeColor } from "@/lib/type-colors";

export default function PokemonPage({ params }: PageProps<"/pokemon/[name]">) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <Suspense fallback={<DetailSkeleton />}>
        <PokemonDetails params={params} />
      </Suspense>
    </main>
  );
}

async function PokemonDetails({ params }: Pick<PageProps<"/pokemon/[name]">, "params">) {
  const { name } = await params;
  const pokemon = await getPokemon(name.toLowerCase());

  if (!pokemon) {
    notFound();
  }

  const typeNames = pokemon.types.map((t) => t.type.name);
  const speciesId = idFromResourceURL(pokemon.species.url);
  const [species, defenses, neighbors, caught] = await Promise.all([
    getSpeciesDetails(pokemon.species.name),
    getTypeDefenses(typeNames),
    getNeighbors(speciesId),
    isCaught(pokemon.name),
  ]);

  const [firstColor, secondColor = firstColor] = typeNames.map(typeColor);
  const artwork = pokemon.sprites.other["official-artwork"];

  return (
    <div className="space-y-6">
      <PokemonNav previous={neighbors.previous} next={neighbors.next} />

      {/* Hero: artwork and the key facts, tinted in the Pokémon's type colors. */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 dark:opacity-25"
          style={{ backgroundImage: `linear-gradient(135deg, ${firstColor}, ${secondColor})` }}
        />
        <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
          <div className="flex items-end justify-center gap-2">
            <Artwork
              src={artwork.front_default ?? pokemon.sprites.front_default}
              alt={formatName(pokemon.name)}
              size={224}
              caption="Normal"
            />
            <Artwork
              src={artwork.front_shiny ?? pokemon.sprites.front_shiny}
              alt={`Shiny ${formatName(pokemon.name)}`}
              size={180}
              caption="✨Shiny"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm text-zinc-500">{formatNumber(speciesId)}</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {formatName(pokemon.name)}
              </h1>
              {species.genus && <p className="mt-1 text-zinc-500">{species.genus}</p>}
            </div>

            <div className="flex gap-2">
              {typeNames.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>

            {species.flavorText && (
              <p className="max-w-prose leading-relaxed text-zinc-700 dark:text-zinc-300">
                {species.flavorText}
              </p>
            )}

            <dl className="grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Fact label="Height">{pokemon.height / 10} m</Fact>
              <Fact label="Weight">{pokemon.weight / 10} kg</Fact>
              <Fact label="Abilities" wide>
                <Abilities abilities={pokemon.abilities} />
              </Fact>
            </dl>

            <CatchPanel
              caught={caught}
              chancePercent={Math.round(catchChance(species.captureRate) * 100)}
              throwAction={throwPokeball.bind(null, pokemon.name)}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Base stats">
          <StatBars stats={pokemon.stats} />
        </Card>
        <Card title="Type defenses">
          <TypeDefenseChart defenses={defenses} />
        </Card>
      </div>

      <Card title="Evolution">
        {species.evolution && species.evolution.evolves_to.length > 0 ? (
          <EvolutionChain root={species.evolution} current={pokemon.species.name} />
        ) : (
          <p className="text-sm text-zinc-500">{formatName(pokemon.name)} does not evolve.</p>
        )}
      </Card>
    </div>
  );
}

function PokemonNav({
  previous,
  next,
}: {
  previous: PokemonSummary | null;
  next: PokemonSummary | null;
}) {
  const linkStyle =
    "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-white hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

  return (
    <nav aria-label="Previous and next Pokémon" className="flex items-center justify-between">
      {previous ? (
        <Link href={`/pokemon/${previous.name}`} className={linkStyle}>
          <span aria-hidden>←</span>
          <span className="font-mono text-xs text-zinc-400">{formatNumber(previous.id)}</span>
          {formatName(previous.name)}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`/pokemon/${next.name}`} className={linkStyle}>
          {formatName(next.name)}
          <span className="font-mono text-xs text-zinc-400">{formatNumber(next.id)}</span>
          <span aria-hidden>→</span>
        </Link>
      )}
    </nav>
  );
}

function Artwork({
  src,
  alt,
  size,
  caption,
}: {
  src: string | null;
  alt: string;
  size: number;
  caption?: string;
}) {
  if (!src) {
    return null;
  }

  return (
    <figure className="flex flex-col items-center">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority
        className="object-contain drop-shadow-xl"
        style={{ width: size, height: size }}
      />
      {caption && <figcaption className="mt-1 text-xs text-zinc-500">{caption}</figcaption>}
    </figure>
  );
}

function Fact({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "col-span-2 sm:col-span-1" : undefined}>
      <dt className="text-xs uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

function Abilities({ abilities }: { abilities: Pokemon["abilities"] }) {
  return (
    <ul>
      {[...abilities]
        .sort((a, b) => a.slot - b.slot)
        .map(({ ability, is_hidden }) => (
          <li key={ability.name}>
            {formatName(ability.name)}
            {is_hidden && <span className="ml-1 text-xs font-normal text-zinc-500">(hidden)</span>}
          </li>
        ))}
    </ul>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}
