"use client";

import { ActionIcon, Button, Menu, Modal, TextInput } from "@mantine/core";
import { useState, useTransition, type FormEvent } from "react";
import { MAX_TEAM_NAME_LENGTH } from "@pokedex/core/db/teams";
import { deleteTeam, renameTeam, type ActionResult } from "@/lib/team-actions";

type TeamMenuProps = {
  team: { id: number; name: string };
};

/** The "⋯" menu on a team card, with Rename and Delete. */
export function TeamMenu({ team }: TeamMenuProps) {
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);
  const [name, setName] = useState(team.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog(which: "rename" | "delete") {
    setName(team.name);
    setError(null);
    setDialog(which);
  }

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setDialog(null);
      } else {
        setError(result.message);
      }
    });
  }

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(() => renameTeam(team.id, name));
  }

  const errorMessage = error && (
    <p role="alert" className="text-sm text-red-700 dark:text-red-400">
      {error}
    </p>
  );

  return (
    <>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" radius="xl" aria-label={`Options for ${team.name}`}>
            <span aria-hidden className="text-lg leading-none">⋯</span>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => openDialog("rename")}>Rename</Menu.Item>
          <Menu.Item color="red" onClick={() => openDialog("delete")}>
            Delete team
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={dialog === "rename"}
        onClose={() => setDialog(null)}
        centered
        title={<span className="font-semibold">Rename team</span>}
      >
        <form onSubmit={handleRename} className="space-y-4">
          <TextInput
            label="Team name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            maxLength={MAX_TEAM_NAME_LENGTH}
            data-autofocus
          />
          {errorMessage}
          <Button type="submit" fullWidth loading={pending} disabled={name.trim() === ""}>
            Save
          </Button>
        </form>
      </Modal>

      <Modal
        opened={dialog === "delete"}
        onClose={() => setDialog(null)}
        centered
        title={<span className="font-semibold">Delete {team.name}?</span>}
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The team and the Pokémon in it will be removed. This can&apos;t be undone.
        </p>
        {errorMessage}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="default" onClick={() => setDialog(null)} disabled={pending}>
            Cancel
          </Button>
          <Button color="red" loading={pending} onClick={() => run(() => deleteTeam(team.id))}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
