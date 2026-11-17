export function searchByName<T extends { name: string }>(
  items: T[],
  query: string,
  limit: number,
): T[] {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "-");
  if (normalized === "") {
    return [];
  }

  const startsWith = items.filter((item) => item.name.startsWith(normalized));
  const contains = items.filter(
    (item) => !item.name.startsWith(normalized) && item.name.includes(normalized),
  );

  return [...startsWith, ...contains].slice(0, limit);
}
