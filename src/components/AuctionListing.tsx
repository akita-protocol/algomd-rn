import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { AuctionListing as AuctionListingType, ComponentSize } from '../types/algorand';
import { formatCurrency, formatRelativeTime } from '../utils/format';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';

function GavelIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" />
      <Path d="m16 16 6-6" />
      <Path d="m8 8 6-6" />
      <Path d="m9 7 8 8" />
      <Path d="m21 11-8-8" />
    </Svg>
  );
}

function TrophyIcon({ size = 16, color = '#eab308' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </Svg>
  );
}

function TrendingUpIcon({ size = 12, color = '#60a5fa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m22 7-8.5 8.5-5-5L2 17" />
      <Path d="M16 7h6v6" />
    </Svg>
  );
}

function CalendarIcon({ size = 16, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Path d="M3 10h18" />
      <Path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
    </Svg>
  );
}

function TimerIcon({ size = 12, color = '#fb923c' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 2h4" />
      <Path d="M12 14V6" />
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
    </Svg>
  );
}

interface AuctionListingProps {
  data: AuctionListingType;
  showBidButton?: boolean;
  size?: ComponentSize;
  className?: string;
  imageUrl?: string;
  onBid?: (auction: AuctionListingType) => void;
}

export function AuctionListingComponent({
  data: auction,
  showBidButton = true,
  size = 'full',
  className,
  imageUrl,
  onBid,
}: AuctionListingProps) {
  const isActive = auction.status === 'active';
  const isUpcoming = auction.status === 'upcoming';
  const timeRemaining = new Date(auction.endTime).getTime() - new Date().getTime();
  const isEndingSoon = timeRemaining < 24 * 60 * 60 * 1000 && timeRemaining > 0;

  const statusVariant = isActive ? 'success' : isUpcoming ? 'info' : 'neutral';

  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        <View className="p-5">
          {/* Header */}
          <View className="flex-row items-start gap-3 mb-4">
            {imageUrl && (
              <View className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800/50">
                <Image source={{ uri: imageUrl }} style={{ width: 56, height: 56 }} contentFit="cover" />
              </View>
            )}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 flex-wrap mb-1">
                <GavelIcon size={16} color={isActive ? '#34d399' : '#71717a'} />
                <Text className="text-sm font-medium text-zinc-400">Auction Event</Text>
                <StatusBadge
                  label={auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  variant={statusVariant}
                />
                {isActive && isEndingSoon && (
                  <StatusBadge label="Ending Soon" variant="error" />
                )}
                <View className="px-2 py-0.5 rounded-full bg-zinc-700">
                  <Text className="text-xs font-medium text-white">{auction.bidCount} bids</Text>
                </View>
              </View>
              <Text className="text-base font-bold text-white mb-1">{auction.title}</Text>
              <Text className="text-sm text-zinc-300 leading-5">{auction.description}</Text>
            </View>
          </View>

          {/* Auction Item */}
          <View className="mb-4 bg-yellow-500/5 rounded-xl px-3 py-2.5">
            <View className="flex-row items-center gap-2 mb-2">
              <TrophyIcon size={16} color="#eab308" />
              <Text className="text-sm font-medium text-yellow-300">Auction Item</Text>
            </View>
            {auction.prizes.map((prize, index) => (
              <View key={index} className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-medium text-white">{prize.name}</Text>
                <Text className="text-xs font-mono text-yellow-300">#{prize.id}</Text>
              </View>
            ))}
          </View>

          {/* Bid Stats */}
          <View className="flex-row gap-6 mb-4">
            <View>
              <Text className="text-2xl font-bold text-white">
                {formatCurrency(auction.currentHighestBid, auction.bidAsset.unitName)}
              </Text>
              <Text className="text-xs text-zinc-400">Current Bid</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {formatCurrency(auction.minimumNextBid, auction.bidAsset.unitName)}
              </Text>
              <Text className="text-xs text-zinc-400">Min Next Bid</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">{auction.bidCount}</Text>
              <Text className="text-xs text-zinc-400">Total Bids</Text>
            </View>
          </View>

          {/* Bid Fee Pool */}
          {auction.bidFeePercentage && auction.currentBidFeePool > 0 && (
            <View className="mb-4 bg-blue-500/5 rounded-xl px-3 py-2.5">
              <View className="flex-row items-center gap-1.5 mb-1">
                <TrendingUpIcon size={12} color="#60a5fa" />
                <Text className="text-xs font-medium text-blue-300">
                  Bid Fee Pool ({auction.bidFeePercentage}%)
                </Text>
              </View>
              <Text className="text-xs text-blue-200">
                {formatCurrency(auction.currentBidFeePool, auction.bidAsset.unitName)} collected
              </Text>
            </View>
          )}

          {/* Timing */}
          <View className="flex-row items-center gap-6 mb-4">
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={16} />
              <Text className="text-sm text-zinc-300">
                {isUpcoming ? 'Starts' : isActive ? 'Ends' : 'Ended'}{' '}
                {formatRelativeTime(isUpcoming ? auction.startTime : auction.endTime)}
              </Text>
            </View>
            {auction.timeExtended && (
              <View className="flex-row items-center gap-1">
                <TimerIcon size={12} color="#fb923c" />
                <Text className="text-xs text-orange-300">Extended</Text>
              </View>
            )}
          </View>

          {/* Bid Button */}
          {showBidButton && (isActive || isUpcoming) && (
            <Pressable
              onPress={() => isActive && onBid?.(auction)}
              disabled={!isActive}
              className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl ${
                !isActive ? 'bg-zinc-800/50' : 'bg-purple-600'
              }`}
            >
              {!isActive ? (
                <>
                  <TimerIcon size={16} color="#a1a1aa" />
                  <Text className="text-sm font-medium text-zinc-400">
                    {isUpcoming ? 'Not Started' : 'Auction Ended'}
                  </Text>
                </>
              ) : (
                <>
                  <GavelIcon size={16} color="#fff" />
                  <Text className="text-sm font-medium text-white">Place Bid</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}
