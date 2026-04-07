import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Svg, { Path } from 'react-native-svg';
import type { SearchableEntity, SearchResult } from '../types/algorand';
import { searchEntities } from '../utils/search';

function SearchIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

interface SearchSheetProps<T extends SearchableEntity> {
  data: T[];
  placeholder?: string;
  onSelect?: (item: T) => void;
  renderItem: (item: T) => React.ReactElement;
  className?: string;
}

export function SearchSheet<T extends SearchableEntity>({
  data,
  placeholder = 'Search...',
  onSelect,
  renderItem,
  className,
}: SearchSheetProps<T>) {
  const sheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return data.slice(0, 10).map((item) => ({ item, score: 1, matches: [] as string[] }));
    }
    return searchEntities(data, query, 10);
  }, [data, query]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleSelect = useCallback(
    (item: T) => {
      onSelect?.(item);
      setQuery('');
      sheetRef.current?.close();
    },
    [onSelect],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const renderResultItem = useCallback(
    ({ item }: { item: SearchResult<T> }) => (
      <Pressable
        onPress={() => handleSelect(item.item)}
        className="px-4 py-3 border-b border-zinc-800"
      >
        {renderItem(item.item)}
      </Pressable>
    ),
    [handleSelect, renderItem],
  );

  return (
    <View className={className}>
      {/* Search Trigger Button */}
      <Pressable
        onPress={handleOpen}
        className="flex-row items-center gap-2 px-3 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900"
      >
        <SearchIcon size={16} color="#71717a" />
        <Text className="flex-1 text-sm text-zinc-500">{placeholder}</Text>
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#18181b' }}
        handleIndicatorStyle={{ backgroundColor: '#52525b' }}
        onChange={(index) => {
          if (index === -1) setIsOpen(false);
        }}
      >
        <BottomSheetView className="flex-1 px-4 pt-2">
          {/* Search Input */}
          <View className="flex-row items-center gap-2 px-3 py-2 mb-3 rounded-lg border border-zinc-700 bg-zinc-800">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              placeholderTextColor="#71717a"
              className="flex-1 text-sm text-white p-0"
              autoFocus={isOpen}
            />
          </View>

          {/* Results */}
          <FlashList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item, index) => `search-${index}`}
            ListEmptyComponent={
              <View className="py-8 items-center">
                <Text className="text-sm text-zinc-500">
                  {query.trim() ? 'No results found.' : 'No items available.'}
                </Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
