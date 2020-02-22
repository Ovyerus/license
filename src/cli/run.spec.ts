/* eslint-disable
   @typescript-eslint/no-require-imports,
   global-require,
   @typescript-eslint/no-var-requires,
   no-sync */
import MIT from "@ovyerus/licenses/licenses/MIT.json";
import prompts from "prompts";
import wrap from "wrap-text";

import fs from "fs";
import path from "path";

import run from "./run";

// Mock fs as an in-memory system to not affect real fs
jest.mock("fs", () => new (require("metro-memory-fs"))());

// Spy on console.log and also stop output from reaching terminal when testing
const log = jest.spyOn(console, "log").mockImplementation(() => {});
const stdout = jest
  .spyOn(process.stdout as any, "write")
  .mockImplementation(() => true);

const licensesPath = path.resolve(
  require.resolve("@ovyerus/licenses"),
  "../licenses"
);

beforeEach(() => {
  const fs_ = fs as any; // dumb hack to stop TS warnings on this below mock stuff

  fs_._cwd = () => "/project";
  fs_.reset();

  let whereAmI = "";
  for (const dir of licensesPath.split(path.sep).slice(1)) {
    whereAmI += `/${dir}`;
    fs.mkdirSync(whereAmI);
  }

  fs.mkdirSync("/project");
  fs.writeFileSync(path.join(licensesPath, "MIT.json"), JSON.stringify(MIT));

  log.mockReset();
});

afterAll(() => {
  log.mockRestore();
  stdout.mockRestore();
});

describe("raw output", () => {
  test("throws when no license is given", () => {
    expect(run({ raw: true } as any)).rejects.toEqual(
      new Error("Specify what license to print")
    );
  });

  test("throws when invalid license is given", () => {
    expect(run({ raw: true, license: "mit" } as any)).rejects.toEqual(
      new Error("license must be a valid SPDX identifier")
    );
  });

  test("prints the license text", async () => {
    await run({ raw: true, license: "MIT" } as any);
    expect(log).toHaveBeenCalledWith(MIT.licenseText);
  });
});

test("sets the license with placeholders filled", async () => {
  await run({
    license: "MIT",
    name: "Ovyerus",
    year: "2020",
    email: "john@example.com"
  });

  expect(fs.readFileSync("./LICENSE", "utf-8")).toEqual(
    wrap(
      MIT.licenseText
        .replace(/<author>/g, "Ovyerus")
        .replace(/<year>/g, "2020")
        .replace(/<email>/g, "john@example.com")
    )
  );
});

describe("behaviour with existing license", () => {
  const files = [
    "LICENSE",
    "LICENSE.txt",
    "LICENSE.md",
    "license",
    "license.txt",
    "license.md"
  ];

  prompts.inject(
    Array(files.length)
      .fill(true)
      .concat(Array(files.length).fill(false))
  );

  test.each(files)("replaces %s", async file => {
    fs.writeFileSync(file, "My cool license text");

    await run({ license: "MIT" } as any);
    expect(fs.readFileSync(file, "utf-8")).toEqual(wrap(MIT.licenseText));
  });

  test.each(files)("doesn't replace %s", async file => {
    fs.writeFileSync(file, "My cool license text");

    await run({ license: "MIT" } as any);
    expect(fs.readFileSync(file, "utf-8")).toEqual("My cool license text");
  });
});

test("updates license field in package.json", async () => {
  const str = JSON.stringify({ license: "GPL" }, null, "  ");
  fs.writeFileSync("./package.json", str);

  await run({ license: "MIT" } as any);
  expect(fs.readFileSync("./package.json", "utf-8")).toEqual(
    str.replace("GPL", "MIT")
  );
});

test("prompts for license to use when none given", async () => {
  prompts.inject(["MIT"]);

  await run({} as any);
  expect(log).toHaveBeenCalledWith(
    "Successfully wrote the MIT license to ./LICENSE"
  );
});
