import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { RaffleListing as RaffleListingType, ComponentSize } from '../types/algorand';
import { formatCurrency, formatRelativeTime } from '../utils/format';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';

function TicketIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <Path d="M13 5v2" />
      <Path d="M13 17v2" />
      <Path d="M13 11v2" />
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

function TimerIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 2h4" />
      <Path d="M12 14V6" />
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
    </Svg>
  );
}

interface RaffleListingProps {
  data: RaffleListingType;
  showEntryButton?: boolean;
  size?: ComponentSize;
  className?: string;
  imageUrl?: string;
  onEnter?: (raffle: RaffleListingType) => void;
}

export function RaffleListingComponent({
  data: raffle,
  showEntryButton = true,
  size = 'full',
  className,
  imageUrl,
  onEnter,
}: RaffleListingProps) {
  const isActive = raffle.status === 'active';
  const isUpcoming = raffle.status === 'upcoming';
  const ticketsRemaining = raffle.ticketCount - raffle.entryCount;
  const progressPercentage = (raffle.entryCount / raffle.ticketCount) * 100;

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
                <TicketIcon size={16} color={isActive ? '#34d399' : '#71717a'} />
                <Text className="text-sm font-medium text-zinc-400">Raffle Event</Text>
                <StatusBadge
                  label={raffle.status.charAt(0).toUpperCase() + raffle.status.slice(1)}
                  variant={statusVariant}
                />
                <View className="px-2 py-0.5 rounded-full bg-zinc-700">
                  <Text className="text-xs font-medium text-white">
                    {raffle.entryCount}/{raffle.ticketCount} entries
                  </Text>
                </View>
              </View>
              <Text className="text-base font-bold text-white mb-1">{raffle.title}</Text>
              <Text className="text-sm text-zinc-300 leading-5">{raffle.description}</Text>
            </View>
          </View>

          {/* Prize Pool */}
          <View className="mb-4 bg-yellow-500/5 rounded-xl px-3 py-2.5">
            <View className="flex-row items-center gap-2 mb-2">
              <TrophyIcon size={16} color="#eab308" />
              <Text className="text-sm font-medium text-yellow-300">Prize Pool</Text>
            </View>
            {raffle.prizes.map((prize, index) => (
              <View key={index} className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-medium text-white">{prize.name}</Text>
                <Text className="text-xs font-mono text-yellow-300">#{prize.id}</Text>
              </View>
            ))}
          </View>

          {/* Entry Stats */}
          <View className="flex-row gap-6 mb-4">
            <View>
              <Text className="text-2xl font-bold text-white">
                {formatCurrency(raffle.pricePerEntry, raffle.entryAsset.unitName)}
              </Text>
              <Text className="text-xs text-zinc-400">Per Entry</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {raffle.entryCount}/{raffle.ticketCount}
              </Text>
              <Text className="text-xs text-zinc-400">Entries</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">{ticketsRemaining}</Text>
              <Text className="text-xs text-zinc-400">Remaining</Text>
            </View>
          </View>

          {/* Progress */}
          <View className="mb-4">
            <ProgressBar
              percentage={progressPercentage}
              trackClass="bg-zinc-800"
              fillClass="bg-purple-500"
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-zinc-400">{progressPercentage.toFixed(1)}% sold</Text>
              <Text className="text-xs text-zinc-400">{ticketsRemaining} left</Text>
            </View>
          </View>

          {/* Timing */}
          <View className="flex-row items-center gap-2 mb-4">
            <CalendarIcon size={16} />
            <Text className="text-sm text-zinc-300">
              {isUpcoming ? 'Starts' : isActive ? 'Ends' : 'Ended'}{' '}
              {formatRelativeTime(isUpcoming ? raffle.startTime : raffle.endTime)}
            </Text>
          </View>

          {/* Entry Button */}
          {showEntryButton && (isActive || isUpcoming) && (
            <Pressable
              onPress={() => isActive && ticketsRemaining > 0 && onEnter?.(raffle)}
              disabled={!isActive || ticketsRemaining === 0}
              className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl ${
                !isActive || ticketsRemaining === 0
                  ? 'bg-zinc-800/50'
                  : 'bg-purple-600'
              }`}
            >
              {!isActive ? (
                <>
                  <TimerIcon size={16} color="#a1a1aa" />
                  <Text className="text-sm font-medium text-zinc-400">
                    {isUpcoming ? 'Not Started' : 'Raffle Ended'}
                  </Text>
                </>
              ) : ticketsRemaining === 0 ? (
                <Text className="text-sm font-medium text-zinc-400">Sold Out</Text>
              ) : (
                <>
                  <TicketIcon size={16} color="#fff" />
                  <Text className="text-sm font-medium text-white">Enter Raffle</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}
