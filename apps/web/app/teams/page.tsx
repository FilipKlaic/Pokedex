import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { countTeamsByGame, MAX_TEAM_SIZE, type Team } from "@pokedex/core/db/teams";
import { GAMES } from "@pokedex/core/logic/games";
import { GameArt } from "@/components/game-art";
import { NewTeamButton } from "@/components/new-team-button";
import { RemoveMemberButton } from "@/components/remove-member-button";
import { TeamMenu } from "@/components/team-menu";
import { TypeBadge } from "@/components/type-badge";
import { artworkURL, formatName } from "@/lib/format";
import { getPokemon } from "@/lib/pokeapi";
import { listMyTeams } from "@/lib/teams";

export const metadata: Metadata = {
  title: "My teams · Pokédex",
};

export default function TeamsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">My teams</h1>
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsOverview />
      </Suspense>
    </main>
  );
}

async function TeamsOverview() {
  const teams = await listMyTeams();
  const teamCounts = countTeamsByGame(teams);

  if (teams.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="font-medium">No teams yet</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">
          Make a team for the game you&apos;re playing, or open any Pokémon and press{" "}
          <span className="font-medium">Add to team</span>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <NewTeamButton teamCounts={teamCounts} />
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Browse Pokémon
          </Link>
        </div>
      </div>
    );
  }

  // Types for the badges on each slot. getPokemon is cached, so this is cheap.
  const memberNames = [...new Set(teams.flatMap((team) => team.members.map((member) => member.name)))];
  const pokemon = await Promise.all(memberNames.map((name) => getPokemon(name)));
  const typesByName = new Map(
    pokemon.flatMap((entry) => (entry ? [[entry.name, entry.types.map((t) => t.type.name)]] : [])),
  );

  // Games in the same order as everywhere else (newest first), only those with teams.
  const gamesWithTeams = GAMES.filter((game) => teamCounts[game.id]);
  const gameCount = gamesWithTeams.length;

  return (
    <>
      <div className="mb-8 mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-zinc-500">
          {teams.length} {teams.length === 1 ? "team" : "teams"} across {gameCount}{" "}
          {gameCount === 1 ? "game" : "games"}.
        </p>
        <NewTeamButton teamCounts={teamCounts} />
      </div>

      <div className="space-y-10">
        {gamesWithTeams.map((game) => (
          <section key={game.id} aria-labelledby={`game-${game.id}`}>
            <div className="mb-4 flex items-center gap-3">
              <GameArt game={game} className="h-12 w-20 shrink-0 rounded-xl" imageSize={96} />
              <div>
                <h2 id={`game-${game.id}`} className="text-lg font-semibold leading-tight">
                  {game.name}
                </h2>
                <p className="text-sm text-zinc-500">{game.region}</p>
              </div>
            </div>
            <div className="space-y-4">
              {teams
                .filter((team) => team.versionGroup === game.id)
                .map((team) => (
                  <TeamCard key={team.id} team={team} typesByName={typesByName} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function TeamCard({ team, typesByName }: { team: Team; typesByName: Map<string, string[]> }) {
  const bySlot = new Map(team.members.map((member) => [member.slot, member]));

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate font-semibold">{team.name}</h3>
        <span className="text-sm text-zinc-500">
          {team.members.length} / {MAX_TEAM_SIZE}
        </span>
        <TeamMenu team={{ id: team.id, name: team.name }} />
      </header>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {Array.from({ length: MAX_TEAM_SIZE }, (_, index) => {
          const slot = index + 1;
          const member = bySlot.get(slot);
          // Keys must be unique within the list. Member IDs and slot numbers are both
          // plain numbers (member 4 vs. empty slot 4), so prefix them.
          if (!member) {
            return (
              <li key={`empty-${slot}`}>
                <Link
                  href="/"
                  title="Find a Pokémon to add"
                  className="flex h-full min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-zinc-400 transition hover:border-red-400 hover:text-red-500 dark:border-zinc-700"
                >
                  <span aria-hidden className="text-2xl leading-none">+</span>
                  <span className="mt-1 text-xs">Empty</span>
                </Link>
              </li>
            );
          }

          const name = formatName(member.name);
          const types = typesByName.get(member.name) ?? [];
          return (
            <li key={`member-${member.id}`} className="relative">
              <Link
                href={`/pokemon/${member.name}`}
                className="group flex h-full min-h-36 flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50/60 p-2 pb-3 transition hover:border-zinc-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-zinc-700"
              >
                <Image
                  src={artworkURL(member.pokedexId)}
                  alt=""
                  width={80}
                  height={80}
                  className="h-16 w-16 object-contain transition group-hover:scale-110 sm:h-20 sm:w-20"
                />
                <span className="mt-1 text-center text-xs font-medium leading-tight sm:text-sm">{name}</span>
                <span className="mt-1.5 flex flex-wrap justify-center gap-1">
                  {types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </span>
              </Link>
              <div className="absolute right-1 top-1">
                <RemoveMemberButton memberId={member.id} label={`Remove ${name} from ${team.name}`} />
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function TeamsSkeleton() {
  return (
    <div aria-hidden className="mt-2 space-y-4">
      <div className="mb-8 h-5 w-48 animate-pulse rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
      {[0, 1].map((index) => (
        <div
          key={index}
          className="h-52 animate-pulse rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}
