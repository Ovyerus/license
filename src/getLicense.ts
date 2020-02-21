import { Identifiers } from "@ovyerus/licenses";
import identifiers from "@ovyerus/licenses/simple";

import fs from "fs";

export function getLicense(
  license: string,
  replacements: { [key: string]: string } = {}
) {
  if (!identifiers.has(license as Identifiers[number]))
    throw new TypeError("license is not a valid SPDX identifier");

  let modified: string = JSON.parse(
    // eslint-disable-next-line no-sync
    fs.readFileSync(
      require.resolve(`@ovyerus/licenses/licenses/${license}`),
      "utf-8"
    )
    // During testing I've found that loading the largest license (~40kb at time of writing)
    // doesn't appear to have an noticeable impact on performance, however should this be made
    // async just in case??
    // Or perhaps use an LRU cache to offset future loads
  ).licenseText;

  for (const [key, value] of Object.entries(replacements))
    modified = modified.replace(new RegExp(`<${key}>`, "g"), value);

  return modified;
}

export default getLicense;
