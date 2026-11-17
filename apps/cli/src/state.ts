import { createInterface, type Interface } from "node:readline";
import { PokeAPI } from "@pokedex/core/api/pokeapi";
import { getCommands } from "./commands/registry.js";
import { prisma } from "@pokedex/core/db/client";
import { PokedexRepository } from "@pokedex/core/db/pokedex";
import type { PrismaClient } from "@pokedex/core/generated/prisma/client";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  rl: Interface;
  commands: Record<string, CLICommand>;
  pokeAPI: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
  db: PrismaClient;
  pokedex: PokedexRepository;
};

export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokédex > ",
  });

  return {
    rl,
    commands: getCommands(),
    pokeAPI: new PokeAPI(5 * 60 * 1000), // 5 minutes
    nextLocationsURL: null,
    prevLocationsURL: null,
    db: prisma,
    pokedex: new PokedexRepository(prisma),
  };
}
