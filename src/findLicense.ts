import licenses, { Identifiers } from '@ovyerus/licenses';
import FuzzySearch from 'fuzzy-search';

const searcher = new FuzzySearch(Object.keys(licenses), [], { sort: true });
const osiOnlySearcher = new FuzzySearch(
  Object.entries(licenses)
    .filter(([, { osiApproved }]) => osiApproved)
    .map(([identifier]) => identifier),
  [],
  { sort: true }
);

export function findLicense(
  search: string,
  osiOnly = true
): Array<Identifiers[number]> {
  const searchIn = osiOnly ? osiOnlySearcher : searcher;
  const matches = searchIn.search(search) as Array<Identifiers[number]>;
  const [first] = matches;

  if (first && first.toLowerCase() === search.toLowerCase()) return [first];
  else return matches;
}

export default findLicense;
