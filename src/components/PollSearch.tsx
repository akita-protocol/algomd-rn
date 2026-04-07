import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Poll } from '../types/algorand';
import { formatRelativeTime } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

function VoteIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 12 2 2 4-4" />
      <Path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <Path d="M22 19H2" />
    </Svg>
  );
}

interface PollSearchProps {
  data: Poll[];
  onSelect?: (poll: Poll) => void;
  placeholder?: string;
  className?: string;
}

export function PollSearch({
  data,
  onSelect,
  placeholder = 'Search polls...',
  className,
}: PollSearchProps) {
  const [selected, setSelected] = useState<Poll | null>(null);

  const handleSelect = useCallback(
    (poll: Poll) => {
      setSelected(poll);
      onSelect?.(poll);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (poll: Poll) => (
      <View className="flex-row items-center gap-3">
        <VoteIcon size={16} color={poll.status === 'active' ? '#34d399' : '#71717a'} />
        <View className="flex-1">
          <Text className="text-sm font-medium text-white" numberOfLines={1}>
            {poll.question}
          </Text>
          <Text className="text-xs text-zinc-400">
            {poll.totalVotes} votes - {poll.options.length} options - {formatRelativeTime(poll.createdAt)}
          </Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full ${poll.status === 'active' ? 'bg-green-500/20' : 'bg-zinc-700'}`}>
          <Text className={`text-xs font-medium ${poll.status === 'active' ? 'text-green-400' : 'text-zinc-400'}`}>
            {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
          </Text>
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected Poll</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
