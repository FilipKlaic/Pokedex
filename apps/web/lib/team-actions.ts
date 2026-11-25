"use server";

import { refresh } from "next/cache";
import { MAX_TEAM_NAME_LENGTH, TeamFullError, TeamNotFoundError } from "@pokedex/core/db/teams";
import { findGame, gamesWithPokemon } from "@pokedex/core/logic/games";
import { formatName } from "./format";
import { getOrCreateOwnerId } from "./owner";
import { getPokemon } from "./pokeapi";
import { teamRepository } from "./teams";

// Server Actions can be called by anyone with any arguments, not just by our
// components, so every action checks its input and only touches the caller's teams.

export type ActionResult = { ok: boolean; message: string };

const MAX_TEAMS = 50;

const TEAM_NOT_FOUND = "That team doesn't exist anymore. Reload the page and try again.";

/** Puts a Pokémon in one of the visitor's teams. */
export async function addToTeam(teamId: number, pokemonName: string): Promise<ActionResult> {
  if (!Number.isInteger(teamId) || typeof pokemonName !== "string") {
    return fail("Invalid request.");
  }
  const pokemon = await getPokemon(pokemonName);
  if (!pokemon) {
    return fail(`There's no Pokémon called "${pokemonName}".`);
  }

  const ownerId = await getOrCreateOwnerId();
  const repository = teamRepository();
  const team = await repository.get(ownerId, teamId);
  if (!team) {
    return fail(TEAM_NOT_FOUND);
  }
  const notInGame = checkPokemonInGame(pokemon, team.versionGroup);
  if (notInGame) {
    return fail(notInGame);
  }

  try {
    await repository.addMember(ownerId, teamId, pokemon);
  } catch (error) {
    return failFromError(error);
  }
  refresh();
  return succeed(`Added ${formatName(pokemon.name)} to ${team.name}.`);
}

/** Creates a team, and optionally puts a first Pokémon in it. */
export async function createTeam(
  gameId: string,
  name: string,
  pokemonName?: string,
): Promise<ActionResult> {
  const game = typeof gameId === "string" ? findGame(gameId) : undefined;
  if (!game) {
    return fail("Unknown game.");
  }
  const teamName = cleanTeamName(name);
  if (!teamName) {
    return fail(`Give your team a name (up to ${MAX_TEAM_NAME_LENGTH} characters).`);
  }

  // Check the Pokémon before creating anything, so a failure leaves no empty team behind.
  const pokemon = pokemonName === undefined ? null : await getPokemon(String(pokemonName));
  if (pokemonName !== undefined && !pokemon) {
    return fail(`There's no Pokémon called "${pokemonName}".`);
  }
  if (pokemon) {
    const notInGame = checkPokemonInGame(pokemon, game.id);
    if (notInGame) {
      return fail(notInGame);
    }
  }

  const ownerId = await getOrCreateOwnerId();
  const repository = teamRepository();
  if ((await repository.list(ownerId)).length >= MAX_TEAMS) {
    return fail(`You can have up to ${MAX_TEAMS} teams. Delete one to make room.`);
  }

  const team = await repository.create(ownerId, teamName, game.id);
  if (pokemon) {
    await repository.addMember(ownerId, team.id, pokemon);
  }
  refresh();
  return succeed(
    pokemon
      ? `Created ${teamName} with ${formatName(pokemon.name)}.`
      : `Created ${teamName} for ${game.name}.`,
  );
}

export async function renameTeam(teamId: number, name: string): Promise<ActionResult> {
  if (!Number.isInteger(teamId)) {
    return fail("Invalid request.");
  }
  const teamName = cleanTeamName(name);
  if (!teamName) {
    return fail(`Give your team a name (up to ${MAX_TEAM_NAME_LENGTH} characters).`);
  }

  try {
    await teamRepository().rename(await getOrCreateOwnerId(), teamId, teamName);
  } catch (error) {
    return failFromError(error);
  }
  refresh();
  return succeed(`Renamed the team to ${teamName}.`);
}

export async function deleteTeam(teamId: number): Promise<ActionResult> {
  if (!Number.isInteger(teamId)) {
    return fail("Invalid request.");
  }

  try {
    await teamRepository().delete(await getOrCreateOwnerId(), teamId);
  } catch (error) {
    return failFromError(error);
  }
  refresh();
  return succeed("Team deleted.");
}

export async function removeFromTeam(memberId: number): Promise<ActionResult> {
  if (!Number.isInteger(memberId)) {
    return fail("Invalid request.");
  }

  await teamRepository().removeMember(await getOrCreateOwnerId(), memberId);
  refresh();
  return succeed("Removed from the team.");
}

/** An error message if the Pokémon isn't in the game, or null if it is. */
function checkPokemonInGame(
  pokemon: Parameters<typeof gamesWithPokemon>[0] & { name: string },
  gameId: string,
): string | null {
  if (gamesWithPokemon(pokemon).includes(gameId)) {
    return null;
  }
  const gameName = findGame(gameId)?.name ?? gameId;
  return `${formatName(pokemon.name)} isn't in ${gameName}.`;
}

/** Trims and collapses spaces. Returns null if the name is empty or too long. */
function cleanTeamName(name: unknown): string | null {
  if (typeof name !== "string") {
    return null;
  }
  const cleaned = name.trim().replace(/\s+/g, " ");
  return cleaned.length > 0 && cleaned.length <= MAX_TEAM_NAME_LENGTH ? cleaned : null;
}

function failFromError(error: unknown): ActionResult {
  if (error instanceof TeamFullError) {
    return fail(error.message);
  }
  if (error instanceof TeamNotFoundError) {
    return fail(TEAM_NOT_FOUND);
  }
  throw error;
}

function succeed(message: string): ActionResult {
  return { ok: true, message };
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}
