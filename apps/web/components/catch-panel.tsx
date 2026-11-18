"use client";

import { useActionState } from "react";
import type { CatchResult } from "@/lib/actions";

type CatchPanelProps = {
  caught: boolean;
  chancePercent: number;
  throwAction: (previous: CatchResult, formData: FormData) => Promise<CatchResult>;
};

const MESSAGE_STYLES = {
  caught: "text-green-700 dark:text-green-400",
  escaped: "text-amber-700 dark:text-amber-400",
  error: "text-red-700 dark:text-red-400",
};

export function CatchPanel({ caught, chancePercent, throwAction }: CatchPanelProps) {
  const [result, formAction, pending] = useActionState(throwAction, null);

  return (
    <div className="flex flex-col items-start gap-2">
      {caught ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 dark:bg-green-950/60 dark:text-green-300">
          <span aria-hidden>✓</span> In your Pokédex
        </p>
      ) : (
        <form action={formAction} className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-red-500/30 transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Throwing…" : "Catch"}
          </button>
          <span className="text-xs text-zinc-500">{chancePercent}% catch chance</span>
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
