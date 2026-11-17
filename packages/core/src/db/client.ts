import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

function createPrismaClient(): PrismaClient {
  // Each app loads DATABASE_URL from the root .env before this runs.
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Check the .env file in the repository root.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// The Next.js dev server re-runs modules when files change. Keeping the client
// on globalThis means a reload reuses it instead of opening a new connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
