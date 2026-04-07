import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { ASA } from '../types/algorand';
import { SearchSheet } from '../ui/SearchSheet';

function ShieldIcon({ size = 12, color = '#60a5fa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Svg>
  );
}

interface ASASearchProps {
  data: ASA[];
  onSelect?: (asset: ASA) => void;
  placeholder?: string;
  className?: string;
}

export function ASASearch({
  data,
  onSelect,
  placeholder = 'Search assets...',
  className,
}: ASASearchProps) {
  const [selected, setSelected] = useState<ASA | null>(null);

  const handleSelect = useCallback(
    (asset: ASA) => {
      setSelected(asset);
      onSelect?.(asset);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (asset: ASA) => (
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 rounded-lg bg-zinc-800 items-center justify-center">
          <Text className="text-xs text-zinc-400">{asset.unitName.slice(0, 2)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-medium text-white" numberOfLines={1}>
              {asset.name}
            </Text>
            {asset.verified && <ShieldIcon />}
          </View>
          <Text className="text-xs text-zinc-400">
            {asset.unitName} - #{asset.id}
          </Text>
        </View>
        {asset.price !== undefined && (
          <Text className="text-xs text-zinc-300">${asset.price}</Text>
        )}
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected Asset</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
