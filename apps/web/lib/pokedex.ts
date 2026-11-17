import { io } from "next/cache";
import type { Pokemon } from "@pokedex/core/api/types";
import { prisma } from "@pokedex/core/db/client";
import { PokedexRepository } from "@pokedex/core/db/pokedex";

const repository = new PokedexRepository(prisma);

// Every function awaits io() first. It tells Next.js that real I/O follows, so
// the database is only queried at request time, never while prerendering.

export async function listCaughtPokemon(): Promise<Pokemon[]> {
  await io();
  return repository.list();
}

export async function listCaughtNames(): Promise<string[]> {
  await io();
  return repository.listNames();
}

export async function isCaught(name: string): Promise<boolean> {
  await io();
  return repository.has(name);
}
