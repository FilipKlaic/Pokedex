import Image from "next/image";
import { MAX_TEAM_SIZE, type TeamMember } from "@pokedex/core/db/teams";
import { artworkURL, formatName } from "@/lib/format";

/** A compact row of a team's 6 slots: small sprites, empty slots as dashed circles. */
export function TeamSlots({ members }: { members: TeamMember[] }) {
  const bySlot = new Map(members.map((member) => [member.slot, member]));

  return (
    <div className="flex gap-1">
      {Array.from({ length: MAX_TEAM_SIZE }, (_, index) => {
        const member = bySlot.get(index + 1);
        return member ? (
          <span
            key={index}
            title={formatName(member.name)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
          >
            <Image src={artworkURL(member.pokedexId)} alt={formatName(member.name)} width={28} height={28} />
          </span>
        ) : (
          <span
            key={index}
            className="h-8 w-8 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700"
          />
        );
      })}
    </div>
  );
}
