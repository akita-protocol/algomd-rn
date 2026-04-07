import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { TradeOffer as TradeOfferType, ASA, AlgorandAccount, ComponentSize } from '../types/algorand';
import { formatAddress, formatRelativeTime } from '../utils/format';
import { CopyButton } from '../ui/CopyButton';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';

function ArrowRightLeftIcon({ size = 20, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </Svg>
  );
}

function SwapIcon({ size = 20, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 3l4 4-4 4" />
      <Path d="M20 7H4" />
      <Path d="M8 21l-4-4 4-4" />
      <Path d="M4 17h16" />
    </Svg>
  );
}

function CheckIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

function XIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </Svg>
  );
}

function ClockIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

function MessageIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Svg>
  );
}

// Helper to determine if something is an ASA
function isASA(item: ASA | AlgorandAccount): item is ASA {
  return 'unitName' in item;
}

function AssetItem({ asset, imageUrl }: { asset: ASA | AlgorandAccount; imageUrl?: string }) {
  if (isASA(asset)) {
    const isNFT = asset.total === 1 && asset.decimals === 0;
    return (
      <View className="flex-row items-center gap-3 p-3 rounded-lg bg-zinc-800/50 mb-2">
        {imageUrl && (
          <View className={`w-10 h-10 overflow-hidden bg-zinc-700 ${isNFT ? 'rounded-lg' : 'rounded-full'}`}>
            <Image source={{ uri: imageUrl }} style={{ width: 40, height: 40 }} contentFit="cover" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-sm font-medium text-white" numberOfLines={1}>{asset.name}</Text>
          <Text className="text-xs text-zinc-400">{asset.unitName} - #{asset.id}</Text>
        </View>
        {asset.price !== undefined && (
          <Text className="text-xs font-medium text-green-400">${asset.price}</Text>
        )}
      </View>
    );
  }

  // AlgorandAccount
  return (
    <View className="flex-row items-center gap-3 p-3 rounded-lg bg-zinc-800/50 mb-2">
      <View className="w-10 h-10 rounded-full bg-zinc-700 items-center justify-center">
        <Text className="text-xs text-zinc-400">ACC</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-mono text-white" numberOfLines={1}>
          {formatAddress(asset.address)}
        </Text>
        <Text className="text-xs text-zinc-400">ALGO Account</Text>
      </View>
    </View>
  );
}

function AssetGroup({ title, assets }: { title: string; assets: (ASA | AlgorandAccount)[] }) {
  if (assets.length === 0) {
    return (
      <View className="p-3 rounded-lg border-2 border-dashed border-zinc-700 items-center">
        <Text className="text-sm text-zinc-400">No assets</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-sm font-medium text-zinc-300 mb-2">{title}</Text>
      {assets.map((asset, index) => (
        <AssetItem key={`${isASA(asset) ? asset.id : asset.address}-${index}`} asset={asset} />
      ))}
    </View>
  );
}

interface TradeOfferProps {
  data: TradeOfferType;
  showActions?: boolean;
  size?: ComponentSize;
  className?: string;
  currentUserAddress?: string;
  onAccept?: (offer: TradeOfferType) => void;
  onReject?: (offer: TradeOfferType) => void;
}

export function TradeOfferComponent({
  data: offer,
  showActions = true,
  size = 'full',
  className,
  currentUserAddress,
  onAccept,
  onReject,
}: TradeOfferProps) {
  const isExpired = new Date() > offer.expiresAt;
  const isRecipient = currentUserAddress ? offer.recipients.includes(currentUserAddress) : false;
  const canRespond = isRecipient && offer.status === 'pending' && !isExpired;

  const statusVariant =
    offer.status === 'pending'
      ? 'info'
      : offer.status === 'accepted'
        ? 'success'
        : offer.status === 'rejected'
          ? 'error'
          : 'neutral';

  const isFullscreen = size === 'fullscreen';

  return (
    <SizeContainer size={size} className={className}>
      <View
        className={`rounded-2xl ${isFullscreen ? 'border border-zinc-800' : 'bg-zinc-900/80'}`}
      >
        {/* Header */}
        <View className="px-5 py-3 border-b border-zinc-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-white">
                {isRecipient ? 'Incoming Trade' : 'Trade Offer'}
              </Text>
              <StatusBadge
                label={offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                variant={statusVariant}
              />
              {isExpired && <StatusBadge label="Expired" variant="error" />}
            </View>
            <View className="flex-row items-center gap-1">
              <ClockIcon size={14} color="#a1a1aa" />
              <Text className="text-xs font-mono text-zinc-300">
                {formatRelativeTime(offer.expiresAt)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 mt-1">
            <Text className="text-xs font-mono text-zinc-400">
              From {formatAddress(offer.creator)}
            </Text>
            <CopyButton value={offer.creator} size={12} color="#71717a" />
          </View>
        </View>

        {/* Trade Content */}
        <View className="p-5">
          {/* Offering */}
          <AssetGroup title="Offering" assets={offer.offering} />

          {/* Swap Icon */}
          <View className="items-center py-3">
            <View className="p-2 rounded-full bg-zinc-800/60">
              <SwapIcon size={20} color="#a1a1aa" />
            </View>
          </View>

          {/* Requesting */}
          <AssetGroup title="Requesting" assets={offer.requesting} />
        </View>

        {/* Message */}
        {offer.message && (
          <View className="px-5 pb-3 border-t border-zinc-800 pt-3">
            <View className="bg-blue-500/5 rounded-xl px-3 py-2.5">
              <View className="flex-row items-start gap-2">
                <MessageIcon size={14} color="#60a5fa" />
                <Text className="text-sm text-blue-200 flex-1 leading-5">{offer.message}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {showActions && canRespond && (
          <View className="px-5 pb-5 flex-row gap-3">
            <Pressable
              onPress={() => onReject?.(offer)}
              className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/20"
            >
              <XIcon size={16} color="#fca5a5" />
              <Text className="text-sm font-medium text-red-300">Reject</Text>
            </Pressable>

            <Pressable
              onPress={() => onAccept?.(offer)}
              className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-600"
            >
              <CheckIcon size={16} color="#fff" />
              <Text className="text-sm font-medium text-white">Accept</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SizeContainer>
  );
}
