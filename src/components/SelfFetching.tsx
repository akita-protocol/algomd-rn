/**
 * Self-fetching wrappers for algomd-rn display components.
 *
 * Each wrapper adds an optional self-fetch prop (appId, address, txId, etc.)
 * alongside the existing `data` prop. If `data` is provided, it renders
 * immediately. Otherwise, it fetches from algod via the hooks.
 */

import React from 'react'
import type { ReactNode } from 'react'
import type { ComponentSize } from '../types/algorand'
import { LoadingSkeleton, ErrorState } from '../ui/DataStates'

// Display components (internal names)
import { Account as AccountDisplay } from './Account'
import { ASAComponent } from './ASA'
import { NFTListingComponent } from './NFTListing'
import { NFDProfileComponent } from './NFDProfile'
import { TransactionDetailsComponent } from './TransactionDetails'
import { PollComponent } from './Poll'
import { RaffleListingComponent } from './RaffleListing'
import { AuctionListingComponent } from './AuctionListing'
import { TradeOfferComponent } from './TradeOffer'

// Hooks
import {
  useAccountData,
  useASAData,
  useTransactionData,
  useNFDProfileData,
  usePollData,
  useRaffleData,
  useAuctionData,
  useNFTListingData,
  useTradeOfferData,
} from '../hooks/useAlgomdData'

// Types
import type {
  AlgorandAccount,
  ASA as ASAType,
  NFTListing as NFTListingType,
  NFDProfile as NFDProfileType,
  TransactionDetails as TransactionDetailsType,
  Poll as PollType,
  RaffleListing as RaffleListingType,
  AuctionListing as AuctionListingType,
  TradeOffer as TradeOfferType,
} from '../types/algorand'

// ---------------------------------------------------------------------------
// Shared fetcher wrapper
// ---------------------------------------------------------------------------

function FetcherWrapper({
  name,
  isLoading,
  error,
  data,
  loadingFallback,
  errorFallback,
  children,
}: {
  name: string
  isLoading: boolean
  error: Error | null
  data: unknown
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
  children: ReactNode
}) {
  if (isLoading) return <>{loadingFallback ?? <LoadingSkeleton name={name} />}</>
  if (error || !data) return <>{errorFallback ?? <ErrorState name={name} message={error?.message ?? 'Not found'} />}</>
  return <>{children}</>
}

// ---------------------------------------------------------------------------
// Poll
// ---------------------------------------------------------------------------

type PollSelfFetchProps = {
  data?: PollType
  appId?: number
  showVoteButton?: boolean
  compact?: boolean
  size?: ComponentSize
  className?: string
  onVote?: (pollId: string, optionId: string) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function PollFetcher({ appId, ...rest }: Omit<PollSelfFetchProps, 'data'> & { appId: number }) {
  const { data, isLoading, error } = usePollData(appId)
  return (
    <FetcherWrapper name="Poll" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <PollComponent data={data} showVoteButton={rest.showVoteButton} compact={rest.compact} size={rest.size} className={rest.className} onVote={rest.onVote} />}
    </FetcherWrapper>
  )
}

export function Poll(props: PollSelfFetchProps) {
  if (props.data) return <PollComponent data={props.data} showVoteButton={props.showVoteButton} compact={props.compact} size={props.size} className={props.className} onVote={props.onVote} />
  if (props.appId != null) return <PollFetcher appId={props.appId} showVoteButton={props.showVoteButton} compact={props.compact} size={props.size} className={props.className} onVote={props.onVote} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Poll" message="Either data or appId is required" />
}

// ---------------------------------------------------------------------------
// RaffleListing
// ---------------------------------------------------------------------------

type RaffleListingSelfFetchProps = {
  data?: RaffleListingType
  appId?: number
  showEntryButton?: boolean
  size?: ComponentSize
  className?: string
  imageUrl?: string
  onEnter?: (raffle: RaffleListingType) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function RaffleListingFetcher({ appId, ...rest }: Omit<RaffleListingSelfFetchProps, 'data'> & { appId: number }) {
  const { data, isLoading, error } = useRaffleData(appId)
  return (
    <FetcherWrapper name="Raffle" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <RaffleListingComponent data={data} showEntryButton={rest.showEntryButton} size={rest.size} className={rest.className} imageUrl={rest.imageUrl} onEnter={rest.onEnter} />}
    </FetcherWrapper>
  )
}

