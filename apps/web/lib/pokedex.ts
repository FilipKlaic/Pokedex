import { io } from "next/cache";
import type { Pokemon } from "@pokedex/core/api/types";
import { prisma } from "@pokedex/core/db/client";
import { PokedexRepository } from "@pokedex/core/db/pokedex";

const repository = new PokedexRepository(prisma);


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

export async function addToPokedex(pokemon: Pokemon): Promise<void> {
  await io();
  await repository.add(pokemon);
}
