/**
 * algomd-rn wrapper over `@akta/txn-graph-rn`'s `<TransactionsGraph>`.
 *
 * The library is transport- and resolver-agnostic. This wrapper pre-wires
 * a `DataProvider` so consumers don't have to plumb one themselves — in
 * the common case they pass a `QueryClient` + `AlgorandClient` and get a
 * fully-resolved graph (unit names on asset pills, etc.).
 *
 * Advanced consumers can still pass a `dataProvider` prop directly to
 * swap in their own resolver — useful when the app already has a Jotai
 * store (lora's case) or a preloaded cache.
 *
 * If neither is supplied we wire a minimal stub provider so the graph
 * renders with the passthrough-only defaults the library assumes. That
 * keeps the demo-screen path in `akita-rn` simple (no cache wiring
 * required to see the visual).
 */

import React from 'react'
import {
  TransactionsGraph as BaseTransactionsGraph,
  DataProvider,
  type DataProviderApi,
  type GraphProps,
} from '@akta/txn-graph-rn'

export type TransactionsGraphProps = GraphProps & {
  /**
   * Consumer-injected resolver. If omitted, a no-op stub is used that
   * returns only the raw ids — asset pills render without unit names
   * but the graph's layout and navigation are unaffected.
   *
   * Use `createAlgomdDataProvider({ queryClient, algorand })` from
   * `@akta/algomd-rn/adapters` to get a react-query-backed resolver
   * that shares its cache with the rest of algomd-rn's UI.
   */
  dataProvider?: DataProviderApi
}

/**
 * Minimal stub — returns the raw identity fields only. The library's
 * `AssetBadge` / `AccountNode` / node primitives degrade gracefully when
 * the optional metadata fields are missing.
 */
const stubDataProvider: DataProviderApi = {
  getAccountSummary: (address) => ({ address }),
  getAssetSummary: (id) => ({ id, decimals: 0 }),
  getApplicationSummary: (id) => ({ id }),
}

export function TransactionsGraph({
  dataProvider,
  ...rest
}: TransactionsGraphProps) {
  return (
    <DataProvider api={dataProvider ?? stubDataProvider}>
      <BaseTransactionsGraph {...rest} />
    </DataProvider>
  )
}
