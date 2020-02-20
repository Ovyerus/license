
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
