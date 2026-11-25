import { cacheLife } from "next/cache";
import { PokeAPI, PokeAPIError } from "@pokedex/core/api/pokeapi";
import { POKEMON_TYPES, type PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import type { ChainLink, NamedAPIResource, Pokemon } from "@pokedex/core/api/types";
import { idFromResourceURL } from "@pokedex/core/api/urls";
import { defensiveMultipliers } from "@pokedex/core/logic/matchups";

const api = new PokeAPI(5 * 60 * 1000);

/** Just enough to show a tile: Pokédex number and name. */
export type PokemonSummary = {
  id: number;
  name: string;
};

export type GenerationSummary = {
  id: number;
  label: string;
  region: string;
};

export type SpeciesDetails = {
  /** e.g. "Flame Pokémon" */
  genus: string | null;
  /** The most recent English Pokédex entry. */
  flavorText: string | null;
  /** The root of the evolution tree, or null if there is none. */
  evolution: ChainLink | null;
};

export type TypeDefense = {
  type: PokemonTypeName;
  multiplier: number;
};

/**
 * One Pokémon, or null if PokéAPI doesn't know the name. Also accepts a species
 * name whose default form is called something longer ("deoxys" → "deoxys-normal").
 */
export async function getPokemon(name: string): Promise<Pokemon | null> {
  "use cache";
  cacheLife("days");

  const pokemon = await orNullIfNotFound(api.fetchPokemon(name));
  if (pokemon) {
    return pokemon;
  }

  const species = await orNullIfNotFound(api.fetchSpecies(name));
  const defaultVariety = species?.varieties.find((variety) => variety.is_default);
  if (!defaultVariety) {
    return null;
  }
  return orNullIfNotFound(api.fetchPokemon(defaultVariety.pokemon.name));
}

/** Every Pokémon and form PokéAPI knows, in Pokédex order. */
export async function getAllPokemon(): Promise<PokemonSummary[]> {
  "use cache";
  cacheLife("days");

  const list = await api.fetchPokemonList(0, 100_000);
  return list.results.map(toSummary);
}

/** Every Pokémon and form that has this type, in Pokédex order. */
export async function getPokemonOfType(type: PokemonTypeName): Promise<PokemonSummary[]> {
  "use cache";
  cacheLife("days");

  const typeInfo = await api.fetchType(type);
  return typeInfo.pokemon.map((entry) => toSummary(entry.pokemon)).sort((a, b) => a.id - b.id);
}

/** The Pokémon just before and after a species number, for previous/next links. */
export async function getNeighbors(
  speciesId: number,
): Promise<{ previous: PokemonSummary | null; next: PokemonSummary | null }> {
  const all = await getAllPokemon();
  return {
    previous: all.find((pokemon) => pokemon.id === speciesId - 1) ?? null,
    next: all.find((pokemon) => pokemon.id === speciesId + 1) ?? null,
  };
}

/** All generations with their region, e.g. { id: 1, label: "Gen I", region: "Kanto" }. */
export async function getGenerations(): Promise<GenerationSummary[]> {
  "use cache";
  cacheLife("days");

  const list = await api.fetchGenerations();
  return Promise.all(
    list.results.map(async (entry) => {
      const id = idFromResourceURL(entry.url);
      const generation = await api.fetchGeneration(id);
      return {
        id,
        label: `Gen ${entry.name.replace("generation-", "").toUpperCase()}`,
        region: capitalize(generation.main_region.name),
      };
    }),
  );
}

/** The Pokémon introduced in one generation, in Pokédex order, or null if it doesn't exist. */
export async function getGenerationPokemon(id: number): Promise<PokemonSummary[] | null> {
  "use cache";
  cacheLife("days");

  const generation = await orNullIfNotFound(api.fetchGeneration(id));
  if (!generation) {
    return null;
  }
  return generation.pokemon_species.map(toSummary).sort((a, b) => a.id - b.id);
}

/** Category, Pokédex entry and evolution tree for a species. */
export async function getSpeciesDetails(speciesName: string): Promise<SpeciesDetails> {
  "use cache";
  cacheLife("days");

  const species = await api.fetchSpecies(speciesName);

  const genus = species.genera.find((entry) => entry.language.name === "en")?.genus ?? null;
  const englishEntries = species.flavor_text_entries.filter(
    (entry) => entry.language.name === "en",
  );
  const latestEntry = englishEntries.at(-1);
  // Entries contain line breaks and form feeds from the original game text boxes.
  const flavorText = latestEntry ? latestEntry.flavor_text.replace(/[\f\n\r­]+/g, " ") : null;

  const evolution = species.evolution_chain
    ? (await api.fetchEvolutionChain(species.evolution_chain.url)).chain
    : null;

  return { genus, flavorText, evolution };
}

/** How much damage this Pokémon takes from each of the 18 attacking types. */
export async function getTypeDefenses(typeNames: string[]): Promise<TypeDefense[]> {
  "use cache";
  cacheLife("days");

  const typeInfos = await Promise.all(typeNames.map((typeName) => api.fetchType(typeName)));
  const multipliers = defensiveMultipliers(typeInfos);

  return POKEMON_TYPES.map((type) => ({ type, multiplier: multipliers.get(type) ?? 1 }));
}

function toSummary(entry: NamedAPIResource): PokemonSummary {
  return { id: idFromResourceURL(entry.url), name: entry.name };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Waits for a request; a 404 becomes null, any other error is re-thrown. */
async function orNullIfNotFound<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof PokeAPIError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
