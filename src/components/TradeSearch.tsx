import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import type { TradeOffer, ASA, AlgorandAccount } from '../types/algorand';
import { formatAddress, formatRelativeTime } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

function isASA(item: ASA | AlgorandAccount): item is ASA {
  return 'unitName' in item;
}

function summarizeAssets(assets: (ASA | AlgorandAccount)[]): string {
  const asas = assets.filter(isASA);
  const accounts = assets.filter((a) => !isASA(a));
  const parts: string[] = [];
  if (asas.length > 0) parts.push(`${asas.length} asset${asas.length > 1 ? 's' : ''}`);
  if (accounts.length > 0) parts.push(`${accounts.length} account${accounts.length > 1 ? 's' : ''}`);
  return parts.join(', ') || 'Empty';
}

interface TradeSearchProps {
  data: TradeOffer[];
  onSelect?: (offer: TradeOffer) => void;
  placeholder?: string;
  className?: string;
}

export function TradeSearch({
  data,
  onSelect,
  placeholder = 'Search trade offers...',
  className,
}: TradeSearchProps) {
  const [selected, setSelected] = useState<TradeOffer | null>(null);

  const handleSelect = useCallback(
    (offer: TradeOffer) => {
      setSelected(offer);
      onSelect?.(offer);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (offer: TradeOffer) => {
      const statusColor =
        offer.status === 'pending'
          ? 'text-blue-400'
          : offer.status === 'accepted'
            ? 'text-green-400'
            : offer.status === 'rejected'
              ? 'text-red-400'
              : 'text-zinc-400';

      const statusBg =
        offer.status === 'pending'
          ? 'bg-blue-500/20'
          : offer.status === 'accepted'
            ? 'bg-green-500/20'
            : offer.status === 'rejected'
              ? 'bg-red-500/20'
              : 'bg-zinc-700';

      return (
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-lg bg-zinc-800 items-center justify-center">
            <Text className="text-xs text-zinc-400">TR</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-white" numberOfLines={1}>
              {summarizeAssets(offer.offering)} for {summarizeAssets(offer.requesting)}
            </Text>
            <Text className="text-xs text-zinc-400">
              From {formatAddress(offer.creator)} - {formatRelativeTime(offer.createdAt)}
            </Text>
          </View>
          <View className={`px-2 py-0.5 rounded-full ${statusBg}`}>
            <Text className={`text-xs font-medium ${statusColor}`}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Text>
          </View>
        </View>
      );
    },
    [],
  );

  return (
    <View className={className}>
      <SearchSheet
        data={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        renderItem={renderItem}
      />
      {selected && (
        <View className="mt-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected Trade</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
