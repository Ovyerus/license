import licenses, { Identifiers } from "@ovyerus/licenses";
import identifiers from "@ovyerus/licenses/simple";
import detectIntent from "detect-indent";
import prompts from "prompts";
import wrap from "wrap-text";

import { promises as fs, existsSync } from "fs";

import getLicense from "../getLicense";

const osiOnlyIdentifiers = Object.entries(licenses)
  .filter(([, { osiApproved }]) => osiApproved)
  .map(([identifier]) => identifier);

interface RunArgv {
  license?: Identifiers[number];
  name: string;
  email: string;
  year: string;
  raw: boolean;
  nonOsi: boolean;
}

export default async function run({
  license: license_,
  name: author,
  email,
  year,
  // TODO: other fields for other placeholders in @ovyerus/licenses
  raw,
  nonOsi
}: RunArgv) {
  if (raw) {
    if (!license_) throw new Error("Specify what license to print");
    if (!identifiers.has(license_))
      throw new Error("license must be a valid SPDX identifier");

    const { licenseText } = JSON.parse(
      await fs.readFile(
        require.resolve(`@ovyerus/licenses/licenses/${license_}`),
        "utf-8"
      )
    );

    process.stdout.write(licenseText);
    process.exit(0);
  }

  let license = license_;
  let filename = "LICENSE";
  const currentLicense = (await fs.readdir("./")).find(x =>
    /^LICENSE(\.md|\.txt)?$/i.test(x)
  ); // Check if an existing LICENSE file already exists

  if (currentLicense) {
    console.log("Looks like there's already a license file for this project.");

    const { replaceLicense }: { replaceLicense: boolean } = await prompts({
      name: "replaceLicense",
      type: "confirm",
      message: "Do you want to replace it?"
    });

    if (replaceLicense) filename = currentLicense;
    else return console.log("Exiting...");
  }

  if (!license || !identifiers.has(license)) {
    const response = await prompts({
      name: "license",
      type: "autocomplete",
      message: "Search for the license you want",
      choices: (nonOsi
        ? Array.from(identifiers)
        : osiOnlyIdentifiers
      ).map(x => ({ title: x, value: x }))
    });

    ({ license } = response);

    if (!license) return;
  }

  console.log(author);
  const text = wrap(getLicense(license, { author, year, email }));

  await fs.writeFile(`./${filename}`, text);

  if (existsSync("./package.json")) {
    const rawPackage = await fs.readFile("./package.json", "utf-8");
    const { indent } = detectIntent(rawPackage);
    const pkg = JSON.parse(rawPackage);
    pkg.license = license;

    await fs.writeFile("./package.json", JSON.stringify(pkg, null, indent));
  }

  console.log(`Successfully wrote the ${license} license to ./LICENSE`);
  console.log(
    "Most information *should* have been updated with your details but " +
      "it is best to double check to make sure it is all correct."
  );
}
