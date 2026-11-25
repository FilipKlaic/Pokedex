"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useTransition, type FormEvent } from "react";
import { MAX_TEAM_NAME_LENGTH } from "@pokedex/core/db/teams";
import type { Game } from "@pokedex/core/logic/games";
import { createTeam } from "@/lib/team-actions";
import { GameArt } from "./game-art";
import { GamePicker } from "./game-picker";

/** "New team" on the My teams page: pick a game, then name the team. */
export function NewTeamButton({ teamCounts }: { teamCounts: Record<string, number> }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [game, setGame] = useState<Game | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpen() {
    setGame(null);
    setError(null);
    open();
  }

  function handleSelectGame(selected: Game) {
    setGame(selected);
    setName(`${selected.versions[0].name} team`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!game) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createTeam(game.id, name);
      if (result.ok) {
        close();
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <>
      <Button radius="xl" onClick={handleOpen}>
        New team
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        size={game ? "md" : "xl"}
        centered
        title={<span className="text-lg font-semibold">New team</span>}
      >
        {game ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <GameArt game={game} className="h-14 w-24 shrink-0 rounded-xl" imageSize={96} />
              <p className="min-w-0 flex-1 font-medium leading-tight">{game.name}</p>
              <Button variant="subtle" color="gray" size="xs" onClick={() => setGame(null)}>
                Change game
              </Button>
            </div>
            <TextInput
              label="Team name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              maxLength={MAX_TEAM_NAME_LENGTH}
              data-autofocus
            />
            {error && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth loading={pending} disabled={name.trim() === ""}>
              Create team
            </Button>
          </form>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-500">Which game is this team for?</p>
            <GamePicker onSelect={handleSelectGame} teamCounts={teamCounts} />
          </>
        )}
      </Modal>
    </>
  );
}
