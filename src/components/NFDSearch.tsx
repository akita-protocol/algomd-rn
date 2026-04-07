import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import type { NFDProfile } from '../types/algorand';
import { formatAddress } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

function VerifiedIcon({ size = 12, color = '#60a5fa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <Path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

interface NFDSearchProps {
  data: NFDProfile[];
  onSelect?: (profile: NFDProfile) => void;
  placeholder?: string;
  className?: string;
}

export function NFDSearch({
  data,
  onSelect,
  placeholder = 'Search NFD profiles...',
  className,
}: NFDSearchProps) {
  const [selected, setSelected] = useState<NFDProfile | null>(null);

  const handleSelect = useCallback(
    (profile: NFDProfile) => {
      setSelected(profile);
      onSelect?.(profile);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (profile: NFDProfile) => (
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden items-center justify-center">
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={{ width: 32, height: 32 }} contentFit="cover" />
          ) : (
            <Text className="text-xs text-zinc-400">NFD</Text>
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-medium text-white" numberOfLines={1}>
              {profile.name}
            </Text>
            {profile.verified && <VerifiedIcon />}
          </View>
          <Text className="text-xs text-zinc-400">{formatAddress(profile.address)}</Text>
        </View>
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected NFD</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
