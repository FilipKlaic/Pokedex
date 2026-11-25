"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import {
  countTeamsByGame,
  MAX_TEAM_NAME_LENGTH,
  MAX_TEAM_SIZE,
  type Team,
} from "@pokedex/core/db/teams";
import { findGame, type Game } from "@pokedex/core/logic/games";
import { formatName } from "@/lib/format";
import { addToTeam, createTeam, type ActionResult } from "@/lib/team-actions";
import { GameArt } from "./game-art";
import { GamePicker } from "./game-picker";
import { TeamSlots } from "./team-slots";

type AddToTeamProps = {
  pokemon: { id: number; name: string };
  /** IDs of the games this Pokémon is in. Other games can't be picked. */
  availableGameIds: string[];
  /** All of the visitor's teams. */
  teams: Team[];
};

// The last game picked is remembered in this browser, so adding several Pokémon
// to the same playthrough skips the game step.
const LAST_GAME_KEY = "pokedex:last-game";

/** The "Add to team" button on a Pokémon's page, with its two-step modal. */
export function AddToTeam({ pokemon, availableGameIds, teams }: AddToTeamProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);

  const displayName = formatName(pokemon.name);
  const game = gameId ? findGame(gameId) : undefined;
  const teamsWithPokemon = teams.filter((team) =>
    team.members.some((member) => member.pokedexId === pokemon.id),
  );
  const teamCounts = countTeamsByGame(teams);

  function handleOpen() {
    setResult(null);
    const lastGame = readLastGame();
    setGameId(lastGame && availableGameIds.includes(lastGame) ? lastGame : null);
    open();
  }

  function handleSelectGame(selected: Game) {
    setGameId(selected.id);
    writeLastGame(selected.id);
  }

  function handleDone(done: ActionResult) {
    setResult(done);
    close();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          radius="xl"
          onClick={handleOpen}
          disabled={availableGameIds.length === 0}
          className="shadow-sm shadow-red-500/30"
        >
          Add to team
        </Button>
        {availableGameIds.length === 0 ? (
          <span className="text-xs text-zinc-500">Not in any of the supported games.</span>
        ) : (
          teamsWithPokemon.length > 0 && (
            <span className="text-xs text-zinc-500">
              On {teamsWithPokemon.length === 1 ? "your team" : "your teams"}{" "}
              {teamsWithPokemon.map((team, index) => (
                <span key={team.id}>
                  {index > 0 && ", "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{team.name}</span>
                </span>
              ))}
            </span>
          )
        )}
      </div>

      {result && (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          {result.message}{" "}
          <Link href="/teams" className="font-medium underline underline-offset-2">
            View your teams
          </Link>
        </p>
      )}

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        centered
        title={<span className="text-lg font-semibold">Add {displayName} to a team</span>}
      >
        {game ? (
          <TeamStep
            game={game}
            pokemon={pokemon}
            teams={teams.filter((team) => team.versionGroup === game.id)}
            onBack={() => setGameId(null)}
            onDone={handleDone}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-500">
              Which game are you playing? Games without {displayName} are greyed out.
            </p>
            <GamePicker
              onSelect={handleSelectGame}
              availableGameIds={availableGameIds}
              teamCounts={teamCounts}
              unavailableLabel={`No ${displayName} in this game`}
            />
          </>
        )}
      </Modal>
    </div>
  );
}

type TeamStepProps = {
  game: Game;
  pokemon: { id: number; name: string };
  /** The visitor's teams for this game. */
  teams: Team[];
  onBack: () => void;
  onDone: (result: ActionResult) => void;
};

/** Step 2: pick one of the game's teams, or create one with the Pokémon in it. */
function TeamStep({ game, pokemon, teams, onBack, onDone }: TeamStepProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState(`${game.versions[0].name} team`);
  const displayName = formatName(pokemon.name);

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        onDone(result);
      } else {
        setError(result.message);
      }
    });
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(() => createTeam(game.id, newTeamName, pokemon.name));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GameArt game={game} className="h-14 w-24 shrink-0 rounded-xl" imageSize={96} />
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight">{game.name}</p>
          <p className="text-xs text-zinc-500">{game.region}</p>
        </div>
        <Button variant="subtle" color="gray" size="xs" onClick={onBack} disabled={pending}>
          Change game
        </Button>
      </div>

      {teams.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Pick a team
          </h3>
          <ul className="space-y-2">
            {teams.map((team) => {
              const isFull = team.members.length >= MAX_TEAM_SIZE;
              const hasPokemon = team.members.some((member) => member.pokedexId === pokemon.id);
              return (
                <li key={team.id}>
                  <button
                    type="button"
                    disabled={isFull || pending}
                    onClick={() => run(() => addToTeam(team.id, pokemon.name))}
                    className="flex w-full flex-col items-start gap-2 rounded-2xl sm:flex-row sm:items-center sm:gap-3 border border-zinc-200 p-3 text-left transition hover:border-red-400 hover:bg-red-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:bg-transparent dark:border-zinc-800 dark:hover:border-red-500/60 dark:hover:bg-red-500/5 dark:disabled:hover:border-zinc-800"
                  >
                    <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                      <p className="truncate font-medium">{team.name}</p>
                      <p className="text-xs text-zinc-500">
                        {isFull ? "Full" : `${team.members.length} / ${MAX_TEAM_SIZE}`}
                        {hasPokemon && ` · already has ${displayName}`}
                      </p>
                    </div>
                    <TeamSlots members={team.members} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {teams.length > 0 ? "Or start a new team" : `Start your first ${game.name} team`}
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <TextInput
            aria-label="Team name"
            placeholder="Team name"
            value={newTeamName}
            onChange={(event) => setNewTeamName(event.currentTarget.value)}
            maxLength={MAX_TEAM_NAME_LENGTH}
            className="flex-1"
          />
          <Button type="submit" loading={pending} disabled={newTeamName.trim() === ""}>
            Create with {displayName}
          </Button>
        </form>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// localStorage can throw (private mode, blocked storage). The game step is a
// fine fallback, so errors are ignored.
function readLastGame(): string | null {
  try {
    return localStorage.getItem(LAST_GAME_KEY);
  } catch {
    return null;
  }
}

function writeLastGame(gameId: string): void {
  try {
    localStorage.setItem(LAST_GAME_KEY, gameId);
  } catch {
    // Not remembering the game is fine.
  }
}
