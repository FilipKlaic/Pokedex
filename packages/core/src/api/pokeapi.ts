import { Cache } from "./cache.js";
import type {
  EvolutionChain,
  Generation,
  LocationArea,
  NamedAPIResourceList,
  Pokemon,
  PokemonSpecies,
  ShallowLocations,
  TypeInfo,
} from "./types.js";

/** Thrown when PokéAPI answers with an error status, e.g. 404 for an unknown name. */
export class PokeAPIError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`Request failed: ${status} ${statusText}`);
    this.name = "PokeAPIError";
    this.status = status;
  }
}

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache<unknown>;

  constructor(cacheTTLMs: number) {
    this.cache = new Cache<unknown>(cacheTTLMs);
  }

  async fetchLocations(pageURL: string | null = null): Promise<ShallowLocations> {
    const url = pageURL ?? `${PokeAPI.baseURL}/location-area?offset=0&limit=20`;
    return this.fetchJSON<ShallowLocations>(url);
  }

  async fetchLocationArea(areaName: string): Promise<LocationArea> {
    const url = `${PokeAPI.baseURL}/location-area/${encodeURIComponent(areaName)}`;
    return this.fetchJSON<LocationArea>(url);
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${encodeURIComponent(pokemonName)}`;
    return this.fetchJSON<Pokemon>(url);
  }

  async fetchPokemonList(offset: number, limit: number): Promise<NamedAPIResourceList> {
    const url = `${PokeAPI.baseURL}/pokemon?offset=${offset}&limit=${limit}`;
    return this.fetchJSON<NamedAPIResourceList>(url);
  }

  async fetchSpecies(speciesName: string): Promise<PokemonSpecies> {
    const url = `${PokeAPI.baseURL}/pokemon-species/${encodeURIComponent(speciesName)}`;
    return this.fetchJSON<PokemonSpecies>(url);
  }

  async fetchGenerations(): Promise<NamedAPIResourceList> {
    return this.fetchJSON<NamedAPIResourceList>(`${PokeAPI.baseURL}/generation`);
  }

  async fetchGeneration(id: number): Promise<Generation> {
    return this.fetchJSON<Generation>(`${PokeAPI.baseURL}/generation/${id}`);
  }

  async fetchEvolutionChain(chainURL: string): Promise<EvolutionChain> {
    return this.fetchJSON<EvolutionChain>(chainURL);
  }

  async fetchType(typeName: string): Promise<TypeInfo> {
    const url = `${PokeAPI.baseURL}/type/${encodeURIComponent(typeName)}`;
    return this.fetchJSON<TypeInfo>(url);
  }

  private async fetchJSON<T>(url: string): Promise<T> {
    const cached = this.cache.get(url);
    if (cached !== undefined) {
      return cached as T;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new PokeAPIError(response.status, response.statusText);
    }

    const data: unknown = await response.json();
    this.cache.add(url, data);
    return data as T;
  }
}
