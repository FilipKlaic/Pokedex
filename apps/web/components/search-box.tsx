import Form from "next/form";

export function SearchBox() {
  return (
    <Form action="/search" role="search" className="relative ml-auto">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 4 4" strokeLinecap="round" />
      </svg>
      <input
        name="q"
        type="search"
        placeholder="Search"
        aria-label="Search Pokémon"
        className="h-9 w-32 rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:w-44 focus:border-zinc-400 focus:bg-white sm:w-52 sm:focus:w-64 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:bg-zinc-950"
      />
    </Form>
  );
}
