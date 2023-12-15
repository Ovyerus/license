import { Command, Option } from "clipanion";
import * as t from "typanion";

export class DefaultCommand extends Command {
  static paths = [["run"], Command.Default];

  static usage = Command.Usage({
    description: "Generate a license for your project",
  });

  // TODO: allow year ranges & lists
  year = Option.String("--year,-y", {
    description:
      "The year to put into the license if applicable. Defaults to the current year.",
    validator: t.cascade(t.isNumber(), t.isInteger()),
  });

  projectName = Option.String("--project-name,-p", {
    description:
      "The name of the project to put in the license." +
      "Defaults to name pulled from package manifests if possible, otherwise the current directory name.",
  });

  raw = Option.Boolean("--raw,-w", {
    description:
      "Print the license text to the console instead of writing to a file.",
  });

  license = Option.String({
    required: false,
  });

  async execute() {
    // TODO: error if license in config is invalid
    this.context.stdout.write("wassup");
  }
}
