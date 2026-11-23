import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// The Next.js dev server re-runs modules when files change. Keeping the client
// on globalThis means a reload reuses it instead of opening a new connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * The shared database client, created on first use. Creating it lazily (not when
 * this file is imported) lets tools like `next build` import the code without a
 * database being configured.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set. Check the .env file in the repository root.");
    }
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  }
  return globalForPrisma.prisma;
}
