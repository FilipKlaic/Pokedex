import { cookies } from "next/headers";

// Teams belong to whoever holds this cookie. There are no accounts: the first
// time a visitor creates a team, they get a random ID, and every team query
// filters on it. Clearing cookies or switching browsers means starting over.
const OWNER_COOKIE = "pokedex-owner";

// Browsers cap cookie lifetimes at 400 days. The cookie is renewed on every
// change to a team, so it only expires after 400 days without any.
const MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * The visitor's owner ID, or null if they haven't created a team yet. Works
 * anywhere on the server, including while rendering pages.
 */
export async function readOwnerId(): Promise<string | null> {
  const value = (await cookies()).get(OWNER_COOKIE)?.value;
  // Anyone can edit their cookies, so ignore values we didn't hand out.
  return value && UUID_PATTERN.test(value) ? value : null;
}

/**
 * The visitor's owner ID, created on first use. Sets a cookie, so it only works
 * in Server Actions, not while rendering a page.
 */
export async function getOrCreateOwnerId(): Promise<string> {
  const ownerId = (await readOwnerId()) ?? crypto.randomUUID();
  (await cookies()).set(OWNER_COOKIE, ownerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
  return ownerId;
}
