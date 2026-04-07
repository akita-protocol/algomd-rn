export type AlgomdNetwork = 'mainnet' | 'testnet' | 'localnet'

export interface AlgomdConfig {
  /** Network - determines default algod/indexer URLs */
  network: AlgomdNetwork
  /** Override algod server URL */
  algodServer?: string
  algodPort?: number
  algodToken?: string
  /** Override indexer server URL (needed for Transaction) */
  indexerServer?: string
  indexerToken?: string
  /** Override NFD API URL (default: https://api.nf.domains) */
  nfdApiUrl?: string
  /** Override image URL resolver (default: Akita CDN proxy) */
  resolveImageUrl?: (src: string, width: number, quality?: number) => string
}
