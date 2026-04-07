import type {
  SearchResult,
  SearchableEntity,
  AlgorandAccount,
  NFDProfile,
  ASA,
  Application,
} from '../types/algorand';

/**
 * Simple fuzzy search across Algorand entity collections.
 */
export function searchEntities<T extends SearchableEntity>(
  entities: T[],
  query: string,
  maxResults = 10,
): SearchResult<T>[] {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  const results: SearchResult<T>[] = [];

  for (const entity of entities) {
    const matches: string[] = [];
    let score = 0;

    if ('address' in entity) {
      const account = entity as unknown as AlgorandAccount;
      if (account.address.toLowerCase().includes(queryLower)) {
        matches.push('address');
        score += account.address.toLowerCase().startsWith(queryLower) ? 10 : 5;
      }
    }

    if ('name' in entity) {
      const named = entity as unknown as NFDProfile | ASA;
      if (named.name.toLowerCase().includes(queryLower)) {
        matches.push('name');
        score += named.name.toLowerCase().startsWith(queryLower) ? 10 : 5;
      }
    }

    if ('unitName' in entity) {
      const asa = entity as unknown as ASA;
      if (asa.unitName.toLowerCase().includes(queryLower)) {
        matches.push('unitName');
        score += asa.unitName.toLowerCase().startsWith(queryLower) ? 8 : 4;
      }
    }

    if ('description' in entity && (entity as unknown as Application).description) {
      const app = entity as unknown as Application;
      if (app.description && app.description.toLowerCase().includes(queryLower)) {
        matches.push('description');
        score += 2;
      }
    }

    if (score > 0) {
      results.push({ item: entity, score, matches });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}
