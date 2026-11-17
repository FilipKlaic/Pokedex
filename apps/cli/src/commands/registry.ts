import type { CLICommand } from "../state.js";
import { commandCatch } from "./catch.js";
import { commandClear } from "./clear.js";
import { commandEvolution } from "./evolution.js";
import { commandExit } from "./exit.js";
import { commandExplore } from "./explore.js";
import { commandHelp } from "./help.js";
import { commandInspect } from "./inspect.js";
import { commandMap, commandMapBack } from "./map.js";
import { commandPokedex } from "./pokedex.js";
import { commandWeakness } from "./weakness.js";

export function getCommands(): Record<string, CLICommand> {
  return {
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    clear: {
      name: "clear",
      description: "Clear the screen",
      callback: commandClear,
    },
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    map: {
      name: "map",
      description: "Show the next 20 locations",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Show the previous 20 locations",
      callback: commandMapBack,
    },
    explore: {
      name: "explore",
      description: "List the Pokémon in a location area: explore <area>",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Try to catch a Pokémon: catch <pokemon>",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "Show details of a caught Pokémon: inspect <pokemon>",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "List all the Pokémon you've caught",
      callback: commandPokedex,
    },
    evolution: {
      name: "evolution",
      description: "Show a Pokémon's evolution chain: evolution <pokemon>",
      callback: commandEvolution,
    },
    weakness: {
      name: "weakness",
      description: "Show a Pokémon's type weaknesses and resistances: weakness <pokemon>",
      callback: commandWeakness,
    },
  };
}
