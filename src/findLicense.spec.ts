import findLicense from "./findLicense";

test("finds a single, exact match", () => {
  expect(findLicense("mit")).toEqual(["MIT"]);
  expect(findLicense("MIT")).toEqual(["MIT"]);
});

test("finds similar licenses", () => {
  expect(findLicense("mi")).toEqual([
    "MIT",
    "MirOS",
    "Multics",
    "MPL-2.0-no-copyleft-exception"
  ]);
});

test("shows non-OSI approved licenses", () => {
  expect(new Set(findLicense("mi", false))).toEqual(
    new Set([
      "CDLA-Permissive-1.0",
      "MIT",
      "MIT-0",
      "MIT-CMU",
      "MIT-advertising",
      "MIT-enna",
      "MIT-feh",
      "MITNFA",
      "MirOS",
      "BSD-3-Clause-Open-MPI",
      "Imlib2",
      "Sendmail",
      "Sendmail-8.23",
      "mpich2",
      "IBM-pibs",
      "iMatix",
      "CNRI-Python-GPL-Compatible",
      "MakeIndex",
      "Multics",
      "ImageMagick",
      "MPL-2.0-no-copyleft-exception"
    ])
  );
});

test("finds no matching licenses", () => {
  expect(findLicense("mit 2000")).toEqual([]);
  expect(findLicense("mit 2000", false)).toEqual([]);
});
