import gitPath from "git-config-path";
import { sync as parseGitConfig } from "parse-git-config";

import os from "os";
import path from "path";

import { cfg } from ".";

/**
 * Test if a string is a valid npm package name.
 * Sort of a port of is-valid-npm-name but without the dependencies
 */
export function isNpmPackageName(str: string): boolean {
  return !(
    // musn't be blank
    (
      !str ||
      // can't have leading or trailing whitespace
      str.trim() !== str ||
      // can't be longer than 214 chars
      str.length > 214 ||
      // can't start with `.` or `_`
      [".", "_"].includes(str[0]) ||
      // can't have uppercase
      str !== str.toLowerCase() ||
      // scope checks
      (str.startsWith("@") &&
        !(
          // can't have multiple `@`
          (
            str.indexOf("@") !== str.lastIndexOf("@") ||
            // needs to have a separating slash
            !str.includes("/") ||
            // can't have multiple `/`
            str.indexOf("/") !== str.lastIndexOf("/") ||
            // recursive check both parts of the scopes name
            isNpmPackageName(str.split("/")[0].slice(1)) ||
            isNpmPackageName(str.split("/")[1])
          )
        )) ||
      // needs to be url safe
      encodeURIComponent(str) !== str
    )
  );
}

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

/** Resolve a path, including the expansion of `~/` paths */
const expandPath = (path_: string) =>
  path.resolve(path_.replace(/^~(?=$|\/|\\)/, os.homedir()));

export const convertProject = (str: string) => ({
  path: expandPath(str),
  name: path.basename(expandPath(str))
});

export const nonEmpty = (name: string) => (val: string) => {
  if (val === "") throw new TypeError(`${name} cannot be empty`);
  else return val;
};

const gitConfig = () => parseGitConfig({ cwd: "/", path: gitPath("global") });

export const getUserName = (): string =>
  cfg.get("name") || gitConfig().user?.name || process.env.USER;
export const getUserEmail = (): string =>
  cfg.get("email") || gitConfig().user?.email;
