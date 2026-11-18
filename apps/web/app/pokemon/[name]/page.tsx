import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { catchChance } from "@pokedex/core/logic/catching";
import { CatchPanel } from "@/components/catch-panel";
import { DefensiveMatchups } from "@/components/defensive-matchups";
import { EvolutionTree } from "@/components/evolution-tree";
import { StatBars } from "@/components/stat-bars";
import { TypeBadge } from "@/components/type-badge";
import { throwPokeball } from "@/lib/actions";
import { getDefensiveMatchups, getEvolutionChain, getPokemon } from "@/lib/pokeapi";
import { isCaught } from "@/lib/pokedex";

export default function PokemonPage({ params }: PageProps<"/pokemon/[name]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<p className="text-zinc-500">Loading Pokémon…</p>}>
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
  const [matchups, evolution, caught] = await Promise.all([
    getDefensiveMatchups(typeNames),
    getEvolutionChain(pokemon.species.name),
    isCaught(pokemon.name),
  ]);

  return (
    <article className="grid gap-8 md:grid-cols-[20rem_1fr]">
      <header className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-4">
          <Sprite src={pokemon.sprites.front_default} alt={pokemon.name} label="Normal" />
          <Sprite
            src={pokemon.sprites.front_shiny}
            alt={`Shiny ${pokemon.name}`}
            label="✨ Shiny"
          />
        </div>
        <p className="mt-2 text-sm text-zinc-500">#{String(pokemon.id).padStart(4, "0")}</p>
        <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
        <div className="mt-2 flex gap-1">
          {typeNames.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          {pokemon.height / 10} m · {pokemon.weight / 10} kg
        </p>
        <CatchPanel
          caught={caught}
          chancePercent={Math.round(catchChance(pokemon.base_experience) * 100)}
          throwAction={throwPokeball.bind(null, pokemon.name)}
        />
      </header>

      <div className="space-y-8">
        <Section title="Base stats">
          <StatBars stats={pokemon.stats} />
        </Section>

        <Section title="Type matchups">
          <DefensiveMatchups groups={matchups} />
        </Section>

        <Section title="Evolution">
          {evolution && evolution.evolves_to.length > 0 ? (
            <EvolutionTree link={evolution} current={pokemon.species.name} />
          ) : (
            <p className="text-zinc-500">Does not evolve.</p>
          )}
        </Section>
      </div>
    </article>
  );
}

function Sprite({ src, alt, label }: { src: string | null; alt: string; label: string }) {
  if (!src) {
    return null;
  }

  return (
    <figure className="flex flex-col items-center">
      <Image src={src} alt={alt} width={120} height={120} className="[image-rendering:pixelated]" />
      <figcaption className="text-xs text-zinc-500">{label}</figcaption>
    </figure>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