export function RaffleListing(props: RaffleListingSelfFetchProps) {
  if (props.data) return <RaffleListingComponent data={props.data} showEntryButton={props.showEntryButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onEnter={props.onEnter} />
  if (props.appId != null) return <RaffleListingFetcher appId={props.appId} showEntryButton={props.showEntryButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onEnter={props.onEnter} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Raffle" message="Either data or appId is required" />
}

// ---------------------------------------------------------------------------
// AuctionListing
// ---------------------------------------------------------------------------

type AuctionListingSelfFetchProps = {
  data?: AuctionListingType
  appId?: number
  showBidButton?: boolean
  size?: ComponentSize
  className?: string
  imageUrl?: string
  onBid?: (auction: AuctionListingType) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function AuctionListingFetcher({ appId, ...rest }: Omit<AuctionListingSelfFetchProps, 'data'> & { appId: number }) {
  const { data, isLoading, error } = useAuctionData(appId)
  return (
    <FetcherWrapper name="Auction" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <AuctionListingComponent data={data} showBidButton={rest.showBidButton} size={rest.size} className={rest.className} imageUrl={rest.imageUrl} onBid={rest.onBid} />}
    </FetcherWrapper>
  )
}

export function AuctionListing(props: AuctionListingSelfFetchProps) {
  if (props.data) return <AuctionListingComponent data={props.data} showBidButton={props.showBidButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onBid={props.onBid} />
  if (props.appId != null) return <AuctionListingFetcher appId={props.appId} showBidButton={props.showBidButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onBid={props.onBid} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Auction" message="Either data or appId is required" />
}

// ---------------------------------------------------------------------------
// NFTListing
// ---------------------------------------------------------------------------

type NFTListingSelfFetchProps = {
  data?: NFTListingType
  appId?: number
  showPurchaseButton?: boolean
  size?: ComponentSize
  className?: string
  imageUrl?: string
  onPurchase?: (listing: NFTListingType) => void
  onFavorite?: (listing: NFTListingType) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function NFTListingFetcher({ appId, ...rest }: Omit<NFTListingSelfFetchProps, 'data'> & { appId: number }) {
  const { data, isLoading, error } = useNFTListingData(appId)
  return (
    <FetcherWrapper name="NFT Listing" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <NFTListingComponent data={data} showPurchaseButton={rest.showPurchaseButton} size={rest.size} className={rest.className} imageUrl={rest.imageUrl} onPurchase={rest.onPurchase} onFavorite={rest.onFavorite} />}
    </FetcherWrapper>
  )
}

export function NFTListing(props: NFTListingSelfFetchProps) {
  if (props.data) return <NFTListingComponent data={props.data} showPurchaseButton={props.showPurchaseButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onPurchase={props.onPurchase} onFavorite={props.onFavorite} />
  if (props.appId != null) return <NFTListingFetcher appId={props.appId} showPurchaseButton={props.showPurchaseButton} size={props.size} className={props.className} imageUrl={props.imageUrl} onPurchase={props.onPurchase} onFavorite={props.onFavorite} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="NFT Listing" message="Either data or appId is required" />
}

// ---------------------------------------------------------------------------
// TradeOffer
// ---------------------------------------------------------------------------

type TradeOfferSelfFetchProps = {
  data?: TradeOfferType
  appId?: number
  offerId?: number
  showActions?: boolean
  size?: ComponentSize
  className?: string
  currentUserAddress?: string
  onAccept?: (offer: TradeOfferType) => void
  onReject?: (offer: TradeOfferType) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function TradeOfferFetcher({ appId, offerId, ...rest }: Omit<TradeOfferSelfFetchProps, 'data'> & { appId: number; offerId: number }) {
  const { data, isLoading, error } = useTradeOfferData(appId, offerId)
  return (
    <FetcherWrapper name="Trade Offer" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <TradeOfferComponent data={data} showActions={rest.showActions} size={rest.size} className={rest.className} currentUserAddress={rest.currentUserAddress} onAccept={rest.onAccept} onReject={rest.onReject} />}
    </FetcherWrapper>
  )
}

export function TradeOffer(props: TradeOfferSelfFetchProps) {
  if (props.data) return <TradeOfferComponent data={props.data} showActions={props.showActions} size={props.size} className={props.className} currentUserAddress={props.currentUserAddress} onAccept={props.onAccept} onReject={props.onReject} />
  if (props.appId != null && props.offerId != null) return <TradeOfferFetcher appId={props.appId} offerId={props.offerId} showActions={props.showActions} size={props.size} className={props.className} currentUserAddress={props.currentUserAddress} onAccept={props.onAccept} onReject={props.onReject} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Trade Offer" message="Either data or (appId + offerId) is required" />
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

type AccountSelfFetchProps = {
  data?: AlgorandAccount
  address?: string
  showAssets?: boolean
  showApps?: boolean
  compact?: boolean
  size?: ComponentSize
  className?: string
  onExternalLink?: (address: string) => void
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function AccountFetcher({ address, ...rest }: Omit<AccountSelfFetchProps, 'data'> & { address: string }) {
  const { data, isLoading, error } = useAccountData(address)
  return (
    <FetcherWrapper name="Account" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <AccountDisplay data={data} showAssets={rest.showAssets} showApps={rest.showApps} compact={rest.compact} size={rest.size} className={rest.className} onExternalLink={rest.onExternalLink} />}
    </FetcherWrapper>
  )
}

export function Account(props: AccountSelfFetchProps) {
  if (props.data) return <AccountDisplay data={props.data} showAssets={props.showAssets} showApps={props.showApps} compact={props.compact} size={props.size} className={props.className} onExternalLink={props.onExternalLink} />
  if (props.address) return <AccountFetcher address={props.address} showAssets={props.showAssets} showApps={props.showApps} compact={props.compact} size={props.size} className={props.className} onExternalLink={props.onExternalLink} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Account" message="Either data or address is required" />
}

// ---------------------------------------------------------------------------
// ASA
// ---------------------------------------------------------------------------

type ASASelfFetchProps = {
  data?: ASAType
  assetId?: number
  showDetails?: boolean
  compact?: boolean
  size?: ComponentSize
  className?: string
  imageUrl?: string
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function ASAFetcher({ assetId, ...rest }: Omit<ASASelfFetchProps, 'data'> & { assetId: number }) {
  const { data, isLoading, error } = useASAData(assetId)
  return (
    <FetcherWrapper name="ASA" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <ASAComponent data={data} showDetails={rest.showDetails} compact={rest.compact} size={rest.size} className={rest.className} imageUrl={rest.imageUrl} />}
    </FetcherWrapper>
  )
}

export function ASA(props: ASASelfFetchProps) {
  if (props.data) return <ASAComponent data={props.data} showDetails={props.showDetails} compact={props.compact} size={props.size} className={props.className} imageUrl={props.imageUrl} />
  if (props.assetId != null) return <ASAFetcher assetId={props.assetId} showDetails={props.showDetails} compact={props.compact} size={props.size} className={props.className} imageUrl={props.imageUrl} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="ASA" message="Either data or assetId is required" />
}

// ---------------------------------------------------------------------------
// TransactionDetails
// ---------------------------------------------------------------------------

type TransactionDetailsSelfFetchProps = {
  data?: TransactionDetailsType
  txId?: string
  showContext?: boolean
  showFee?: boolean
  compact?: boolean
  size?: ComponentSize
  className?: string
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function TransactionDetailsFetcher({ txId, ...rest }: Omit<TransactionDetailsSelfFetchProps, 'data'> & { txId: string }) {
  const { data, isLoading, error } = useTransactionData(txId)
  return (
    <FetcherWrapper name="Transaction" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <TransactionDetailsComponent data={data} showContext={rest.showContext} showFee={rest.showFee} compact={rest.compact} size={rest.size} className={rest.className} />}
    </FetcherWrapper>
  )
}

export function TransactionDetails(props: TransactionDetailsSelfFetchProps) {
  if (props.data) return <TransactionDetailsComponent data={props.data} showContext={props.showContext} showFee={props.showFee} compact={props.compact} size={props.size} className={props.className} />
  if (props.txId) return <TransactionDetailsFetcher txId={props.txId} showContext={props.showContext} showFee={props.showFee} compact={props.compact} size={props.size} className={props.className} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="Transaction" message="Either data or txId is required" />
}

// ---------------------------------------------------------------------------
// NFDProfile
// ---------------------------------------------------------------------------

type NFDProfileSelfFetchProps = {
  data?: NFDProfileType
  name?: string
  showBio?: boolean
  showProperties?: boolean
  compact?: boolean
  size?: ComponentSize
  className?: string
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
}

function NFDProfileFetcher({ name, ...rest }: Omit<NFDProfileSelfFetchProps, 'data'> & { name: string }) {
  const { data, isLoading, error } = useNFDProfileData(name)
  return (
    <FetcherWrapper name="NFD Profile" isLoading={isLoading} error={error} data={data} loadingFallback={rest.loadingFallback} errorFallback={rest.errorFallback}>
      {data && <NFDProfileComponent data={data} showBio={rest.showBio} showProperties={rest.showProperties} compact={rest.compact} size={rest.size} className={rest.className} />}
    </FetcherWrapper>
  )
}

export function NFDProfile(props: NFDProfileSelfFetchProps) {
  if (props.data) return <NFDProfileComponent data={props.data} showBio={props.showBio} showProperties={props.showProperties} compact={props.compact} size={props.size} className={props.className} />
  if (props.name) return <NFDProfileFetcher name={props.name} showBio={props.showBio} showProperties={props.showProperties} compact={props.compact} size={props.size} className={props.className} loadingFallback={props.loadingFallback} errorFallback={props.errorFallback} />
  return <ErrorState name="NFD Profile" message="Either data or name is required" />
}
