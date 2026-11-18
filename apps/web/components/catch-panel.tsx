"use client";

import { useActionState } from "react";
import type { CatchResult } from "@/lib/actions";

type CatchPanelProps = {
  caught: boolean;
  chancePercent: number;
  throwAction: (previous: CatchResult, formData: FormData) => Promise<CatchResult>;
};

const MESSAGE_STYLES = {
  caught: "text-emerald-700 dark:text-emerald-400",
  escaped: "text-amber-700 dark:text-amber-400",
  error: "text-red-700 dark:text-red-400",
};

export function CatchPanel({ caught, chancePercent, throwAction }: CatchPanelProps) {
  const [result, formAction, pending] = useActionState(throwAction, null);

  return (
    <div className="mt-4 flex flex-col items-center gap-2 text-center">
      {caught ? (
        <p className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          ✓ In your Pokédex
        </p>
      ) : (
        <form action={formAction} className="flex flex-col items-center gap-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Throwing…" : "Throw Pokéball"}
          </button>
          <p className="text-xs text-zinc-500">{chancePercent}% catch chance</p>
        </form>
      )}

      {result && (
        <p role="status" className={`text-sm ${MESSAGE_STYLES[result.outcome]}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
