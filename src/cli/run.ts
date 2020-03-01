import licenses, { Identifiers } from "@ovyerus/licenses";
import identifiers from "@ovyerus/licenses/simple";
import detectIntent from "detect-indent";
import prompts from "prompts";
import wrap from "wrap-text";

import { promises as fs, existsSync } from "fs";
import path from "path";

import findLicense from "../findLicense";
import getLicense from "../getLicense";

const osiOnlyIdentifiers = Object.entries(licenses)
  .filter(([, { osiApproved }]) => osiApproved)
  .map(([identifier]) => identifier);

interface RunArgv {
  license?: Identifiers[number];
  name: string;
  email: string;
  year: string;
  raw?: boolean;
  nonOsi?: boolean;
  project: ReturnType<typeof import("./utils").convertProject>;
  projectName?: string;
}

export default async function run({
  license: license_,
  name: author,
  email,
  year,
  // TODO: other fields for other placeholders in @ovyerus/licenses
  raw,
  nonOsi,
  project,
  projectName
}: RunArgv) {
  if (raw) {
    if (!license_) throw new Error("Specify what license to print");
    if (!identifiers.has(license_))
      throw new Error("license must be a valid SPDX identifier");

    const { licenseText } = await import(
      `@ovyerus/licenses/licenses/${license_}`
    );

    console.log(licenseText);
    return;
  }

  const fp = (str: string) => path.join(project.path, str);

  let license = license_;
  let filename = "LICENSE";
  const currentLicense = (
    await fs
      .readdir(fp("./"))
      .then(files =>
        Promise.all(files.map(f => fs.lstat(fp(f)))).then(s =>
          s.map((stat, i) => [files[i], stat.isFile()] as const)
        )
      )
  ).find(([f, isFile]) => isFile && /^LICENSE(\.md|\.txt)?$/i.test(f));
  // Check if an existing LICENSE file already exists

  if (currentLicense) {
    console.log("Looks like there's already a license file for this project.");

    const { replaceLicense }: { replaceLicense: boolean } = await prompts({
      name: "replaceLicense",
      type: "confirm",
      message: "Do you want to replace it?"
    });

    if (replaceLicense) [filename] = currentLicense;
    else return console.log("Exiting...");
  }

  if (!license || !identifiers.has(license)) {
    const response = await prompts({
      name: "license",
      type: "autocomplete",
      message: "Search for the license you want",
      // This + `suggest` is probably super inefficient but its the best we have
      // without repeating code from findLicense
      choices: (nonOsi
        ? Array.from(identifiers)
        : osiOnlyIdentifiers
      ).map(x => ({ title: x, value: x })),
      suggest: input =>
        Promise.resolve(
          findLicense(input, !nonOsi).map(x => ({ title: x, value: x }))
        )
    });

    ({ license } = response);

    if (!license) return;
  }

  const text = wrap(
    getLicense(license, {
      author,
      year,
      email,
      project: projectName ?? project.name
    })
  );

  await fs.writeFile(fp(filename), text);

  // TODO: what other manifests contain license info???
  if (existsSync(fp("./package.json"))) {
    const rawPackage = await fs.readFile(fp("./package.json"), "utf-8");
    const { indent } = detectIntent(rawPackage);
    const pkg = JSON.parse(rawPackage);
    pkg.license = license;

    await fs.writeFile(fp("./package.json"), JSON.stringify(pkg, null, indent));
  }

  console.log(`Successfully wrote the ${license} license`);
  console.log(
    "Most information *should* have been updated with your details but " +
      "it is best to double check to make sure it is all correct."
  );
}
