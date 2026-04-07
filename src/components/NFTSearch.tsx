import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import type { NFTListing } from '../types/algorand';
import { formatCurrency } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

interface NFTSearchProps {
  data: NFTListing[];
  onSelect?: (listing: NFTListing) => void;
  placeholder?: string;
  className?: string;
}

export function NFTSearch({
  data,
  onSelect,
  placeholder = 'Search NFTs...',
  className,
}: NFTSearchProps) {
  const [selected, setSelected] = useState<NFTListing | null>(null);

  const handleSelect = useCallback(
    (listing: NFTListing) => {
      setSelected(listing);
      onSelect?.(listing);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (listing: NFTListing) => (
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 rounded-lg bg-zinc-800 items-center justify-center">
          <Text className="text-xs text-zinc-400">NFT</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-white" numberOfLines={1}>
            {listing.nft.name}
          </Text>
          <Text className="text-xs text-zinc-400">
            {listing.collection || `#${listing.nft.id}`}
          </Text>
        </View>
        <Text className="text-xs font-medium text-white">
          {formatCurrency(listing.price, listing.currency)}
        </Text>
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected NFT</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
