import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { TransactionDetails } from '../types/algorand';
import { formatAddress, formatCurrency, formatRelativeTime } from '../utils/format';
import { SearchSheet } from '../ui/SearchSheet';

function CheckCircleIcon({ size = 12, color = '#34d399' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Path d="m9 11 3 3L22 4" />
    </Svg>
  );
}

function ClockIcon({ size = 12, color = '#facc15' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

const TYPE_LABELS: Record<string, string> = {
  payment: 'Payment',
  'asset-transfer': 'Asset Transfer',
  'application-call': 'App Call',
  'asset-config': 'Asset Config',
  'key-registration': 'Key Registration',
  'asset-freeze': 'Asset Freeze',
};

interface TransactionSearchProps {
  data: TransactionDetails[];
  onSelect?: (transaction: TransactionDetails) => void;
  placeholder?: string;
  className?: string;
}

export function TransactionSearch({
  data,
  onSelect,
  placeholder = 'Search transactions...',
  className,
}: TransactionSearchProps) {
  const [selected, setSelected] = useState<TransactionDetails | null>(null);

  const handleSelect = useCallback(
    (transaction: TransactionDetails) => {
      setSelected(transaction);
      onSelect?.(transaction);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    (transaction: TransactionDetails) => (
      <View className="flex-row items-center gap-3">
        {transaction.confirmed ? (
          <CheckCircleIcon size={16} color="#34d399" />
        ) : (
          <ClockIcon size={16} color="#facc15" />
        )}
        <View className="flex-1">
          <Text className="text-sm font-mono text-white" numberOfLines={1}>
            {formatAddress(transaction.id)}
          </Text>
          <Text className="text-xs text-zinc-400">
            {TYPE_LABELS[transaction.type] || 'Transaction'} - {formatRelativeTime(transaction.timestamp)}
          </Text>
        </View>
        {transaction.amount !== undefined && (
          <Text className="text-xs font-medium text-white">
            {transaction.asset
              ? formatCurrency(transaction.amount, transaction.asset.unitName)
              : formatCurrency(transaction.amount / 1_000_000, 'ALGO')}
          </Text>
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
          <Text className="text-xs font-medium text-zinc-400 mb-1">Selected Transaction</Text>
          {renderItem(selected)}
        </View>
      )}
    </View>
  );
}
