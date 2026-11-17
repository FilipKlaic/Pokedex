const TYPE_COLORS: Record<string, string> = {
  normal: "bg-stone-400 text-white",
  fire: "bg-orange-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-600 text-white",
  electric: "bg-yellow-400 text-black",
  ice: "bg-cyan-300 text-black",
  fighting: "bg-red-700 text-white",
  poison: "bg-purple-500 text-white",
  ground: "bg-amber-600 text-white",
  flying: "bg-indigo-300 text-black",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-black",
  rock: "bg-yellow-700 text-white",
  ghost: "bg-violet-700 text-white",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-stone-700 text-white",
  steel: "bg-slate-400 text-black",
  fairy: "bg-pink-300 text-black",
};

const FALLBACK_COLOR = "bg-zinc-500 text-white";

export function TypeBadge({ type }: { type: string }) {
  const color: string | undefined = TYPE_COLORS[type];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${color ?? FALLBACK_COLOR}`}
    >
      {type}
    </span>
  );
}
