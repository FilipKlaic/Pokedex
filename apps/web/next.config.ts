import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Locally, the shared .env lives in the repository root. On a host like Vercel
// there is no .env file; the variables are set in the project settings instead.
const rootEnvFile = path.resolve(process.cwd(), "../../.env");
if (existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
  // "My Pokémon" was replaced by "My teams"; keep old links and bookmarks working.
  async redirects() {
    return [{ source: "/pokedex", destination: "/teams", permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
