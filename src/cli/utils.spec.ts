import { isAcceptedYear } from "./utils";

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
