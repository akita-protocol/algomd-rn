import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { AlgorandAccount, ComponentSize } from '../types/algorand';
import { formatAddress, formatCurrency, formatRelativeTime } from '../utils/format';
import { CopyButton } from '../ui/CopyButton';
import { SizeContainer } from '../ui/SizeContainer';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';

function OnlineIndicator({ isOnline, size = 8 }: { isOnline: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8">
      <SvgCircle cx="4" cy="4" r="4" fill={isOnline ? '#34d399' : '#71717a'} />
    </Svg>
  );
}

function ExternalLinkIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 3h6v6" />
      <Path d="M10 14 21 3" />
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Svg>
  );
}

interface AccountProps {
  data: AlgorandAccount;
  showAssets?: boolean;
  showApps?: boolean;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
  onExternalLink?: (address: string) => void;
}

export function Account({
  data: account,
  showAssets = false,
  showApps = false,
  compact = false,
  size = 'full',
  className,
  onExternalLink,
}: AccountProps) {
  if (compact) {
    return (
      <View className={`flex-row items-center gap-2 px-2 py-1 rounded-full bg-zinc-800/60 ${className ?? ''}`}>
        <OnlineIndicator isOnline={account.isOnline} />
        <Text className="font-mono text-xs text-white" numberOfLines={1}>
          {formatAddress(account.address)}
        </Text>
        <CopyButton value={account.address} size={12} color="#a1a1aa" />
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
          {/* Header */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-2">
              <View className="flex-row items-center gap-2 mb-1">
                <OnlineIndicator isOnline={account.isOnline} size={10} />
                <Text className="text-xs font-medium text-zinc-400">
                  {account.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
              <Text className="font-mono text-sm font-medium text-white" numberOfLines={1}>
                {formatAddress(account.address)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CopyButton value={account.address} size={16} color="#a1a1aa" />
              {onExternalLink && (
                <Pressable onPress={() => onExternalLink(account.address)} className="p-1.5 rounded-lg" hitSlop={8}>
                  <ExternalLinkIcon size={16} color="#a1a1aa" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Balance */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-white">
              {formatCurrency(account.balance / 1_000_000)}
            </Text>
            <Text className="text-xs text-zinc-400">
              Balance - Round #{account.round.toLocaleString()}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-6 mb-3">
            <View>
              <Text className="text-base font-semibold text-white">
                {account.assets.length}
              </Text>
              <Text className="text-xs text-zinc-400">Assets</Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {account.apps.length}
              </Text>
              <Text className="text-xs text-zinc-400">Apps</Text>
            </View>
          </View>

          {/* Created Date */}
          <Text className="text-xs text-zinc-600 mb-3">
            Created {formatRelativeTime(account.createdAt)}
          </Text>

          {/* Assets List */}
          {showAssets && account.assets.length > 0 && (
            <View className="pt-3 border-t border-zinc-800">
              <Text className="text-sm font-medium text-white mb-2">
                Assets ({account.assets.length})
              </Text>
              {account.assets.slice(0, 3).map((asset) => (
                <View
                  key={asset.id}
                  className="flex-row items-center justify-between p-2 rounded-lg bg-zinc-800/50 mb-1"
                >
                  <Text className="text-xs font-medium text-white flex-1 mr-2" numberOfLines={1}>
                    {asset.name}
                  </Text>
                  <Text className="text-xs font-mono text-zinc-400">{asset.unitName}</Text>
                </View>
              ))}
              {account.assets.length > 3 && (
                <Text className="text-xs text-zinc-500 text-center py-1">
                  +{account.assets.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}
