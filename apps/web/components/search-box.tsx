import Form from "next/form";

export function SearchBox() {
  return (
    <Form action="/search" role="search" className="ml-auto">
      <input
        name="q"
        type="search"
        placeholder="Search Pokémon…"
        aria-label="Search Pokémon"
        className="w-40 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm outline-none focus:border-zinc-500 sm:w-56 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400"
      />
    </Form>
  );
}
