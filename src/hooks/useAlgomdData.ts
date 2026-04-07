/**
 * AlgoMD self-fetching data hooks.
 *
 * Each hook reads directly from algod/indexer (via @akta/sdk typed clients
 * where available) and maps to the algomd-rn display types.
 */

// These web APIs are available in Hermes / all modern JS engines but not in TS "esnext" lib
declare const TextDecoder: { new (): { decode(input?: ArrayBuffer | Uint8Array): string } }
declare function btoa(data: string): string

import { useQuery } from '@tanstack/react-query'
import { useAlgorandClient, useIndexerClient } from './useAlgorandClient'
import { useAlgomd } from '../provider/context'
import { resolveAssetUrl } from '../utils/arc19'
import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import type {
  AlgorandAccount,
  ASA as ASAType,
  TransactionDetails as TransactionDetailsType,
  NFDProfile as NFDProfileType,
  Poll as PollType,
  PollOption,
  RaffleListing as RaffleListingType,
  AuctionListing as AuctionListingType,
  TradeOffer as TradeOfferType,
  NFTListing as NFTListingType,
} from '../types/algorand'

// ---------------------------------------------------------------------------
// Default reader account for SDK read-only calls that require a sender
// (e.g. RaffleSDK.state() which uses client.send.getState).
// ---------------------------------------------------------------------------

const DEFAULT_READER = 'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA'

// ---------------------------------------------------------------------------
// Shared helper: fetch ASA details from algod
// ---------------------------------------------------------------------------

