"use client";

import { CloseButton } from "@mantine/core";
import { useTransition } from "react";
import { removeFromTeam } from "@/lib/team-actions";

/** The small × on a team slot. */
export function RemoveMemberButton({ memberId, label }: { memberId: number; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <CloseButton
      size="sm"
      radius="xl"
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await removeFromTeam(memberId);
        })
      }
      className="bg-white/80 shadow-sm backdrop-blur dark:bg-zinc-900/80"
    />
  );
}
