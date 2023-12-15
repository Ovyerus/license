import { Builtins, Cli } from "clipanion";
import commands from "./commands/index.js";

// TODO: whar
Builtins.HelpCommand.paths.push(["help"]);
Builtins.VersionCommand.paths.push(["version"]);

const cli = new Cli({
  binaryName: "license",
  binaryLabel: "License",
  binaryVersion: "7.0.0",
});

// TODO: add `Builtins.DefinitionsCommand` and have script to write shell completions from output
cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
for (const cmd of commands) cli.register(cmd);

cli.runExit(process.argv.slice(2));
