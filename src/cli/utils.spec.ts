import { sync as gitcfg } from "parse-git-config";

import { cfg } from ".";
import {
  isAcceptedYear,
  convertProject,
  nonEmpty,
  getUserEmail,
  getUserName
} from "./utils";

jest.mock(".");
jest.mock("os");
jest.mock("path");

const mockGitCfg = gitcfg as typeof import("../../__mocks__/parse-git-config").sync;
const mockCfg = (cfg as any) as typeof import("./__mocks__").cfg;

describe("isAcceptedYear", () => {
  test("allows standalone year", () => {
    expect(isAcceptedYear("2004")).toEqual(true);
  });

  test("allows a year range", () => {
    expect(isAcceptedYear("2004-2020")).toEqual(true);
  });

  test("allows a list of years (comma separated)", () => {
    expect(isAcceptedYear("2004,2005,2009,2020")).toEqual(true);
  });

  test("allows a list of years (comma and space separated)", () => {
    expect(isAcceptedYear("2004, 2005, 2009, 2020")).toEqual(true);
  });

  test("allows a list of years with a range in it", () => {
    expect(isAcceptedYear("2004,2005-2007,2009,2020")).toEqual(true);
  });

  test("allows a list of years with multiple ranges in it", () => {
    expect(isAcceptedYear("2004,2005-2007,2009,2011-2020")).toEqual(true);
  });

  test("doesn't allow non-years", () => {
    expect(() => isAcceptedYear(null as any)).toThrow();
    expect(isAcceptedYear("one two threee")).toEqual(false);
    expect(isAcceptedYear("201")).toEqual(false);
    expect(isAcceptedYear("something something 2004")).toEqual(false);
    expect(isAcceptedYear("2004 something something")).toEqual(false);
    expect(
      isAcceptedYear("something something 2004 something something")
    ).toEqual(false);
  });
});

describe("convertProject", () => {
  // TODO: how to make path.resolve(".") predictable to test that??

  test("gives path and name", () => {
    expect(convertProject("/project")).toEqual({
      path: "/project",
      name: "project"
    });
  });

  test("project name is only top directory name", () => {
    expect(convertProject("/project/foo/bar/baz")).toEqual({
      path: "/project/foo/bar/baz",
      name: "baz"
    });
  });

  test("resolves `.`", () => {
    expect(convertProject(".")).toEqual({
      path: "/project",
      name: "project"
    });
  });

  test("resolves `~` to home directory", () => {
    expect(convertProject("~/my-cool-project")).toEqual({
      path: "/usr/my-cool-project",
      name: "my-cool-project"
    });
  });
});

describe("nonEmpty", () => {
  const fooIsntEmpty = nonEmpty("foo");

  test("throws an error when empty string", () => {
    expect(() => fooIsntEmpty("")).toThrowError(
      new TypeError("foo cannot be empty")
    );
  });

  test("doesn't throw on string with content", () => {
    expect(fooIsntEmpty("foo")).toEqual("foo");
  });

  test("doesn't throw on null", () => {
    expect(fooIsntEmpty(null as any)).toEqual(null);
  });
});

describe("getUserName", () => {
  process.env.USER = "env username";

  test("fallbacks to env username", () => {
    expect(getUserName()).toEqual("env username");
  });

  test("uses git config username", () => {
    mockGitCfg.__data = { user: { name: "git username" } };
    expect(getUserName()).toEqual("git username");
  });

  test("uses app config username", () => {
    mockCfg.__data = { name: "config username" };
    expect(getUserName()).toEqual("config username");
  });
});

describe("getUserEmail", () => {
  test("uses git config email", () => {
    mockGitCfg.__data = { user: { email: "git email" } };
    expect(getUserEmail()).toEqual("git email");
  });

  test("uses app config email", () => {
    mockCfg.__data = { email: "config email" };
    expect(getUserEmail()).toEqual("config email");
  });
});
