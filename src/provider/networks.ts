import type { AlgomdNetwork } from './types'

export const NETWORK_DEFAULTS: Record<AlgomdNetwork, {
  algodServer: string
  algodPort?: number
  algodToken?: string
  indexerServer: string
  indexerToken?: string
}> = {
  mainnet: {
    algodServer: 'https://mainnet-api.4160.nodely.dev',
    indexerServer: 'https://mainnet-idx.4160.nodely.dev',
  },
  testnet: {
    algodServer: 'https://testnet-api.4160.nodely.dev',
    indexerServer: 'https://testnet-idx.4160.nodely.dev',
  },
  localnet: {
    algodServer: 'http://localhost:4001',
    algodToken: 'a'.repeat(64),
    indexerServer: 'http://localhost:8980',
  },
}
