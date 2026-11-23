import { io } from "next/cache";
import type { Pokemon } from "@pokedex/core/api/types";
import { getPrisma } from "@pokedex/core/db/client";
import { PokedexRepository } from "@pokedex/core/db/pokedex";

// Every function awaits io() first. It tells Next.js that real I/O follows, so
// the database is only queried at request time, never while prerendering.
// The repository is created on first use, so building the app needs no database.

function repository(): PokedexRepository {
  return new PokedexRepository(getPrisma());
}

export async function listCaughtPokemon(): Promise<Pokemon[]> {
  await io();
  return repository().list();
}

export async function listCaughtNames(): Promise<string[]> {
  await io();
  return repository().listNames();
}

export async function isCaught(name: string): Promise<boolean> {
  await io();
  return repository().has(name);
}

export async function addToPokedex(pokemon: Pokemon): Promise<void> {
  await io();
  await repository().add(pokemon);
}
