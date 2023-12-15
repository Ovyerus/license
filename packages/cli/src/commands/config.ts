import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { Command, Option, UsageError } from "clipanion";
import * as t from "typanion";
import { config } from "../lib/config.js";

export class ConfigCommand extends Command {
  static paths = [["config"], ["configure"]];

  static usage = Command.Usage({
    description: "Edit and view various options",
  });

  // TODO: allow setting the individual fields with flags in interactive mode?
  interactive = Option.Boolean("--interactive,-i", false, {
    description: "Whether to run through an interactive configuration setup.",
  });

  edit = Option.Boolean("--edit,-e", false);
  list = Option.Boolean("--list,-l", false);

  name = Option.String("--name");
  email = Option.String("--email");
  license = Option.String("--license");

  static schema = [
    t.hasMutuallyExclusiveKeys(["interactive", "edit", "list"], {
      missingIf: "falsy",
    }),
    t.hasKeyRelationship("edit", t.KeyRelationship.Forbids, [
      "name",
      "email",
      "license",
    ]),
    t.hasKeyRelationship("list", t.KeyRelationship.Forbids, [
      "name",
      "email",
      "license",
    ]),
  ];

  async execute() {
    // Set each value interactively
    if (this.interactive) {
      // interactive cli for setting values
      return;
    }

    // Open editor to edit config
    if (this.edit) {
      if (!this.context.env.EDITOR)
        throw new UsageError(
          "You must set the EDITOR environment variable to use --edit.",
        );

      // TODO: properly handle editors with spaces in their name (probably rare but would be good)
      // see how other programs handle this
      const [command, ...args] = this.context.env.EDITOR.split(" ");
      spawn(command, args.concat(config.path));
      return;
    }

    // List contents of config file if possible.
    if (this.list) {
      const configText = await readFile(config.path).catch(() => "");
      this.context.stdout.write(configText);
      return;
    }

    // Write to config when not in any special mode
    if (!this.name && !this.email && !this.license)
      throw new UsageError(
        "`config` requires at least one of --name,--email,--license in non-interactive mode.",
      );

    if (this.name) config.set("name", this.name);
    if (this.email) config.set("email", this.email);
    if (this.license) config.set("license", this.license);
  }
}
