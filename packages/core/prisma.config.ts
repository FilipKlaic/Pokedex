import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// The .env file lives in the repository root and is shared by every app.
config({ path: "../../.env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
