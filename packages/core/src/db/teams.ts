import type { PrismaClient } from "../generated/prisma/client.js";

export const MAX_TEAM_SIZE = 6;

/** The longest allowed team name. */
export const MAX_TEAM_NAME_LENGTH = 30;

export type TeamMember = {
  id: number;
  slot: number;
  pokedexId: number;
  name: string;
};

export type Team = {
  id: number;
  name: string;
  versionGroup: string;
  createdAt: Date;
  members: TeamMember[];
};

export class TeamNotFoundError extends Error {
  constructor(teamId: number) {
    super(`Team ${teamId} was not found.`);
    this.name = "TeamNotFoundError";
  }
}

export class TeamFullError extends Error {
  constructor(teamName: string) {
    super(`${teamName} already has ${MAX_TEAM_SIZE} Pokémon.`);
    this.name = "TeamFullError";
  }
}

const teamSelect = {
  id: true,
  name: true,
  versionGroup: true,
  createdAt: true,
  members: {
    select: { id: true, slot: true, pokedexId: true, name: true },
    orderBy: { slot: "asc" },
  },
} as const;

export class TeamRepository {
  constructor(private readonly db: PrismaClient) {}

  async list(ownerId: string, versionGroup?: string): Promise<Team[]> {
    return this.db.team.findMany({
      where: { ownerId, versionGroup },
      select: teamSelect,
      orderBy: { createdAt: "asc" },
    });
  }

  async get(ownerId: string, teamId: number): Promise<Team | undefined> {
    const team = await this.db.team.findFirst({
      where: { id: teamId, ownerId },
      select: teamSelect,
    });
    return team ?? undefined;
  }

  async create(ownerId: string, name: string, versionGroup: string): Promise<Team> {
    return this.db.team.create({
      data: { ownerId, name, versionGroup },
      select: teamSelect,
    });
  }

  async rename(ownerId: string, teamId: number, name: string): Promise<void> {
    const { count } = await this.db.team.updateMany({
      where: { id: teamId, ownerId },
      data: { name },
    });
    if (count === 0) {
      throw new TeamNotFoundError(teamId);
    }
  }

  async delete(ownerId: string, teamId: number): Promise<void> {
    const { count } = await this.db.team.deleteMany({ where: { id: teamId, ownerId } });
    if (count === 0) {
      throw new TeamNotFoundError(teamId);
    }
  }

  async addMember(
    ownerId: string,
    teamId: number,
    pokemon: { id: number; name: string },
  ): Promise<TeamMember> {
    return this.db.$transaction(async (tx) => {
      const team = await tx.team.findFirst({
        where: { id: teamId, ownerId },
        select: { name: true, members: { select: { slot: true } } },
      });
      if (!team) {
        throw new TeamNotFoundError(teamId);
      }

      const slot = firstFreeSlot(team.members.map((member) => member.slot));
      if (slot === undefined) {
        throw new TeamFullError(team.name);
      }

      return tx.teamMember.create({
        data: { teamId, slot, pokedexId: pokemon.id, name: pokemon.name },
        select: { id: true, slot: true, pokedexId: true, name: true },
      });
    });
  }

  async removeMember(ownerId: string, memberId: number): Promise<void> {
    await this.db.teamMember.deleteMany({
      where: { id: memberId, team: { ownerId } },
    });
  }
}

/** How many teams there are per game, keyed by version group. */
export function countTeamsByGame(teams: Pick<Team, "versionGroup">[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const team of teams) {
    counts[team.versionGroup] = (counts[team.versionGroup] ?? 0) + 1;
  }
  return counts;
}

function firstFreeSlot(takenSlots: number[]): number | undefined {
  const taken = new Set(takenSlots);
  for (let slot = 1; slot <= MAX_TEAM_SIZE; slot++) {
    if (!taken.has(slot)) {
      return slot;
    }
  }
  return undefined;
}