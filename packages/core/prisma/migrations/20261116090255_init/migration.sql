-- CreateTable
CREATE TABLE "CaughtPokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "caughtAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaughtPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaughtPokemon_name_key" ON "CaughtPokemon"("name");
