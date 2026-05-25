import { useMemo } from 'react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk, { makeEmptyTransactionSigner } from 'algosdk'
import { useAlgomd } from '../provider/context'
import { NETWORK_DEFAULTS } from '../provider/networks'

/**
 * Creates a memoized AlgorandClient from provider config.
 *
 * Registers an empty default signer so that SDK read-only calls
 * (e.g. RaffleSDK.state() which uses client.send.getState()) can
 * simulate transactions without a real signer.
 */
export function useAlgorandClient(): AlgorandClient {
  const { config } = useAlgomd()

  return useMemo(() => {
    const defaults = NETWORK_DEFAULTS[config.network]
    const server = config.algodServer ?? defaults.algodServer
    const port = config.algodPort ?? defaults.algodPort
    const token = config.algodToken ?? defaults.algodToken ?? ''

    const client = AlgorandClient.fromClients({
      algod: new algosdk.Algodv2(token, server, port, config.headers),
    })

    // Register an empty signer as default so SDK read methods that use
    // client.send (like RaffleSDK.state → getState ABI call) can simulate
    // without a real signer. This is safe — algomd-rn is a display library.
    client.setDefaultSigner(makeEmptyTransactionSigner() as never)

    return client
  }, [config.network, config.algodServer, config.algodPort, config.algodToken, config.headers])
}

/**
 * Creates a memoized Indexer client from provider config.
 * Returns null if indexer is not configured.
 */
export function useIndexerClient(): algosdk.Indexer | null {
  const { config } = useAlgomd()

  return useMemo(() => {
    const defaults = NETWORK_DEFAULTS[config.network]
    const server = config.indexerServer ?? defaults.indexerServer
    if (!server) return null
    const token = config.indexerToken ?? defaults.indexerToken ?? ''
    return new algosdk.Indexer(token, server, '', config.headers)
  }, [config.network, config.indexerServer, config.indexerToken, config.headers])
}
