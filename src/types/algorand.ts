// Core Algorand Types for React Native
export interface AlgorandAccount {
  id: string;
  address: string;
  balance: number;
  assets: ASA[];
  apps: Application[];
  createdAt: Date;
  isOnline: boolean;
  round: number;
}

export interface NFDProfile {
  id: string;
  name: string;
  address: string;
  avatar?: string;
  bio?: string;
  properties: Record<string, string>;
  verified: boolean;
  createdAt: Date;
}

export interface ASA {
  id: number;
  name: string;
  unitName: string;
  total: number;
  decimals: number;
  defaultFrozen: boolean;
  url?: string;
  /** Resolved image URL (IPFS/HTTP, CDN-proxied). Set by data hooks after ARC-19 resolution. */
  imageUrl?: string;
  metadataHash?: string;
  manager?: string;
  reserve?: string;
  freeze?: string;
  clawback?: string;
  creator: string;
  createdAt: Date;
  price?: number;
  verified: boolean;
}

export interface Application {
  id: number;
  creator: string;
  globalState: Record<string, unknown>;
  localState: Record<string, unknown>;
  params: {
    globalNumUint: number;
    globalNumByteSlice: number;
    localNumUint: number;
    localNumByteSlice: number;
  };
  createdAt: Date;
  name?: string;
  description?: string;
}

export interface TransactionDetails {
  id: string;
  type:
    | 'payment'
    | 'asset-transfer'
    | 'application-call'
    | 'asset-config'
    | 'key-registration'
    | 'asset-freeze';
  from: string;
  to?: string;
  amount?: number;
  asset?: ASA;
  application?: Application;
  note?: string;
  fee: number;
  round: number;
  timestamp: Date;
  confirmed: boolean;
  signature: string;
  context?: {
    type: 'nft-purchase' | 'auction-won' | 'raffle-entry' | 'trade-offer' | 'vote';
    metadata: Record<string, unknown>;
  };
}

// Social and Trading Types
export interface NFTListing {
  id: string;
  nft: ASA;
  price: number;
  priceAsset: ASA;
  currency: string;
  seller: string;
  collection?: string;
  authenticityBadge: boolean;
  quantity: number;
  reservedFor?: string;
  gating?: GatingInfo;
  views: number;
  favorites: number;
  createdAt: Date;
  listedAt: Date;
  expiresAt?: Date;
  /** Address of buyer (set locally after purchase, app is deleted on-chain) */
  buyer?: string;
}

export interface RaffleListing {
  id: string;
  title: string;
  description: string;
  pricePerEntry: number;
  entryAsset: ASA;
  startTime: Date;
  endTime: Date;
  prizes: ASA[];
  entryCount: number;
  ticketCount: number;
  gating?: GatingInfo;
  creator: string;
  status: 'upcoming' | 'active' | 'ended' | 'claimed';
  /** Address of the raffle winner */
  winner?: string;
}

export interface AuctionListing {
  id: string;
  title: string;
  description: string;
  bidAsset: ASA;
  currentHighestBid: number;
  minimumNextBid: number;
  startTime: Date;
  endTime: Date;
  prizes: ASA[];
  bidFeePercentage?: number;
  currentBidFeePool: number;
  bidCount: number;
  timeExtended: boolean;
  creator: string;
  status: 'upcoming' | 'active' | 'ended' | 'claimed';
  /** Address of the highest bidder (winner when ended/claimed) */
  winner?: string;
}

export interface TradeOffer {
  id: string;
  creator: string;
  recipients: string[];
  offering: (ASA | AlgorandAccount)[];
  requesting: (ASA | AlgorandAccount)[];
  message?: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  creator: string;
  createdAt: Date;
  expiresAt?: Date;
  totalVotes: number;
  status: 'active' | 'ended';
  gating?: GatingInfo;
}

export interface PollOption {
  id: string;
  text: string;
  asset?: ASA;
  collection?: string;
  votes: number;
  votingPower: number;
}

export interface GatingInfo {
  type: 'asset-holding' | 'nfd-verified' | 'application-optin' | 'custom' | 'token' | 'nft';
  requirements: {
    assets?: { assetId: number; minimumBalance: number }[];
    nfdVerified?: boolean;
    applications?: number[];
    custom?: Record<string, unknown>;
  };
  requirement?: number;
  asset?: string;
  collection?: string;
}

// Search Types
export interface SearchResult<T> {
  item: T;
  score: number;
  matches: string[];
}

export type SearchableEntity =
  | AlgorandAccount
  | NFDProfile
  | ASA
  | Application
  | TransactionDetails
  | NFTListing
  | RaffleListing
  | AuctionListing
  | TradeOffer
  | Poll;

// Component shared prop types
export type ComponentSize = 'sm' | 'md' | 'lg' | 'full' | 'fullscreen';
