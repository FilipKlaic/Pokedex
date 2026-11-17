# Pokédex

A Pokédex written in TypeScript, with two ways to use it:

- **A terminal app (CLI):** explore locations, catch Pokémon and inspect them from a command prompt.
- **A web app (Next.js):** browse every Pokémon by generation, search by name, see stats, type
  matchups and evolutions, and catch Pokémon with a button.

Both apps share the same code and the same PostgreSQL database, so a Pokémon caught in the
terminal shows up on the website and the other way around. Pokémon data comes from the free
[PokéAPI](https://pokeapi.co), which needs no API key.

## Tech stack

| Part | Technology |
|---|---|
| Language | TypeScript |
| Web app | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Database | PostgreSQL 17, running in Docker |
| Database access | Prisma ORM 7 |
| Containers | Rancher Desktop (or any Docker setup) |
| Project layout | npm workspaces (monorepo) |

## Project structure

```
packages/core/     Shared code: PokéAPI client, types, game logic, Prisma schema and database access
apps/cli/          The terminal app
apps/web/          The Next.js web app
docker-compose.yml The PostgreSQL database
.env.example       Template for the .env file you create during setup
```

## Prerequisites

1. **Node.js 22 or newer.** Check with `node --version`.
2. **Rancher Desktop**, from [rancherdesktop.io](https://rancherdesktop.io).
   - In *Preferences → Container Engine*, choose **dockerd (moby)**. This makes the standard
     `docker` and `docker compose` commands available.
   - Make sure Rancher Desktop is running before you start the database.
   - Docker Desktop or any other Docker setup with Docker Compose works too.

Check that Docker is ready:

```
docker compose version
```

## Setup

Run these commands from the project root (the folder containing this README).

### 1. Install dependencies

```
npm install
```

This installs the packages for all three parts of the project in one go.

> If npm warns that install scripts for `prisma` and `@prisma/engines` aren't approved, approve
> them and install again. Prisma needs these scripts to download its database engine.
>
> ```
> npm install-scripts approve prisma @prisma/engines
> npm install
> ```

### 2. Create your `.env` file

Copy the template:

```
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

The default values match the database in `docker-compose.yml`, so you don't need to change
anything. `.env` is ignored by git, so your settings stay on your machine.

### 3. Start the database

```
docker compose up -d
```

The first time, this downloads the PostgreSQL image, which takes a minute. Check that it's running:

```
docker compose ps
```

The `pokedex-db` container should have the status `Up`. Your data is stored in a Docker volume,
so it survives restarts.

### 4. Set up the database tables

```
npm run db:generate
npm run db:migrate
```

- `db:generate` creates the TypeScript database client from `packages/core/prisma/schema.prisma`.
- `db:migrate` creates the tables in PostgreSQL from the migration files.

### 5. Run the apps

**Web app:**

```
npm run web
```

Then open [http://localhost:3000](http://localhost:3000).

**Terminal app:**

```
npm run cli
```

Type `help` to see all commands, for example `map`, `explore <area>`, `catch <pokemon>`,
`inspect <pokemon>`, `pokedex`, `evolution <pokemon>` and `weakness <pokemon>`.

You can run both at the same time in separate terminals. They use the same database.

## npm scripts

| Command | What it does |
|---|---|
| `npm run web` | Builds the shared code, then starts the web app on port 3000 |
| `npm run cli` | Builds the shared code, then starts the terminal app |
| `npm run build:core` | Rebuilds the shared code in `packages/core` |
| `npm run watch:core` | Rebuilds the shared code automatically on every save |
| `npm run db:generate` | Regenerates the Prisma client after a schema change |
| `npm run db:migrate` | Applies migrations, or creates a new one after a schema change |
| `npm run db:studio` | Opens Prisma Studio, a browser view of the database |

The web and terminal apps use the **compiled** version of `packages/core`. If you change code in
`packages/core` while an app is running, run `npm run build:core` (or keep `npm run watch:core`
running) and restart the app.

## Troubleshooting

**`Can't reach database server at localhost:5432`**
The database isn't running. Start Rancher Desktop, then run `docker compose up -d`.

**`port is already allocated` when starting the database**
Another program, often a locally installed PostgreSQL, is using port 5432. In
`docker-compose.yml`, change `"5432:5432"` to `"5433:5432"`, and change `5432` to `5433` in your
`.env`.

**`Cannot find module '.../generated/prisma/client.js'`**
Run `npm run db:generate`.

**`The table public.CaughtPokemon does not exist`**
Run `npm run db:migrate`.

**`fetch failed` with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` or `SELF_SIGNED_CERT_IN_CHAIN`**
Your network (often a company network) inspects HTTPS traffic, and Node doesn't trust its
certificate. Tell Node to also trust your operating system's certificates by setting this
environment variable, then restart your terminal or editor:

```
# Windows (PowerShell), permanent for your user
[Environment]::SetEnvironmentVariable("NODE_USE_SYSTEM_CA", "1", "User")

# macOS / Linux, for the current terminal
export NODE_USE_SYSTEM_CA=1
```

Don't use `NODE_TLS_REJECT_UNAUTHORIZED=0` instead. It turns off certificate checks completely.

**Red errors in VS Code about code from `packages/core`**
Run `npm run build:core`. If they stay, open the Command Palette and run
*TypeScript: Restart TS Server*.

## Stopping and resetting

| Command | Effect |
|---|---|
| `docker compose stop` | Stops the database, keeps your data |
| `docker compose start` | Starts it again |
| `docker compose down` | Removes the container, keeps your data in the volume |
| `docker compose down -v` | Removes the container **and deletes all caught Pokémon** |

## Credits

Pokémon data and sprites come from [PokéAPI](https://pokeapi.co). Pokémon and Pokémon character
names are trademarks of Nintendo, Creatures Inc. and GAME FREAK inc. This is a non-commercial
learning project.
