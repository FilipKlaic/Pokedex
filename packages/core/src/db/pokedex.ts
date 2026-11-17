import type { Pokemon } from "../api/types.js";
import type { PrismaClient } from "../generated/prisma/client.js";

export class PokedexRepository {
  constructor(private readonly db: PrismaClient) {}

  async has(name: string): Promise<boolean> {
    const count = await this.db.caughtPokemon.count({ where: { name } });
    return count > 0;
  }

  async add(pokemon: Pokemon): Promise<void> {
    await this.db.caughtPokemon.create({
      data: {
        name: pokemon.name,
        pokedexId: pokemon.id,
        data: pokemon,
      },
    });
  }

  async get(name: string): Promise<Pokemon | undefined> {
    const row = await this.db.caughtPokemon.findUnique({ where: { name } });
    return row ? toPokemon(row.data) : undefined;
  }

  async list(): Promise<Pokemon[]> {
    const rows = await this.db.caughtPokemon.findMany({
      orderBy: { pokedexId: "asc" },
    });
    return rows.map((row) => toPokemon(row.data));
  }

  async listNames(): Promise<string[]> {
    const rows = await this.db.caughtPokemon.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });
    return rows.map((row) => row.name);
  }
}

function toPokemon(data: unknown): Pokemon {
  return data as Pokemon;
}
