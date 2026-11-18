// Names that don't follow the simple "split on dashes, capitalize" rule.
const SPECIAL_NAMES: Record<string, string> = {
  "mr-mime": "Mr. Mime",
  "mr-mime-galar": "Mr. Mime Galar",
  "mime-jr": "Mime Jr.",
  "mr-rime": "Mr. Rime",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "type-null": "Type: Null",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  flabebe: "Flabébé",
};

/** "charizard-mega-x" → "Charizard Mega X", "mr-mime" → "Mr. Mime". */
export function formatName(name: string): string {
  return (
    SPECIAL_NAMES[name] ??
    name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/** 6 → "#0006" */
export function formatNumber(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/** 0.5 → "½", 2 → "2" — for damage multipliers. */
export function formatMultiplier(multiplier: number): string {
  const fractions: Record<number, string> = { 0.25: "¼", 0.5: "½" };
  return fractions[multiplier] ?? String(multiplier);
}

const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** Official artwork by Pokédex number, without fetching the Pokémon first. */
export function artworkURL(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}
