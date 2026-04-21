/**
 * React-query-backed `DataProviderApi` for `@akita/visual-explorer`.
 *
 * Keys cache entries the same way algomd-rn's own hooks do
 * (`['algomd', <kind>, <id>]`) so resolution for the graph and
 * resolution for surrounding `<ASA>` / `<Account>` components both hit
 * a single cache line per entity.
 *
 * The caller hands us a `QueryClient` (usually the same one wired into
 * `AlgomdProvider`) + an `AlgorandClient` (from `useAlgorandClient`).
 * The returned `DataProviderApi` is a plain object — safe to memoize
 * and hand straight to `<DataProvider api={...}>`.
 */

import type { QueryClient } from '@tanstack/react-query'
import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import type {
  AccountSummary,
  ApplicationSummary,
  AssetSummary,
  DataProviderApi,
} from '@akita/visual-explorer'
import type { ASA as ASAType } from '../types/algorand'

export type CreateAlgomdDataProviderOptions = {
  queryClient: QueryClient
  algorand: AlgorandClient
  /** Cache staleness in ms. Defaults to 60s — matches algomd-rn's hooks. */
  staleTime?: number
}

/**
 * Resolve an ASA's algod details the same way `useASAData` does. We
 * intentionally mirror its `queryKey` + mapping so a `useASAData` call
 * and the graph's asset resolver share a single cache entry.
 */
async function fetchASAForGraph(
  algorand: AlgorandClient,
  assetId: number | bigint,
): Promise<ASAType> {
  if (Number(assetId) === 0) {
    return {
      id: 0,
      name: 'Algo',
      unitName: 'ALGO',
      total: 10_000_000_000,
      decimals: 6,
      defaultFrozen: false,
      creator: '',
      createdAt: new Date(),
      verified: true,
    }
  }
  try {
    const info = await algorand.client.algod.getAssetByID(BigInt(assetId)).do()
    const p = info.params
    return {
      id: Number(assetId),
      name: p.name ?? `Asset #${assetId}`,
      unitName: p.unitName ?? '',
      total: Number(p.total),
      decimals: Number(p.decimals),
      defaultFrozen: p.defaultFrozen ?? false,
      url: p.url,
      reserve: p.reserve,
      manager: p.manager,
      freeze: p.freeze,
      clawback: p.clawback,
      creator: p.creator ?? '',
      createdAt: new Date(),
      verified: false,
    }
  } catch {
    return {
      id: Number(assetId),
      name: `Asset #${assetId}`,
      unitName: '',
      total: 0,
      decimals: 0,
      defaultFrozen: false,
      creator: '',
      createdAt: new Date(),
      verified: false,
    }
  }
}

export function createAlgomdDataProvider(
  opts: CreateAlgomdDataProviderOptions,
): DataProviderApi {
  const { queryClient, algorand, staleTime = 60_000 } = opts

  return {
    async getAssetSummary(id) {
      const numericId = Number(id)
      const asa = await queryClient.fetchQuery<ASAType>({
        queryKey: ['algomd', 'asa', numericId],
        queryFn: () => fetchASAForGraph(algorand, numericId),
        staleTime,
      })
      const summary: AssetSummary = {
        id,
        unitName: asa.unitName || undefined,
        name: asa.name || undefined,
        decimals: asa.decimals,
        iconUrl: asa.imageUrl,
      }
      return summary
    },

    async getAccountSummary(address) {
      // We don't fetch account info just to render the node — that's a
      // heavy algod call for what's usually just an address pill. The
      // consumer can override this resolver if they want NFD names or
      // on-chain balance read out.
      const summary: AccountSummary = { address }
      return summary
    },

    async getApplicationSummary(id) {
      // Same story — the graph just needs `{ id, name? }`. Consumers
      // wiring the adapter to a richer app-registry should override
      // this resolver.
      const summary: ApplicationSummary = { id }
      return summary
    },
  }
}
