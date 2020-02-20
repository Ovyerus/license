import { all } from "rambda";

export function isAcceptedYear(str: string): boolean {
  const split = str.split("-");

  return (
    // standalone year (2004)
    /^\d{4}$/.test(str) ||
    // year range (2004-2010)
    (split.length === 2 && all(x => /^\d{4}$/.test(x), split)) ||
    // list of years (2001, 2002, 2004)
    // make this recursive to allow ranges inside?
    /^(?:\d{4}(?:, ?)?)+$/.test(str)
  );
}
