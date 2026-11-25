import { getPrisma } from "@pokedex/core/db/client";
import { TeamRepository, type Team } from "@pokedex/core/db/teams";
import { readOwnerId } from "./owner";

// Reading cookies tells Next.js these functions run at request time, so the
// database is never queried while prerendering. Visitors without the cookie
// have no teams, so they don't touch the database at all.

export function teamRepository(): TeamRepository {
  return new TeamRepository(getPrisma());
}

/** The current visitor's teams, oldest first. */
export async function listMyTeams(): Promise<Team[]> {
  const ownerId = await readOwnerId();
  return ownerId ? teamRepository().list(ownerId) : [];
}

/** Pokédex numbers of every Pokémon in any of the visitor's teams, for the ✓ on tiles. */
export async function listMyTeamPokemonIds(): Promise<number[]> {
  const teams = await listMyTeams();
  return [...new Set(teams.flatMap((team) => team.members.map((member) => member.pokedexId)))];
}
