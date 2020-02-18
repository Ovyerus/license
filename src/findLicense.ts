import licenses, { Identifiers } from "@ovyerus/licenses";
import FuzzySearch from "fuzzy-search";

type Identifier = Identifiers[number];

const searcher = new FuzzySearch(Object.keys(licenses), [], { sort: true });
const osiOnlySearcher = new FuzzySearch(
  Object.entries(licenses)
    .filter(([, { osiApproved }]) => osiApproved)
    .map(([identifier]) => identifier),
  [],
  { sort: true }
);

export function findLicense(search: string, osiOnly = true): Identifier[] {
  const searchIn = osiOnly ? osiOnlySearcher : searcher;
  const matches = searchIn.search(search) as Partial<Identifier[]>;
  const [first] = matches;

  if (first?.toLowerCase() === search.toLowerCase()) return [first];
  else return matches as Identifier[];
}

export default findLicense;
