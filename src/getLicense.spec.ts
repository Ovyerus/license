import MIT from "@ovyerus/licenses/licenses/MIT.json";

import getLicense from "./getLicense";

test("gets the MIT license template", () => {
  expect(getLicense("MIT")).toEqual(MIT.licenseText);
});

test("replaces the author and year fields in the MIT license", () => {
  expect(getLicense("MIT", { author: "Ovyerus", year: "2020" })).toEqual(
    MIT.licenseText.replace(/<author>/g, "Ovyerus").replace(/<year>/g, "2020")
  );
});

test("throws on invalid license", () => {
  expect(() => getLicense("bad identifier")).toThrowError(
    new TypeError("license is not a valid SPDX identifier")
  );
});
