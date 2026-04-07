import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { TransactionDetails as TransactionDetailsType, ComponentSize } from '../types/algorand';
import { formatAddress, formatCurrency, formatRelativeTime } from '../utils/format';
import { CopyButton } from '../ui/CopyButton';
import { SizeContainer } from '../ui/SizeContainer';
import { StatusBadge } from '../ui/StatusBadge';

function ArrowRightIcon({ size = 16, color = '#71717a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </Svg>
  );
}

function DollarIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2v20" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

function ZapIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </Svg>
  );
}

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

const CONTEXT_LABELS: Record<string, string> = {
  'nft-purchase': 'NFT Purchase',
  'auction-won': 'Auction Won',
  'raffle-entry': 'Raffle Entry',
  'trade-offer': 'Trade Offer',
  vote: 'Vote Cast',
};

interface TransactionDetailsProps {
  data: TransactionDetailsType;
  showContext?: boolean;
  showFee?: boolean;
  compact?: boolean;
  size?: ComponentSize;
  className?: string;
}

export function TransactionDetailsComponent({
  data: transaction,
  showContext = true,
  showFee = true,
  compact = false,
  size = 'full',
  className,
}: TransactionDetailsProps) {
  const typeLabel = TYPE_LABELS[transaction.type] || 'Transaction';
  const contextLabel = transaction.context ? CONTEXT_LABELS[transaction.context.type] || 'Event' : null;

  function getTypeIcon() {
    switch (transaction.type) {
      case 'payment':
        return <DollarIcon size={16} color="#a1a1aa" />;
      case 'application-call':
        return <ZapIcon size={16} color="#a1a1aa" />;
      default:
        return <ArrowRightIcon size={16} color="#a1a1aa" />;
    }
  }

  if (compact) {
    return (
      <View className={`flex-row items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-800/60 ${className ?? ''}`}>
        {transaction.confirmed ? (
          <CheckCircleIcon size={12} color="#34d399" />
        ) : (
          <ClockIcon size={12} color="#facc15" />
        )}
        <Text className="text-xs font-mono text-white" numberOfLines={1}>
          {formatAddress(transaction.id)}
        </Text>
        <CopyButton value={transaction.id} size={12} color="#a1a1aa" />
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
          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2 flex-wrap">
              {getTypeIcon()}
              <Text className="text-sm font-medium text-zinc-400">{typeLabel}</Text>
              <StatusBadge
                label={transaction.confirmed ? 'Confirmed' : 'Pending'}
                variant={transaction.confirmed ? 'success' : 'warning'}
                icon={
                  transaction.confirmed ? (
                    <CheckCircleIcon size={10} color="#34d399" />
                  ) : (
                    <ClockIcon size={10} color="#facc15" />
                  )
                }
              />
              {contextLabel && (
                <StatusBadge label={contextLabel} variant="info" />
              )}
            </View>

            <Text className="text-sm font-mono font-medium text-white mb-1">Transaction Details</Text>
            <Text className="text-xs font-mono text-zinc-400 mb-2">
              {formatAddress(transaction.id)}
            </Text>
            <CopyButton value={transaction.id} size={14} color="#a1a1aa" />
          </View>

          {/* Transaction Flow */}
          <View className="flex-row items-center gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-xs font-medium text-zinc-400 mb-1">From</Text>
              <Text className="text-sm font-mono text-white" numberOfLines={1}>
                {formatAddress(transaction.from)}
              </Text>
            </View>
            <ArrowRightIcon size={16} color="#71717a" />
            <View className="flex-1">
              <Text className="text-xs font-medium text-zinc-400 mb-1">To</Text>
              <Text className="text-sm font-mono text-white" numberOfLines={1}>
                {transaction.to ? formatAddress(transaction.to) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Amount */}
          {transaction.amount !== undefined && (
            <View className="mb-4">
              <Text className="text-2xl font-bold text-white">
                {transaction.asset
                  ? formatCurrency(transaction.amount, transaction.asset.unitName)
                  : formatCurrency(transaction.amount / 1_000_000, 'ALGO')}
              </Text>
              <Text className="text-xs text-zinc-400">
                {transaction.asset
                  ? `${transaction.asset.name || transaction.asset.unitName} Transfer`
                  : 'ALGO Payment'}
              </Text>
            </View>
          )}

          {/* Context */}
          {showContext && transaction.context && (
            <View className="mb-4 bg-blue-500/5 rounded-xl px-3 py-2.5">
              <Text className="text-sm font-medium text-blue-400 mb-2">{contextLabel}</Text>
              {transaction.context.metadata &&
                Object.entries(transaction.context.metadata).map(([key, value]) => (
                  <View key={key} className="flex-row justify-between mb-1">
                    <Text className="text-xs text-blue-300 capitalize">
                      {key.replace('_', ' ')}
                    </Text>
                    <Text className="text-xs font-medium text-white">
                      {typeof value === 'number' ? formatCurrency(value) : String(value)}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {/* Details Grid */}
          <View className="flex-row gap-6 mb-3">
            <View>
              <Text className="text-base font-semibold text-white">
                #{transaction.round.toLocaleString()}
              </Text>
              <Text className="text-xs text-zinc-400">Round</Text>
            </View>
            {showFee && (
              <View>
                <Text className="text-base font-semibold text-white">
                  {formatCurrency(transaction.fee / 1_000_000, 'ALGO')}
                </Text>
                <Text className="text-xs text-zinc-400">Fee</Text>
              </View>
            )}
            <View>
              <Text className="text-base font-semibold text-white">
                {formatRelativeTime(transaction.timestamp)}
              </Text>
              <Text className="text-xs text-zinc-400">Time</Text>
            </View>
          </View>

          {/* Note */}
          {transaction.note && (
            <View className="p-3 rounded-lg bg-zinc-800/50">
              <Text className="text-xs font-medium text-zinc-400 mb-1">Note</Text>
              <Text className="text-sm text-zinc-300">{transaction.note}</Text>
            </View>
          )}
        </View>
      </View>
    </SizeContainer>
  );
}