async function fetchASADetails(algorand: AlgorandClient, assetId: number | bigint): Promise<ASAType> {
  // Native ALGO (asset ID 0) isn't a real ASA — return known properties directly
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
    const params = info.params
    return {
      id: Number(assetId),
      name: params.name ?? `Asset #${assetId}`,
      unitName: params.unitName ?? '',
      total: Number(params.total),
      decimals: Number(params.decimals),
      defaultFrozen: params.defaultFrozen ?? false,
      url: params.url,
      reserve: params.reserve,
      manager: params.manager,
      freeze: params.freeze,
      clawback: params.clawback,
      creator: params.creator ?? '',
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

/**
 * Resolves image URLs for an ASA using ARC-19 resolution and CDN proxy.
 * Mutates the asset in place for convenience.
 */
function resolveAssetImage(
  asset: ASAType,
  resolveImageUrl: (src: string, width: number) => string,
  width = 300,
): void {
  const resolved = resolveAssetUrl(asset.url, asset.reserve)
  if (resolved) {
    asset.imageUrl = resolveImageUrl(resolved, width)
  }
}

// ---------------------------------------------------------------------------
// On-chain hooks (algod / indexer)
// ---------------------------------------------------------------------------

export function useAccountData(address: string | undefined) {
  const algorand = useAlgorandClient()
  return useQuery({
    queryKey: ['algomd', 'account', address],
    queryFn: async (): Promise<AlgorandAccount> => {
      if (!address) throw new Error('No address provided')
      const info = await algorand.client.algod.accountInformation(address).do()
      const assets: ASAType[] = (info.assets ?? []).map(
        (a: { assetId: bigint; amount: bigint }) => ({
          id: Number(a.assetId),
          name: `Asset #${a.assetId}`,
          unitName: '',
          total: Number(a.amount),
          decimals: 0,
          defaultFrozen: false,
          creator: '',
          createdAt: new Date(),
          verified: false,
        }),
      )
      return {
        id: address,
        address,
        balance: Number(info.amount),
        assets,
        apps: (info.appsLocalState ?? []).map(
          (a: { id: bigint }) => ({
            id: Number(a.id),
            creator: '',
            globalState: {},
            localState: {},
            params: {
              globalNumUint: 0,
              globalNumByteSlice: 0,
              localNumUint: 0,
              localNumByteSlice: 0,
            },
            createdAt: new Date(),
          }),
        ),
        createdAt: new Date(),
        isOnline: info.status === 'Online',
        round: Number(info.round ?? 0),
      }
    },
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function useASAData(assetId: number | string | undefined) {
  const algorand = useAlgorandClient()
  const { resolveImageUrl } = useAlgomd()
  return useQuery({
    queryKey: ['algomd', 'asa', assetId],
    queryFn: async (): Promise<ASAType> => {
      if (!assetId) throw new Error('No asset ID provided')
      const asa = await fetchASADetails(algorand, Number(assetId))
      resolveAssetImage(asa, resolveImageUrl)
      return asa
    },
    enabled: assetId != null,
    staleTime: 60_000,
  })
}

export function useTransactionData(txId: string | undefined) {
  const indexer = useIndexerClient()
  return useQuery({
    queryKey: ['algomd', 'transaction', txId],
    queryFn: async (): Promise<TransactionDetailsType> => {
      if (!txId) throw new Error('No transaction ID provided')
      if (!indexer) throw new Error('Indexer not configured')
      const result = await indexer.lookupTransactionByID(txId).do()
      const txn = result.transaction

      const typeMap: Record<string, TransactionDetailsType['type']> = {
        pay: 'payment',
        axfer: 'asset-transfer',
        appl: 'application-call',
        acfg: 'asset-config',
        keyreg: 'key-registration',
        afrz: 'asset-freeze',
      }

      // algosdk v3 indexer returns note as Uint8Array, not base64 string
      let note: string | undefined
      if (txn.note) {
        try {
          note = new TextDecoder().decode(txn.note)
        } catch {
          note = undefined
        }
      }

      return {
        id: txId,
        type: typeMap[txn.txType ?? ''] ?? 'payment',
        from: txn.sender,
        to: txn.paymentTransaction?.receiver ?? txn.assetTransferTransaction?.receiver,
        amount: Number(
          txn.paymentTransaction?.amount ?? txn.assetTransferTransaction?.amount ?? 0,
        ),
        fee: Number(txn.fee),
        round: Number(txn.confirmedRound),
        timestamp: new Date((txn.roundTime ?? 0) * 1000),
        confirmed: !!txn.confirmedRound,
        signature: (() => {
          const sig = txn.signature?.sig
          if (!sig) return ''
          if (typeof sig === 'string') return sig
          // Convert Uint8Array to base64 without Node Buffer
          return btoa(Array.from(sig as Uint8Array, (b: number) => String.fromCharCode(b)).join(''))
        })(),
        note,
      }
    },
    enabled: !!txId && !!indexer,
    staleTime: 120_000,
  })
}

export function useNFDProfileData(name: string | undefined) {
  const { config } = useAlgomd()
  const nfdApiUrl = config.nfdApiUrl ?? 'https://api.nf.domains'
  return useQuery({
    queryKey: ['algomd', 'nfd', name],
    queryFn: async (): Promise<NFDProfileType> => {
      if (!name) throw new Error('No NFD name provided')
      const response = await fetch(`${nfdApiUrl}/nfd/${encodeURIComponent(name)}`)
      if (!response.ok) throw new Error(`NFD lookup failed: ${response.status}`)
      const nfd = await response.json()
      return {
        id: nfd.appID?.toString() ?? name,
        name: nfd.name ?? name,
        address: nfd.depositAccount ?? nfd.caAlgo?.[0] ?? '',
        avatar: nfd.properties?.userDefined?.avatar,
        bio: nfd.properties?.userDefined?.bio,
        properties: nfd.properties?.userDefined ?? {},
        verified: nfd.properties?.verified?.caAlgo === nfd.caAlgo?.[0],
        createdAt: new Date(nfd.timeCreated ?? Date.now()),
      }
    },
    enabled: !!name,
    staleTime: 120_000,
  })
}

// ---------------------------------------------------------------------------
// On-chain contract hooks (via @akta/sdk typed clients)
// ---------------------------------------------------------------------------

export function usePollData(appId: number | undefined) {
  const algorand = useAlgorandClient()
  return useQuery({
    queryKey: ['algomd', 'poll', appId],
    queryFn: async (): Promise<PollType> => {
      if (!appId) throw new Error('No poll app ID provided')
      const { PollSDK } = await import('@akta/sdk')
      const sdk = new PollSDK({
        algorand,
        factoryParams: { appId: BigInt(appId) },
      })
      const state = await sdk.state()

      const optionTexts = [state.question, state.optionOne, state.optionTwo, state.optionThree, state.optionFour, state.optionFive]
      const optionVotes = [state.votesOne, state.votesTwo, state.votesThree, state.votesFour, state.votesFive]
      const options: PollOption[] = []
      const count = Number(state.optionCount)
      for (let i = 0; i < count && i < 5; i++) {
        options.push({
          id: `${i + 1}`,
          text: optionTexts[i + 1] || `Option ${i + 1}`,
          votes: Number(optionVotes[i]),
          votingPower: Number(optionVotes[i]),
        })
      }

      const endTime = Number(state.endTime)
      const now = Date.now() / 1000
      const isExpired = endTime > 0 && endTime < now
      const totalVotes = optionVotes.slice(0, count).reduce((sum, v) => sum + Number(v), 0)

      return {
        id: appId.toString(),
        question: state.question,
        options,
        creator: '',
        createdAt: new Date(),
        expiresAt: endTime > 0 ? new Date(endTime * 1000) : undefined,
        totalVotes,
        status: isExpired ? 'ended' : 'active',
        gating: Number(state.gateId) > 0
          ? { type: 'asset-holding' as const, requirements: { assets: [{ assetId: Number(state.gateId), minimumBalance: 1 }] } }
          : undefined,
      }
    },
    enabled: appId != null,
    staleTime: 30_000,
  })
}

export function useRaffleData(appId: number | undefined) {
  const algorand = useAlgorandClient()
  const { resolveImageUrl } = useAlgomd()
  return useQuery({
    queryKey: ['algomd', 'raffle', appId],
    queryFn: async (): Promise<RaffleListingType> => {
      if (!appId) throw new Error('No raffle app ID provided')

      // Read global state directly from algod instead of RaffleSDK.state().
      // RaffleSDK.state() uses client.send.getState() which sends a real
      // ABI transaction, failing with makeEmptyTransactionSigner().
      // Direct algod read is free and doesn't require a signer.
      const appInfo = await algorand.client.algod.getApplicationByID(BigInt(appId)).do()
      const gs = new Map<string, bigint | Uint8Array>()
      for (const kv of (appInfo as any).params?.globalState ?? []) {
        const key = new TextDecoder().decode(kv.key)
        if (kv.value.type === 2) {
          gs.set(key, BigInt(kv.value.uint ?? 0))
        } else {
          gs.set(key, kv.value.bytes ?? new Uint8Array())
        }
      }

      const prizeId = Number(gs.get('prize') as bigint ?? 0n)
      const ticketAssetId = Number(gs.get('ticketAsset') as bigint ?? 0n)
      const startTs = Number(gs.get('startTimestamp') as bigint ?? 0n)
      const endTs = Number(gs.get('endTimestamp') as bigint ?? 0n)
      const entryCount = Number(gs.get('entryCount') as bigint ?? 0n)
      const maxTickets = Number(gs.get('maxTickets') as bigint ?? 0n)

      // Seller is stored as 32-byte address bytes in global state
      let seller = ''
      const sellerBytes = gs.get('seller')
      if (sellerBytes instanceof Uint8Array && sellerBytes.length === 32) {
        try {
          const { encodeAddress } = await import('algosdk')
          seller = encodeAddress(sellerBytes)
        } catch { /* ignore encoding errors */ }
      }

      const [prizeAsset, entryAsset] = await Promise.all([
        fetchASADetails(algorand, prizeId),
        fetchASADetails(algorand, ticketAssetId),
      ])

      // Resolve image URLs for assets
      resolveAssetImage(prizeAsset, resolveImageUrl)
      resolveAssetImage(entryAsset, resolveImageUrl)

      const now = Date.now() / 1000
      let status: RaffleListingType['status']
      if (startTs > now) status = 'upcoming'
      else if (endTs > now) status = 'active'
      else status = 'ended'

      // 1 ticket = 1 base unit of the entry asset (e.g. 1 microAlgo for ALGO)
      const entryDecimals = entryAsset.decimals || 0
      const pricePerEntry = 1 / Math.pow(10, entryDecimals)

      return {
        id: appId.toString(),
        title: `Raffle #${appId}`,
        description: `Win ${prizeAsset.name}! Entry costs ${entryAsset.unitName || 'tokens'}.`,
        pricePerEntry,
        entryAsset,
        startTime: new Date(startTs * 1000),
        endTime: new Date(endTs * 1000),
        prizes: [prizeAsset],
        entryCount,
        ticketCount: maxTickets,
        creator: seller,
        status,
      }
    },
    enabled: appId != null,
    staleTime: 30_000,
  })
}

export function useAuctionData(appId: number | undefined) {
  const algorand = useAlgorandClient()
  const { resolveImageUrl } = useAlgomd()
  return useQuery({
    queryKey: ['algomd', 'auction', appId],
    queryFn: async (): Promise<AuctionListingType> => {
      if (!appId) throw new Error('No auction app ID provided')
      const { AuctionSDK } = await import('@akta/sdk')
      const sdk = new AuctionSDK({
        algorand,
        factoryParams: { appId: BigInt(appId), defaultSender: DEFAULT_READER },
      })
      const state = await sdk.state()

      const [prizeAsset, bidAsset] = await Promise.all([
        fetchASADetails(algorand, Number(state.prize)),
        fetchASADetails(algorand, Number(state.bidAsset)),
      ])

      // Resolve image URLs for assets
      resolveAssetImage(prizeAsset, resolveImageUrl)
      resolveAssetImage(bidAsset, resolveImageUrl)

      const startTs = Number(state.startTimestamp)
      const endTs = Number(state.endTimestamp)
      const now = Date.now() / 1000
      let status: AuctionListingType['status']
      if (startTs > now) status = 'upcoming'
      else if (endTs > now) status = 'active'
      else status = 'ended'

      const bidDecimals = bidAsset.decimals || 0
      const divisor = Math.pow(10, bidDecimals)

      return {
        id: appId.toString(),
        title: `Auction #${appId}`,
        description: `Bid on ${prizeAsset.name} with ${bidAsset.unitName || 'tokens'}.`,
        bidAsset,
        currentHighestBid: Number(state.highestBid) / divisor,
        minimumNextBid: (Number(state.highestBid) + Number(state.bidMinimumIncrease)) / divisor,
        startTime: new Date(startTs * 1000),
        endTime: new Date(endTs * 1000),
        prizes: [prizeAsset],
        bidFeePercentage: Number(state.bidFee) > 0 ? Number(state.bidFee) / 100 : undefined,
        currentBidFeePool: 0,
        bidCount: Number(state.bidID),
        timeExtended: false,
        creator: state.seller ?? '',
        status,
      }
    },
    enabled: appId != null,
    staleTime: 30_000,
  })
}

export function useNFTListingData(appId: number | undefined) {
  const algorand = useAlgorandClient()
  const { resolveImageUrl } = useAlgomd()
  return useQuery({
    queryKey: ['algomd', 'nftlisting', appId],
    queryFn: async (): Promise<NFTListingType> => {
      if (!appId) throw new Error('No NFT listing app ID provided')
      const { MarketplaceSDK } = await import('@akta/sdk')
      const marketplace = new MarketplaceSDK({
        algorand,
        factoryParams: { defaultSender: DEFAULT_READER },
      })
      const listing = marketplace.getListing({ appId: BigInt(appId) })
      const state = await listing.state()

      const [nftAsset, paymentAsset] = await Promise.all([
        fetchASADetails(algorand, Number(state.prize)),
        fetchASADetails(algorand, Number(state.paymentAsset)),
      ])

      // Resolve image URLs for NFT asset
      resolveAssetImage(nftAsset, resolveImageUrl)

      const payDecimals = paymentAsset.decimals || 0
      const divisor = Math.pow(10, payDecimals)

      return {
        id: appId.toString(),
        nft: nftAsset,
        price: Number(state.price) / divisor,
        priceAsset: paymentAsset,
        currency: paymentAsset.unitName || 'ALGO',
        seller: state.seller ?? '',
        authenticityBadge: false,
        quantity: 1,
        reservedFor: state.reservedFor && state.reservedFor !== 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ' ? state.reservedFor : undefined,
        views: 0,
        favorites: 0,
        createdAt: new Date(),
        listedAt: new Date(),
        expiresAt: Number(state.expiration) > 0 ? new Date(Number(state.expiration) * 1000) : undefined,
      }
    },
    enabled: appId != null,
    staleTime: 60_000,
  })
}

export function useTradeOfferData(appId: number | undefined, offerId: number | undefined) {
  const algorand = useAlgorandClient()
  return useQuery({
    queryKey: ['algomd', 'trade', appId, offerId],
    queryFn: async (): Promise<TradeOfferType> => {
      if (appId == null || offerId == null) throw new Error('No trade offer ID provided')
      const { HyperSwapSDK } = await import('@akta/sdk')
      const sdk = new HyperSwapSDK({
        algorand,
        factoryParams: { appId: BigInt(appId), defaultSender: DEFAULT_READER },
      })
      const offer = await sdk.getOffer({ id: BigInt(offerId) })

      const stateMap: Record<number, TradeOfferType['status']> = {
        10: 'pending',   // Offered
        20: 'pending',   // Escrowing
        30: 'pending',   // Disbursing
        40: 'accepted',  // Completed
        50: 'expired',   // Cancelled
        60: 'expired',   // CancelCompleted
      }

      return {
        id: offerId.toString(),
        creator: '',
        recipients: [],
        offering: [],
        requesting: [],
        expiresAt: new Date(Number(offer.expiration) * 1000),
        status: stateMap[offer.state] ?? 'pending',
        createdAt: new Date(),
      }
    },
    enabled: appId != null && offerId != null,
    staleTime: 60_000,
  })
}
