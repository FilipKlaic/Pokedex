import type { CLICommand, State } from "./state.js";

export function cleanInput(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
}

export function startREPL(state: State): void {
  const { rl, commands } = state;

  rl.prompt();

  rl.on("line", async (input: string) => {
    const words = cleanInput(input);

    if (words.length === 0) {
      rl.prompt();
      return;
    }

    const [commandName, ...args] = words;
    const cmd: CLICommand | undefined = commands[commandName];

    if (!cmd) {
      console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
      rl.prompt();
      return;
    }

    try {
      await cmd.callback(state, ...args);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Error: ${err.message}`);
        if (err.cause) {
          console.log(`  Cause:`, err.cause);
        }
      } else {
        console.log(err);
      }
    }

    rl.prompt();
  });
}