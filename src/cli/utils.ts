import gitPath from "git-config-path";
import { sync as parseGitConfig } from "parse-git-config";

import path from "path";

import { cfg } from ".";

export function isAcceptedYear(str: string): boolean {
  const split = str.split("-");

  return (
    // standalone year (2004)
    /^\d{4}$/.test(str) ||
    // year range (2004-2010)
    (split.length === 2 && split.every(x => /^\d{4}$/.test(x))) ||
    // list of years (2001, 2002-2005, 2007)
    (/, ?/.test(str) &&
      // recurse to allow ranges or standalone years in the list
      str
        .split(",")
        .map(x => x.trim())
        .every(isAcceptedYear))
  );
}
export const convertProject = (str: string) => ({
  path: path.resolve(str),
  name: path.basename(path.resolve(str))
});

export const nonEmpty = (name: string) => (val: string) => {
  if (val === "") throw new TypeError(`${name} cannot be empty`);
  else return val;
};

const gitConfig = () => parseGitConfig({ cwd: "/", path: gitPath("global") });

export const getUserName = (): string =>
  cfg.get("name") || gitConfig().user.name || process.env.USER;
export const getUserEmail = (): string =>
  cfg.get("email") || gitConfig().user.email;
