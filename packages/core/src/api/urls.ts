/**
 * Reads the numeric id from a PokéAPI resource URL,
 * e.g. "https://pokeapi.co/api/v2/pokemon/25/" → 25.
 */
export function idFromResourceURL(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) {
    throw new Error(`No id found in PokéAPI URL: ${url}`);
  }
  return Number(match[1]);
}
