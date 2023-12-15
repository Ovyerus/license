import { homedir } from "node:os";
import { join } from "node:path";
import Conf from "conf";
import * as Toml from "smol-toml";
import pkg from "../../package.json" assert { type: "json" };

const configDir = join(
  process.env.XDG_CONFIG_HOME || join(homedir(), "/.config"),
  "/license-node",
);

export interface Config {
  name: string;
  email: string;
  defaultLicense: string;
}

export const config = new Conf<Config>({
  cwd: configDir,
  fileExtension: "toml",
  projectName: pkg.name,
  projectVersion: pkg.version,
  serialize: Toml.stringify,
  deserialize: Toml.parse as any,
  schema: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    defaultLicense: { type: "string" },
  },
});
