/** Builds a search page URL, leaving out empty filters: "/search?q=char&type=fire". */
export function searchURL(query: string, type: string | null): string {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (type) {
    params.set("type", type);
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}
