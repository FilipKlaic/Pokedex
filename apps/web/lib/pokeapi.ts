import { cacheLife } from "next/cache";
import { PokeAPI, PokeAPIError } from "@pokedex/core/api/pokeapi";
import type { PokemonTypeName } from "@pokedex/core/api/pokemon-types";
import type { ChainLink, NamedAPIResource, Pokemon } from "@pokedex/core/api/types";
import { idFromResourceURL } from "@pokedex/core/api/urls";
import { defensiveMultipliers, groupByMultiplier } from "@pokedex/core/logic/matchups";

const api = new PokeAPI(5 * 60 * 1000);

export type PokemonSummary = {
  id: number;
  name: string;
};

export type GenerationSummary = {
  id: number;
  label: string;
};

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

/** Every Pokémon and form PokéAPI knows, for searching. */
export async function getAllPokemon(): Promise<PokemonSummary[]> {
  "use cache";
  cacheLife("days");

  const list = await api.fetchPokemonList(0, 100_000);
  return list.results.map(toSummary);
}

export async function getPokemonOfType(type: PokemonTypeName): Promise<PokemonSummary[]> {
  "use cache";
  cacheLife("days");

  const typeInfo = await api.fetchType(type);
  return typeInfo.pokemon.map((entry) => toSummary(entry.pokemon)).sort((a, b) => a.id - b.id);
}

export async function getGenerations(): Promise<GenerationSummary[]> {
  "use cache";
  cacheLife("days");

  const list = await api.fetchGenerations();
  return list.results.map((entry) => ({
    id: idFromResourceURL(entry.url),
    label: `Gen ${entry.name.replace("generation-", "").toUpperCase()}`,
  }));
}

export async function getGenerationPokemon(id: number): Promise<PokemonSummary[] | null> {
  "use cache";
  cacheLife("days");

  const generation = await orNullIfNotFound(api.fetchGeneration(id));
  if (!generation) {
    return null;
  }
  return generation.pokemon_species.map(toSummary).sort((a, b) => a.id - b.id);
}

export async function getEvolutionChain(speciesName: string): Promise<ChainLink | null> {
  "use cache";
  cacheLife("days");

  const species = await api.fetchSpecies(speciesName);
  if (!species.evolution_chain) {
    return null;
  }
  const evolution = await api.fetchEvolutionChain(species.evolution_chain.url);
  return evolution.chain;
}

export type MatchupGroup = {
  multiplier: number;
  types: string[];
};

export async function getDefensiveMatchups(typeNames: string[]): Promise<MatchupGroup[]> {
  "use cache";
  cacheLife("days");

  const typeInfos = await Promise.all(typeNames.map((typeName) => api.fetchType(typeName)));
  const groups = groupByMultiplier(defensiveMultipliers(typeInfos));

  return [...groups]
    .map(([multiplier, types]) => ({ multiplier, types: types.sort() }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

function toSummary(entry: NamedAPIResource): PokemonSummary {
  return { id: idFromResourceURL(entry.url), name: entry.name };
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
