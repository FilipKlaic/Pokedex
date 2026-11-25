"use client";

import { GAMES, type Game } from "@pokedex/core/logic/games";
import { GameArt } from "./game-art";

type GamePickerProps = {
  onSelect: (game: Game) => void;
  /** Games that can be picked. Leave out to allow every game. */
  availableGameIds?: string[];
  /** How many teams the visitor has per game ID, shown as a badge. */
  teamCounts: Record<string, number>;
  /** Shown on games that can't be picked. */
  unavailableLabel?: string;
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

/** A grid of game "covers" to choose from, newest game first. */
export function GamePicker({
  onSelect,
  availableGameIds,
  teamCounts,
  unavailableLabel = "Not available",
}: GamePickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {GAMES.map((game) => {
        const available = !availableGameIds || availableGameIds.includes(game.id);
        const teamCount = teamCounts[game.id] ?? 0;

        return (
          <li key={game.id}>
            <button
              type="button"
              disabled={!available}
              onClick={() => onSelect(game)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:hover:translate-y-0 disabled:hover:shadow-none dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="relative">
                <GameArt game={game} className="aspect-[16/10] w-full" />
                {teamCount > 0 && (
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-zinc-900 shadow-sm">
                    {teamCount} {teamCount === 1 ? "team" : "teams"}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-2.5">
                <span className="text-sm font-medium leading-tight">{game.name}</span>
                <span className="mt-0.5 text-xs text-zinc-500">
                  {available ? `Gen ${ROMAN[game.generation]} · ${game.region}` : unavailableLabel}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
