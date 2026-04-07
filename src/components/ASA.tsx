import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { ASA as ASAType, ComponentSize } from '../types/algorand';
import { formatNumber, formatAssetAmount, formatRelativeTime } from '../utils/format';
import { CopyButton } from '../ui/CopyButton';
import { SizeContainer } from '../ui/SizeContainer';

function ShieldIcon({ size = 16, color = '#60a5fa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Svg>
  );
}

function LockIcon({ size = 16, color = '#fb923c' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 10V7a4 4 0 0 0-8 0v3" />
      <Path d="M5 10h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z" />
    </Svg>
  );
}

function UnlockIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 10V7a4 4 0 0 1 8 0" />
      <Path d="M5 10h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z" />
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

interface ASAProps {
  data: ASAType;
  showDetails?: boolean;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
  imageUrl?: string;
}

export function ASAComponent({
  data: asset,
  showDetails = false,
  compact = false,
  size = 'full',
  className,
  imageUrl,
}: ASAProps) {
  const isNFT = asset.total === 1 && asset.decimals === 0;

  if (compact) {
    return (
      <View className={`flex-row items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-800/60 ${className ?? ''}`}>
        {imageUrl && (
          <View className="w-4 h-4 rounded-full overflow-hidden bg-zinc-700">
            <Image source={{ uri: imageUrl }} style={{ width: 16, height: 16 }} contentFit="cover" />
          </View>
        )}
        {asset.verified && <ShieldIcon size={12} color="#60a5fa" />}
        <Text className="text-xs font-medium text-white">{asset.unitName}</Text>
        {asset.price !== undefined && (
          <Text className="text-xs text-zinc-400">${asset.price}</Text>
        )}
        <CopyButton value={asset.id.toString()} size={12} color="#a1a1aa" />
      </View>
    );
  }

  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        <View className="p-5">
          {/* NFT Image */}
          {isNFT && imageUrl && (
            <View className="mb-4 rounded-2xl overflow-hidden aspect-square">
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <View className="absolute top-2 left-2 flex-row gap-1">
                <View className="px-2 py-1 rounded-full bg-purple-500/20">
                  <Text className="text-xs font-medium text-purple-300">NFT</Text>
                </View>
              </View>
              {asset.verified && (
                <View className="absolute top-2 right-2">
                  <View className="px-2 py-1 rounded-full bg-blue-500/20">
                    <ShieldIcon size={12} color="#93c5fd" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Regular Asset Header */}
          {!isNFT && (
            <View className="flex-row items-center gap-3 mb-4">
              {imageUrl && (
                <View className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800/50">
                  <Image source={{ uri: imageUrl }} style={{ width: 40, height: 40 }} contentFit="cover" />
                </View>
              )}
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-0.5">
                  <Text className="text-sm font-semibold text-white flex-1 mr-2" numberOfLines={1}>
                    {asset.name}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    {asset.verified && <ShieldIcon size={16} color="#60a5fa" />}
                    {asset.defaultFrozen && <LockIcon size={16} />}
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-zinc-400">
                    {asset.unitName} - #{asset.id}
                  </Text>
                  <CopyButton value={asset.id.toString()} size={12} color="#71717a" />
                </View>
              </View>
            </View>
          )}

          {/* NFT Title */}
          {isNFT && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-white mb-1">{asset.name}</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-xs font-mono text-zinc-400">
                  {asset.unitName} - #{asset.id}
                </Text>
                <CopyButton value={asset.id.toString()} size={12} color="#71717a" />
              </View>
            </View>
          )}

          {/* Stats */}
          <View className="flex-row gap-6 mb-3">
            {asset.price !== undefined && (
              <View>
                <Text className="text-2xl font-bold text-white">${formatNumber(asset.price)}</Text>
                <Text className="text-xs text-zinc-400">Price (USD)</Text>
              </View>
            )}
            <View>
              <Text className="text-base font-semibold text-white">
                {formatAssetAmount(asset.total, asset.decimals)}
              </Text>
              <Text className="text-xs text-zinc-400">Supply</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">{asset.decimals}</Text>
              <Text className="text-xs text-zinc-400">Decimals</Text>
            </View>
          </View>

          {/* Details */}
          {showDetails && (
            <View className="pt-3 border-t border-zinc-800">
              <Text className="text-sm font-medium text-white mb-2">Asset Details</Text>

              <View className="flex-row justify-between p-2 rounded-lg bg-zinc-800/50 mb-1">
                <Text className="text-xs text-zinc-300">Default Frozen</Text>
                <View className="flex-row items-center gap-1">
                  {asset.defaultFrozen ? (
                    <>
                      <LockIcon size={12} color="#fb923c" />
                      <Text className="text-xs font-medium text-white">Yes</Text>
                    </>
                  ) : (
                    <>
                      <UnlockIcon size={12} color="#a1a1aa" />
                      <Text className="text-xs font-medium text-white">No</Text>
                    </>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between p-2 rounded-lg bg-zinc-800/50 mb-1">
                <Text className="text-xs text-zinc-300">Creator</Text>
                <Text className="text-xs font-mono text-white">{asset.creator.slice(0, 8)}...</Text>
              </View>

              {asset.url && (
                <View className="flex-row justify-between p-2 rounded-lg bg-zinc-800/50">
                  <Text className="text-xs text-zinc-300">URL</Text>
                  <Text className="text-xs font-mono text-white max-w-[120px]" numberOfLines={1}>
                    {asset.url}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Created Date */}
          <View className="flex-row items-center gap-1.5 mt-3">
            <CalendarIcon />
            <Text className="text-xs text-zinc-600">Created {formatRelativeTime(asset.createdAt)}</Text>
          </View>
        </View>
      </View>
    </SizeContainer>
  );
}
