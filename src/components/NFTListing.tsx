import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { NFTListing as NFTListingType, ComponentSize } from '../types/algorand';
import { formatCurrency, formatRelativeTime } from '../utils/format';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';

function ShieldIcon({ size = 12, color = '#93c5fd' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Svg>
  );
}

function LockIcon({ size = 12, color = '#fdba74' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 10V7a4 4 0 0 0-8 0v3" />
      <Path d="M5 10h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z" />
    </Svg>
  );
}

function ShoppingCartIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <Path d="M3 6h18" />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

function CalendarIcon({ size = 12, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Path d="M3 10h18" />
      <Path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
    </Svg>
  );
}

interface NFTListingProps {
  data: NFTListingType;
  showPurchaseButton?: boolean;
  size?: ComponentSize;
  className?: string;
  imageUrl?: string;
  onPurchase?: (listing: NFTListingType) => void;
  onFavorite?: (listing: NFTListingType) => void;
}

export function NFTListingComponent({
  data: listing,
  showPurchaseButton = true,
  size = 'full',
  className,
  imageUrl,
  onPurchase,
  onFavorite,
}: NFTListingProps) {
  const isReserved = !!listing.reservedFor;
  const hasGating = listing.gating !== undefined;
  const isExpired = listing.expiresAt ? new Date() > listing.expiresAt : false;
  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl overflow-hidden ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        <View className="p-5">
          {/* NFT Image */}
          {imageUrl && (
            <View className="mb-4 rounded-2xl overflow-hidden aspect-square">
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />

              {/* Badges overlay */}
              <View className="absolute top-2 left-2 flex-row flex-wrap gap-1">
                {listing.authenticityBadge && (
                  <StatusBadge label="Verified" variant="info" icon={<ShieldIcon />} />
                )}
                {isReserved && (
                  <StatusBadge label="Reserved" variant="warning" icon={<LockIcon />} />
                )}
                {hasGating && <StatusBadge label="Gated" variant="primary" />}
                {isExpired && <StatusBadge label="Expired" variant="error" />}
              </View>
            </View>
          )}

          {/* NFT Info */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-white mb-1">{listing.nft.name}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-mono text-zinc-400">#{listing.nft.id}</Text>
              {listing.collection && (
                <View className="px-2 py-0.5 rounded-full bg-zinc-800">
                  <Text className="text-xs text-zinc-300">{listing.collection}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Price & Stats */}
          <View className="flex-row gap-6 mb-3">
            <View>
              <Text className="text-2xl font-bold text-white">
                {formatCurrency(listing.price, listing.currency)}
              </Text>
              <Text className="text-xs text-zinc-400">Price</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {listing.views.toLocaleString()}
              </Text>
              <Text className="text-xs text-zinc-400">Views</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {listing.favorites.toLocaleString()}
              </Text>
              <Text className="text-xs text-zinc-400">Favorites</Text>
            </View>
          </View>

          {/* Gating Info */}
          {hasGating && listing.gating && (
            <View className="mb-3 bg-purple-500/5 rounded-xl px-3 py-2.5">
              <Text className="text-xs font-medium text-purple-300 mb-1">Gated Access</Text>
              <Text className="text-xs text-purple-200">
                {listing.gating.type === 'token' &&
                  `Requires ${listing.gating.requirement} ${listing.gating.asset} tokens`}
                {listing.gating.type === 'nft' &&
                  `Requires NFT from ${listing.gating.collection}`}
              </Text>
            </View>
          )}

          {/* Purchase Button */}
          {showPurchaseButton && !isExpired && (
            <Pressable
              onPress={() => !isReserved && onPurchase?.(listing)}
              disabled={isReserved}
              className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl ${
                isReserved
                  ? 'bg-zinc-800/50'
                  : 'bg-purple-600'
              }`}
            >
              {isReserved ? (
                <>
                  <LockIcon size={16} color="#a1a1aa" />
                  <Text className="text-sm font-medium text-zinc-400">Reserved</Text>
                </>
              ) : (
                <>
                  <ShoppingCartIcon />
                  <Text className="text-sm font-medium text-white">Purchase NFT</Text>
                </>
              )}
            </Pressable>
          )}

          {/* Listed Date */}
          <View className="flex-row items-center gap-1.5 mt-3">
            <CalendarIcon />
            <Text className="text-xs text-zinc-600">Listed {formatRelativeTime(listing.listedAt)}</Text>
          </View>
        </View>
      </View>
    </SizeContainer>
  );
}
