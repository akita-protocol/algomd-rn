import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import type { AlgorandAccount } from '../types/algorand';
import { formatAddress } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

function OnlineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8">
      <SvgCircle cx="4" cy="4" r="4" fill={isOnline ? '#34d399' : '#71717a'} />
    </Svg>
  );
}

interface AccountSearchProps {
  data: AlgorandAccount[];
  onSelect?: (account: AlgorandAccount) => void;
  placeholder?: string;
  className?: string;
}

export function AccountSearch({
  data,
  onSelect,
  placeholder = 'Search accounts...',
  className,
}: AccountSearchProps) {
  const [selected, setSelected] = useState<AlgorandAccount | null>(null);

  const handleSelect = useCallback(
    (account: AlgorandAccount) => {
      setSelected(account);
      onSelect?.(account);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (account: AlgorandAccount) => (
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center">
          <Text className="text-xs text-zinc-400">AC</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-mono font-medium text-white" numberOfLines={1}>
            {formatAddress(account.address)}
          </Text>
          <Text className="text-xs text-zinc-400">
            {account.balance / 1_000_000} ALGO - {account.assets.length} assets
          </Text>
        </View>
        <OnlineIndicator isOnline={account.isOnline} />
      </View>
    ),
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected Account</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
