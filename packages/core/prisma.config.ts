import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// The .env file lives in the repository root and is shared by every app.
config({ path: "../../.env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Optional so "prisma generate" works without a database (e.g. on Vercel).
    url: process.env.DATABASE_URL,
  },
});
